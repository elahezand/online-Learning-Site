const asyncHandler = require("../../utils/asyncHandler");
const menuService = require("../../services/admin/menu.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await menuService.create(req.parsed.data));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await menuService.remove(req.parsed.data.id));
});