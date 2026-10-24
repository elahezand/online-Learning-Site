const Category = require("../../models/category");
const Course = require("../../models/course");
const Article = require("../../models/article");
const AppError = require("../../utils/AppError");

const ensureNameFree = async (name, exceptId) => {
  const filter = exceptId ? { name, _id: { $ne: exceptId } } : { name };
  if (await Category.exists(filter)) throw AppError.conflict("This category short name is already taken");
};

const create = async (input) => {
  await ensureNameFree(input.name);
  return Category.create(input);
};

const update = async (id, input) => {
  await ensureNameFree(input.name, id);
  const category = await Category.findByIdAndUpdate(id, input, { new: true, runValidators: true }).lean();
  if (!category) throw AppError.notFound("Category not found");
  return category;
};

const remove = async (id) => {
  const [courses, articles] = await Promise.all([
    Course.countDocuments({ categoryID: id }),
    Article.countDocuments({ categoryID: id }),
  ]);
  if (courses || articles) {
    throw AppError.conflict(`This category is used by ${courses} course(s) and ${articles} article(s)`);
  }
  const category = await Category.findByIdAndDelete(id).lean();
  if (!category) throw AppError.notFound("Category not found");
  return category;
};

module.exports = { create, update, remove };
