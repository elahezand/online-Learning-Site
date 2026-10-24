const asyncHandler = require("../../utils/asyncHandler");
const menuService = require("../../services/admin/menu.service");
const { idParams } = require("../../validators/common");
const { createMenuSchema } = require("../../validators/menu");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await menuService.create(createMenuSchema.parse(req.body)));
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = idParams("Menu id").parse(req.params);
  res.json(await menuService.remove(id));
});
