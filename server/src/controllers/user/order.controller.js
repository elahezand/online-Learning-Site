const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("../../services/user/order.service");
const { idParams } = require("../../validators/common");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await orderService.list(req.user));
});

exports.getOne = asyncHandler(async (req, res) => {
  const { id } = idParams("Order id").parse(req.params);
  res.json(await orderService.getOne(req.user, id));
});
