const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../../services/admin/user.service");
const { idParams } = require("../../validators/common");
const { editUserSchema, changeRoleSchema } = require("../../validators/user");

const userId = (req) => idParams("User id").parse(req.params).id;

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await userService.list());
});

exports.edit = asyncHandler(async (req, res) => {
  const id = userId(req);
  res.json(await userService.edit(id, editUserSchema.parse(req.body)));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await userService.remove(req.user, userId(req)));
});

exports.ban = asyncHandler(async (req, res) => {
  res.json(await userService.ban(req.user, userId(req)));
});

exports.changeRole = asyncHandler(async (req, res) => {
  res.json(await userService.changeRole(req.user, changeRoleSchema.parse(req.body)));
});
