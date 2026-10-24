const asyncHandler = require("../../utils/asyncHandler");
const categoryService = require("../../services/public/category.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await categoryService.list());
});
