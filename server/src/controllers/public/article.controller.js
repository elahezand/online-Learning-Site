const asyncHandler = require("../../utils/asyncHandler");
const articleService = require("../../services/public/article.service");
const { articleParams } = require("../../validators/article");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await articleService.list());
});

exports.getOne = asyncHandler(async (req, res) => {
  const { shortName } = articleParams.parse(req.params);
  res.json(await articleService.getByShortName(shortName));
});
