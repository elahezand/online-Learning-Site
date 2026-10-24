const Course = require("../../models/course");
const Category = require("../../models/category");
const Session = require("../../models/session");
const Comment = require("../../models/comment");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { withStats } = require("../shared/course-summary");
const { nestAnswers } = require("../shared/comment-tree");
const { PUBLIC_USER } = require("../shared/selects");

const RELATED_LIMIT = 4;

const findCourses = (filter = {}) =>
  Course.find(filter).populate("creator", "name").populate("categoryID").sort({ _id: -1 }).lean();

const list = async () => withStats(await findCourses());

const listPresell = async () => withStats(await findCourses({ status: "presell" }));

const listPopular = async () => {
  const courses = await withStats(await findCourses());
  return courses.sort((a, b) => b.registers - a.registers || b.courseAverageScore - a.courseAverageScore);
};

const listByCategory = async (categoryName) => {
  const category = await Category.findOne({ name: categoryName }).lean();
  if (!category) return [];
  return withStats(await findCourses({ categoryID: category._id }));
};

const findByShortName = async (shortName) => {
  const course = await Course.findOne({ shortName }).lean();
  if (!course) throw AppError.notFound("Course not found");
  return course;
};

const hideVideos = (sessions, canWatch) =>
  sessions.map((session) => (canWatch || session.free === 1 ? session : { ...session, video: undefined }));

const getByShortName = async (shortName, user) => {
  const course = await Course.findOne({ shortName })
    .populate("categoryID")
    .populate("creator", PUBLIC_USER)
    .lean();
  if (!course) throw AppError.notFound("Course not found");

  const [sessions, comments, courseStudentsCount, registration] = await Promise.all([
    Session.find({ course: course._id }).sort({ _id: 1 }).lean(),
    Comment.find({ course: course._id, answer: 1 }).populate("creator", PUBLIC_USER).sort({ _id: -1 }).lean(),
    CourseUser.countDocuments({ course: course._id }),
    user ? CourseUser.exists({ user: user._id, course: course._id }) : null,
  ]);

  const isUserRegisteredToThisCourse = Boolean(registration);
  const canWatch = isUserRegisteredToThisCourse || user?.role === "ADMIN";

  return {
    ...course,
    courseStudentsCount,
    sessions: hideVideos(sessions, canWatch),
    comments: nestAnswers(comments),
    isUserRegisteredToThisCourse,
  };
};

const listRelated = async (shortName) => {
  const course = await findByShortName(shortName);
  return Course.find({ categoryID: course.categoryID, _id: { $ne: course._id } })
    .sort({ _id: -1 })
    .limit(RELATED_LIMIT)
    .lean();
};

module.exports = {
  list,
  listPresell,
  listPopular,
  listByCategory,
  findByShortName,
  hideVideos,
  getByShortName,
  listRelated,
};
