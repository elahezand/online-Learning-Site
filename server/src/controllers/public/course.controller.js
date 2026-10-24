const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/public/course.service");
const { shortNameParams, categoryParams } = require("../../validators/course");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await courseService.list());
});

exports.getPresell = asyncHandler(async (req, res) => {
  res.json(await courseService.listPresell());
});

exports.getPopular = asyncHandler(async (req, res) => {
  res.json(await courseService.listPopular());
});

exports.getByCategory = asyncHandler(async (req, res) => {
  const { categoryName } = categoryParams.parse(req.params);
  res.json(await courseService.listByCategory(categoryName));
});

exports.getOne = asyncHandler(async (req, res) => {
  const { shortName } = shortNameParams.parse(req.params);
  res.json(await courseService.getByShortName(shortName, req.user));
});

exports.getRelated = asyncHandler(async (req, res) => {
  const { shortName } = shortNameParams.parse(req.params);
  res.json(await courseService.listRelated(shortName));
});
