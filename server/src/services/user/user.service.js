const User = require("../../models/user");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { hashPassword } = require("../../utils/tokens");

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

const updateProfile = async (user, input) => {
  await ensureUnique(user._id, input);
  const updated = await User.findByIdAndUpdate(user._id, await buildChanges(input), {
    new: true,
    runValidators: true,
  });
  if (!updated) throw AppError.notFound("User not found");
  return updated.toJSON();
};

const listCourses = (user) => CourseUser.find({ user: user._id }).populate("course").sort({ _id: -1 }).lean();

module.exports = { updateProfile, listCourses, ensureUnique, buildChanges };
