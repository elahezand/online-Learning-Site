const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/user/course.service");

exports.register = asyncHandler(async (req, res) => {
  res.status(201).json(await courseService.register(req.user, req.parsed.data.id));
});

exports.getCourses = asyncHandler(async (req, res) => {
  res.json(await courseService.listCourses(req.user, req.parsed.data));
});