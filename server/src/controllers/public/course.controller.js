const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/public/course.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await courseService.list(req.parsed.data));
});

exports.getPopular = asyncHandler(async (req, res) => {
  res.json(await courseService.listPopular(req.parsed.data));
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await courseService.getByShortName(req.parsed.data.shortName, req.user));
});

exports.getRelated = asyncHandler(async (req, res) => {
  res.json(await courseService.listRelated(req.parsed.data.shortName));
});
