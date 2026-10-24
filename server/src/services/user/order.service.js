const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");

const list = (user) => CourseUser.find({ user: user._id }).populate("course").sort({ _id: -1 }).lean();

const getOne = async (user, id) => {
  const order = await CourseUser.findOne({ _id: id, user: user._id }).populate("course").lean();
  if (!order) throw AppError.notFound("Order not found");
  return order;
};

module.exports = { list, getOne };
