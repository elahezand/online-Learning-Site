const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/public/course.service");
const { shortNameParams } = require("../../validators/course");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await courseService.list(req.parsed.data));
});

exports.getPopular = asyncHandler(async (req, res) => {
  res.json(await courseService.listPopular(req.parsed.data));
});

exports.getOne = asyncHandler(async (req, res) => {
  const { shortName } = shortNameParams.parse(req.params);
  res.json(await courseService.getByShortName(shortName, req.user));
});

exports.getRelated = asyncHandler(async (req, res) => {
  const { shortName } = shortNameParams.parse(req.params);
  res.json(await courseService.listRelated(shortName));
});
