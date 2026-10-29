const Course = require("../../models/course");
const Article = require("../../models/article");
const { escapeRegex } = require("../../utils/text");
const { withStats } = require("../shared/course-summary");

const RESULT_LIMIT = 20;

const search = async (value) => {
  const pattern = new RegExp(escapeRegex(value), "i");
  const [courses, allResultArticles] = await Promise.all([
    Course.find({ name: pattern }).populate("categoryID").populate("creator", "name").limit(RESULT_LIMIT).lean(),
    Article.find({ title: pattern, publish: 1 }).populate("categoryID").limit(RESULT_LIMIT).lean(),
  ]);
  return { allResultCourses: await withStats(courses), allResultArticles };
};

module.exports = { search };
