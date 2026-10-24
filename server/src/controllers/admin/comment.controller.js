const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("../../services/admin/comment.service");
const { idParams } = require("../../validators/common");
const { answerCommentSchema } = require("../../validators/comment");

const commentId = (req) => idParams("Comment id").parse(req.params).id;

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await commentService.list());
});

exports.accept = asyncHandler(async (req, res) => {
  res.json(await commentService.accept(commentId(req)));
});

exports.reject = asyncHandler(async (req, res) => {
  res.json(await commentService.reject(commentId(req)));
});

exports.answer = asyncHandler(async (req, res) => {
  const id = commentId(req);
  res.json(await commentService.answer(req.user, id, answerCommentSchema.parse(req.body)));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await commentService.remove(commentId(req)));
});
