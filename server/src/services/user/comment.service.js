const Comment = require("../../models/comment");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");

const create = async (user, { body, courseShortName, score }) => {
  const course = await Course.findOne({ shortName: courseShortName }).select("_id").lean();
  if (!course) throw AppError.notFound("Course not found");

  return Comment.create({
    body,
    score,
    course: course._id,
    creator: user._id,
    answer: 0,
    isAnswer: 0,
  });
};

module.exports = { create };
