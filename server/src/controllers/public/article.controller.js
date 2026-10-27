const asyncHandler = require("../../utils/asyncHandler");
const articleService = require("../../services/public/article.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await articleService.list(req.parsed.data, req.user));
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await articleService.getByShortName(req.parsed.data.shortName, req.user));
});
