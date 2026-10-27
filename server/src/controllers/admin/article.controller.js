const asyncHandler = require("../../utils/asyncHandler");
const articleService = require("../../services/admin/article.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await articleService.create(req.user, req.parsed.data, 1));
});

exports.saveDraft = asyncHandler(async (req, res) => {
  res.status(201).json(await articleService.create(req.user, req.parsed.data, 0));
});

exports.update = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await articleService.update(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await articleService.remove(req.parsed.data.id));
});