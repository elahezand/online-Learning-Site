const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("../../services/public/comment.service");

exports.getTop = asyncHandler(async (req, res) => {
  res.json(await commentService.listTop(req.parsed.data));
});