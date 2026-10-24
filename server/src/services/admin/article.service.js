const Article = require("../../models/article");
const Category = require("../../models/category");
const AppError = require("../../utils/AppError");
const { removeUpload } = require("../../utils/files");
const { PUBLIC_USER } = require("../shared/selects");

const ensureShortNameFree = async (shortName, exceptId) => {
  const filter = exceptId ? { shortName, _id: { $ne: exceptId } } : { shortName };
  if (await Article.exists(filter)) throw AppError.conflict("This article link is already taken");
};

const ensureCategory = async (categoryID) => {
  if (categoryID && !(await Category.exists({ _id: categoryID }))) throw AppError.notFound("Category not found");
};

const populate = (article) =>
  article.populate([{ path: "creator", select: PUBLIC_USER }, { path: "categoryID" }]);

const create = async (user, { cover, ...input }, publish) => {
  await ensureShortNameFree(input.shortName);
  await ensureCategory(input.categoryID);
  const article = await Article.create({
    ...input,
    cover: cover?.filename,
    creator: user._id,
    publish,
  });
  return populate(article);
};

const update = async (id, { cover, ...input }) => {
  const article = await Article.findById(id);
  if (!article) throw AppError.notFound("Article not found");

  if (input.shortName) await ensureShortNameFree(input.shortName, id);
  await ensureCategory(input.categoryID);

  const oldCover = article.cover;
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) article.set(key, value);
  }
  if (cover) article.cover = cover.filename;

  await article.save();
  if (cover && oldCover && oldCover !== cover.filename) removeUpload(oldCover);

  return populate(article);
};

const remove = async (id) => {
  const article = await Article.findByIdAndDelete(id).lean();
  if (!article) throw AppError.notFound("Article not found");
  removeUpload(article.cover);
  return article;
};

module.exports = { create, update, remove };
