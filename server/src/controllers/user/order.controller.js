const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("../../services/user/order.service");

exports.checkout = asyncHandler(async (req, res) => {
  const { idempotencyKey, ...data } = req.parsed.data;
  const key = idempotencyKey || req.get("Idempotency-Key") || null;
  res.status(201).json(await orderService.checkout(req.user, { ...data, idempotencyKey: key }));
});

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await orderService.list(req.user, req.parsed.data));
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await orderService.getOne(req.user, req.parsed.data.id));
});

exports.cancel = asyncHandler(async (req, res) => {
  res.json(await orderService.cancel(req.user, req.parsed.data.id));
});