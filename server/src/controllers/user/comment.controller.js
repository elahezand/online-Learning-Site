const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("../../services/user/comment.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await commentService.create(req.user, req.parsed.data));
});
