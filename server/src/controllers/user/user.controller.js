const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../../services/user/user.service");
const { updateProfileSchema } = require("../../validators/user");

exports.updateProfile = asyncHandler(async (req, res) => {
  res.json(await userService.updateProfile(req.user, updateProfileSchema.parse(req.body)));
});

exports.getCourses = asyncHandler(async (req, res) => {
  res.json(await userService.listCourses(req.user));
});
