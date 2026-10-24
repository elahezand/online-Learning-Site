const asyncHandler = require("../../utils/asyncHandler");
const authService = require("../../services/user/auth.service");

exports.getMe = asyncHandler(async (req, res) => {
  res.json(await authService.getProfile(req.user));
});
