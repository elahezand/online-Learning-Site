const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const { hashPassword, verifyPassword } = require("../../utils/tokens");
const ensureUnique = async (userId, { username, email }) => {
  const or = [];
  if (username) or.push({ username });
  if (email) or.push({ email });
  if (!or.length) return;
  const taken = await User.exists({ _id: { $ne: userId }, $or: or });
  if (taken) throw AppError.conflict("Username or email is already taken");
};

const buildChanges = async ({ password, ...fields }) => {
  if (password) fields.password = await hashPassword(password);
  return fields;
};
const checkCurrentPassword = async (userId, currentPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user || !(await verifyPassword(currentPassword, user.password))) {
    throw AppError.badRequest("Current password is incorrect");
  }
};

const updateProfile = async (user, { currentPassword, ...input }) => {
  if (input.password) await checkCurrentPassword(user._id, currentPassword);
  await ensureUnique(user._id, input);
  const updated = await User.findByIdAndUpdate(user._id, await buildChanges(input), {
    new: true,
    runValidators: true,
  });
  if (!updated) throw AppError.notFound("User not found");
  return updated.toJSON();
};


module.exports = { updateProfile, ensureUnique, buildChanges };
