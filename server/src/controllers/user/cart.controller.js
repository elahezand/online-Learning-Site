const asyncHandler = require("../../utils/asyncHandler");
const cartService = require("../../services/user/cart.service");

exports.getMine = asyncHandler(async (req, res) => {
  res.json(await cartService.getMine(req.user));
});

exports.addItem = asyncHandler(async (req, res) => {
  res.status(201).json(await cartService.addItem(req.user, req.parsed.data));
});

exports.removeItem = asyncHandler(async (req, res) => {
  res.json(await cartService.removeItem(req.user, req.parsed.data));
});

exports.applyCoupon = asyncHandler(async (req, res) => {
  res.json(await cartService.applyCoupon(req.user, req.parsed.data));
});

exports.removeCoupon = asyncHandler(async (req, res) => {
  res.json(await cartService.removeCoupon(req.user));
});