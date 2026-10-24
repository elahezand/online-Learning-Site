const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/user/course.service");
const { idParams } = require("../../validators/common");
const { registerSchema, sessionParams } = require("../../validators/course");

exports.register = asyncHandler(async (req, res) => {
  const { id } = idParams("Course id").parse(req.params);
  res.status(201).json(await courseService.register(req.user, id, registerSchema.parse(req.body)));
});

exports.getSession = asyncHandler(async (req, res) => {
  res.json(await courseService.getSession(req.user, sessionParams.parse(req.params)));
});
