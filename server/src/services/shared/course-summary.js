const CourseUser = require("../../models/course-user");
const Comment = require("../../models/comment");

const BASE_SCORE = 5;

const countBy = (rows) => new Map(rows.map((row) => [String(row._id), row]));

const loadStats = async (courseIds) => {
  const [registers, scores] = await Promise.all([
    CourseUser.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
    Comment.aggregate([
      { $match: { course: { $in: courseIds }, answer: 1, isAnswer: { $ne: 1 } } },
      { $group: { _id: "$course", total: { $sum: "$score" }, count: { $sum: 1 } } },
    ]),
  ]);
  return { registers: countBy(registers), scores: countBy(scores) };
};

const averageScore = (score) =>
  Math.floor((BASE_SCORE + (score?.total ?? 0)) / ((score?.count ?? 0) + 1));

const withStats = async (courses) => {
  if (!courses.length) return [];
  const { registers, scores } = await loadStats(courses.map((course) => course._id));
  return courses.map((course) => {
    const id = String(course._id);
    return {
      ...course,
      creator: course.creator?.name ?? null,
      registers: registers.get(id)?.count ?? 0,
      courseAverageScore: averageScore(scores.get(id)),
    };
  });
};

module.exports = { withStats };
