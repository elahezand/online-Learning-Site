const asyncHandler = require("../../utils/asyncHandler");
const categoryService = require("../../services/admin/category.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await categoryService.create(req.parsed.data));
});

exports.update = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await categoryService.update(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await categoryService.remove(req.parsed.data.id));
});
