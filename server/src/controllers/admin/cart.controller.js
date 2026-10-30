const asyncHandler = require("../../utils/asyncHandler");
const cartService = require("../../services/admin/cart.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await cartService.list(req.parsed.data));
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await cartService.getOne(req.parsed.data.id));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await cartService.remove(req.parsed.data.id));
});