const asyncHandler = require("../../utils/asyncHandler");
const discountService = require("../../services/admin/discount.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await discountService.create(req.user, req.parsed.data));
});

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await discountService.list(req.parsed.data));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await discountService.remove(req.parsed.data.id));
});

exports.setOnAll = asyncHandler(async (req, res) => {
  res.json(await discountService.setOnAllCourses(req.parsed.data));
});

exports.removeFromAll = asyncHandler(async (req, res) => {
  res.json(await discountService.removeFromAllCourses());
});