const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../../services/admin/user.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await userService.list());
});

exports.edit = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await userService.edit(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await userService.remove(req.user, req.parsed.data.id));
});

exports.ban = asyncHandler(async (req, res) => {
  res.json(await userService.ban(req.user, req.parsed.data.id));
});

exports.changeRole = asyncHandler(async (req, res) => {
  res.json(await userService.changeRole(req.user, req.parsed.data));
});