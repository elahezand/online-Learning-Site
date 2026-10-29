const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const sessionService = require("../../services/user/session.service");
const { VIDEO_DIR } = require("../../utils/files");

exports.getOne = asyncHandler(async (req, res) => {
  res.json(await sessionService.getOne(req.user, req.parsed.data));
});

exports.streamVideo = asyncHandler(async (req, res, next) => {
  const fileName = await sessionService.findVideo(req.parsed.data);
  res.set("Cache-Control", "private, no-store");
  res.sendFile(fileName, { root: VIDEO_DIR, dotfiles: "deny" }, (error) => {
    if (error && !res.headersSent) next(error.code === "ENOENT" ? AppError.notFound("Video not found") : error);
  });
});
