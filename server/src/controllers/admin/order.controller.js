const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("../../services/admin/order.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await orderService.list(req.parsed.data));
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await orderService.getOne(req.parsed.data.id));
});

exports.update = asyncHandler(async (req, res) => {
  const { id, ...data } = req.parsed.data;
  res.json(await orderService.update(id, data));
});

exports.cancelItem = asyncHandler(async (req, res) => {
  const { id, itemId } = req.parsed.data;
  res.json(await orderService.cancelItem(id, itemId));
});

exports.runSweeps = asyncHandler(async (req, res) => {
  res.json(await orderService.runSweeps());
});