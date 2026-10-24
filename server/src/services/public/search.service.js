const Course = require("../../models/course");
const Article = require("../../models/article");
const { escapeRegex } = require("../../utils/text");

const RESULT_LIMIT = 20;

const search = async (value) => {
  const pattern = new RegExp(escapeRegex(value), "i");
  const [allResultCourses, allResultArticles] = await Promise.all([
    Course.find({ name: pattern }).populate("categoryID").limit(RESULT_LIMIT).lean(),
    Article.find({ title: pattern, publish: 1 }).populate("categoryID").limit(RESULT_LIMIT).lean(),
  ]);
  return { allResultCourses, allResultArticles };
};

module.exports = { search };
