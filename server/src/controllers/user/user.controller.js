const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../../services/user/user.service");

exports.updateProfile = asyncHandler(async (req, res) => {
  res.json(await userService.updateProfile(req.user, req.parsed.data));
});

exports.getCourses = asyncHandler(async (req, res) => {
  res.json(await userService.listCourses(req.user));
});