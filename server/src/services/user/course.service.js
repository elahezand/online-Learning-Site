const Course = require("../../models/course");
const paginate = require("../../utils/paginate");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");

const finalPrice = (course) => Math.round(course.price * (100 - (course.discount ?? 0)) / 100);

const register = async (user, courseId) => {
  const course = await Course.findById(courseId).select("price discount").lean();
  if (!course) throw AppError.notFound("Course not found");
  if (finalPrice(course) > 0) throw AppError.forbidden("This course must be purchased");

  const alreadyRegistered = await CourseUser.exists({ user: user._id, course: courseId });
  if (alreadyRegistered) throw AppError.conflict("You are already registered in this course");

  await CourseUser.create({ user: user._id, course: courseId, price: 0 });
  return { message: "You are registered successfully" };
};

const myCoursesFilter = async (userId, status) => {
  if (status === "free") return { user: userId, price: 0 };
  if (status === "paid") return { user: userId, price: { $gt: 0 } };
  if (status === "completed" || status === "in-progress") {
    const ids = await Course.find({ isComplete: status === "completed" ? 1 : { $ne: 1 } }).distinct("_id");
    return { user: userId, course: { $in: ids } };
  }
  return { user: userId };
};

const listCourses = async (user, { status, page, limit }) =>
  paginate(CourseUser, {
    filter: await myCoursesFilter(user._id, status),
    sort: { _id: -1 },
    page,
    limit,
    populate: [{ path: "course", select: "name shortName cover price isComplete" }],
  });

module.exports = { register, listCourses };
