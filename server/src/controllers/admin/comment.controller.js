const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("../../services/admin/comment.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await commentService.list(req.parsed.data));
});

exports.accept = asyncHandler(async (req, res) => {
  res.json(await commentService.accept(req.parsed.data.id));
});

exports.reject = asyncHandler(async (req, res) => {
  res.json(await commentService.reject(req.parsed.data.id));
});

exports.answer = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.json(await commentService.answer(req.user, id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await commentService.remove(req.parsed.data.id));
});