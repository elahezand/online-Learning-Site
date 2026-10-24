const asyncHandler = require("../../utils/asyncHandler");
const discountService = require("../../services/admin/discount.service");
const { idParams } = require("../../validators/common");
const { createDiscountSchema, siteWideDiscountSchema } = require("../../validators/discount");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await discountService.create(req.user, createDiscountSchema.parse(req.body)));
});

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await discountService.list());
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = idParams("Discount id").parse(req.params);
  res.json(await discountService.remove(id));
});

exports.setOnAll = asyncHandler(async (req, res) => {
  res.json(await discountService.setOnAllCourses(siteWideDiscountSchema.parse(req.body)));
});

exports.removeFromAll = asyncHandler(async (req, res) => {
  res.json(await discountService.removeFromAllCourses());
});
