const Course = require("../../models/course");
const Session = require("../../models/session");
const Comment = require("../../models/comment");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { withStats } = require("../shared/course-summary");
const { nestAnswers } = require("../shared/comment-tree");
const { PUBLIC_USER } = require("../shared/selects");
const { searchFilter, categoryFilter } = require("../shared/filter");
const paginate = require("../../utils/paginate");

const RELATED_LIMIT = 4;

const SORTS = {
  newest: { _id: -1 },
  oldest: { _id: 1 },
  "price-asc": { price: 1, _id: -1 },
  "price-desc": { price: -1, _id: -1 },
  name: { name: 1 },
};

const buildFilter = async ({ search, category, status, free }) => ({
  ...searchFilter("name", search),
  ...(await categoryFilter(category)),
  ...(status && { status }),
  ...(free === 1 && { price: 0 }),
  ...(free === 0 && { price: { $gt: 0 } }),
});

const list = async ({ page, limit, sort, ...query }) => {
  const result = await paginate(Course, {
    filter: await buildFilter(query),
    sort: SORTS[sort],
    page,
    limit,
    populate: [{ path: "creator", select: "name" }, { path: "categoryID" }],
  });
  return { ...result, items: await withStats(result.items) };
};

const listPopular = async ({ limit }) => {
  const top = await Course.aggregate([
    { $lookup: { from: "courseusers", localField: "_id", foreignField: "course", as: "enrollments" } },
    { $addFields: { enrollmentCount: { $size: "$enrollments" } } },
    { $sort: { enrollmentCount: -1, _id: -1 } },
    { $limit: limit },
    { $project: { enrollments: 0, enrollmentCount: 0 } },
  ]);
  const courses = await Course.populate(top, [{ path: "creator", select: "name" }, { path: "categoryID" }]);
  return withStats(courses);
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
  listPopular,
  findByShortName,
  hideVideos,
  getByShortName,
  listRelated,
};
