const asyncHandler = require("../../utils/asyncHandler");
const categoryService = require("../../services/admin/category.service");
const { idParams } = require("../../validators/common");
const { categorySchema } = require("../../validators/category");

const categoryId = (req) => idParams("Category id").parse(req.params).id;

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await categoryService.create(categorySchema.parse(req.body)));
});

exports.update = asyncHandler(async (req, res) => {
  const id = categoryId(req);
  res.json(await categoryService.update(id, categorySchema.parse(req.body)));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await categoryService.remove(categoryId(req)));
});
