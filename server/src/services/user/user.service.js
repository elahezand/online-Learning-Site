const bcrypt = require("bcrypt");
const User = require("../../models/user");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { SALT_ROUNDS } = require("../public/auth.service");

const ensureUnique = async (userId, { username, email }) => {
  const or = [];
  if (username) or.push({ username });
  if (email) or.push({ email });
  if (!or.length) return;
  const taken = await User.exists({ _id: { $ne: userId }, $or: or });
  if (taken) throw AppError.conflict("Username or email is already taken");
};

const buildChanges = async ({ password, ...fields }) => {
  const changes = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  if (password) changes.password = await bcrypt.hash(password, SALT_ROUNDS);
  return changes;
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
