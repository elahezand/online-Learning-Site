const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../../services/admin/user.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await userService.list(req.parsed.data));
});

exports.edit = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await userService.edit(req.user, id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await userService.remove(req.user, req.parsed.data.id));
});

exports.ban = asyncHandler(async (req, res) => {
  res.json(await userService.ban(req.user, req.parsed.data.id));
});

exports.unban = asyncHandler(async (req, res) => {
  res.json(await userService.unban(req.parsed.data.id));
});

exports.changeRole = asyncHandler(async (req, res) => {
  res.json(await userService.changeRole(req.user, req.parsed.data));
});