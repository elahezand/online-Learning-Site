const Category = require("../../models/category");
const { escapeRegex } = require("../../utils/text");

const NO_MATCH = { _id: null };

const searchFilter = (field, search) =>
  search ? { [field]: { $regex: escapeRegex(search), $options: "i" } } : {};

const categoryFilter = async (category) => {
  if (!category) return {};
  const found = await Category.findOne({ name: category }).select("_id").lean();
  return found ? { categoryID: found._id } : NO_MATCH;
};

module.exports = { searchFilter, categoryFilter };
