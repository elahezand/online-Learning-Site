const Article = require("../../models/article");
const AppError = require("../../utils/AppError");
const { PUBLIC_USER } = require("../shared/selects");

const list = () =>
  Article.find()
    .populate("creator", PUBLIC_USER)
    .populate("categoryID")
    .sort({ _id: -1 })
    .lean();

const getByShortName = async (shortName) => {
  const article = await Article.findOne({ shortName })
    .populate("creator", PUBLIC_USER)
    .populate("categoryID")
    .lean();
  if (!article) throw AppError.notFound("Article not found");
  return article;
};

module.exports = { list, getByShortName };
