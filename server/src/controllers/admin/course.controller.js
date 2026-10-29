const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/admin/course.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await courseService.create(req.user, req.parsed.data));
});

exports.update = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await courseService.update(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await courseService.remove(req.parsed.data.id));
});

exports.getOptions = asyncHandler(async (req, res) => {
  res.json(await courseService.listOptions());
});
