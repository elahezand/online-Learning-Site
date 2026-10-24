const asyncHandler = require("../../utils/asyncHandler");
const articleService = require("../../services/admin/article.service");
const { idParams } = require("../../validators/common");
const { createArticleSchema, draftArticleSchema, updateArticleSchema } = require("../../validators/article");

const articleId = (req) => idParams("Article id").parse(req.params).id;

exports.create = asyncHandler(async (req, res) => {
  const input = createArticleSchema.parse({ ...req.body, cover: req.file });
  res.status(201).json(await articleService.create(req.user, input, 1));
});

exports.saveDraft = asyncHandler(async (req, res) => {
  const input = draftArticleSchema.parse({ ...req.body, cover: req.file });
  res.status(201).json(await articleService.create(req.user, input, 0));
});

exports.update = asyncHandler(async (req, res) => {
  const id = articleId(req);
  const input = updateArticleSchema.parse({ ...req.body, cover: req.file });
  res.json(await articleService.update(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await articleService.remove(articleId(req)));
});
