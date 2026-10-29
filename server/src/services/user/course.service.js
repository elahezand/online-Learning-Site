const Course = require("../../models/course");
const Session = require("../../models/session");
const paginate = require("../../utils/paginate");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { findByShortName, hideVideos } = require("../public/course.service");

const register = async (user, courseId, { price }) => {
  const course = await Course.exists({ _id: courseId });
  if (!course) throw AppError.notFound("Course not found");

  const alreadyRegistered = await CourseUser.exists({ user: user._id, course: courseId });
  if (alreadyRegistered) throw AppError.conflict("You are already registered in this course");

  await CourseUser.create({ user: user._id, course: courseId, price });
  return { message: "You are registered successfully" };
};

const getSession = async (user, { shortName, sessionID }) => {
  const course = await findByShortName(shortName);

  const [session, sessions, registered] = await Promise.all([
    Session.findOne({ _id: sessionID, course: course._id }).lean(),
    Session.find({ course: course._id }).sort({ _id: 1 }).lean(),
    CourseUser.exists({ user: user._id, course: course._id }),
  ]);
  if (!session) throw AppError.notFound("Session not found");

  const canWatch = Boolean(registered) || user.role === "ADMIN";
  if (!canWatch && session.free !== 1) {
    throw AppError.forbidden("Register in this course to watch this session");
  }

  return { session, sessions: hideVideos(sessions, canWatch) };
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

module.exports = { register, getSession, listCourses };
