const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("../../services/user/comment.service");
const { createCommentSchema } = require("../../validators/comment");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await commentService.create(req.user, createCommentSchema.parse(req.body)));
});
