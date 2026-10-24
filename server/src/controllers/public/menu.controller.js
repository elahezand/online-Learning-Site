const asyncHandler = require("../../utils/asyncHandler");
const menuService = require("../../services/public/menu.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await menuService.listTree());
});

exports.getAllForPanel = asyncHandler(async (req, res) => {
  res.json(await menuService.listAll());
});

exports.getTopbar = asyncHandler(async (req, res) => {
  res.json(await menuService.listTopbar());
});
