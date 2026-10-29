const asyncHandler = require("../../utils/asyncHandler");
const notificationService = require("../../services/admin/notification.service");

exports.markSeen = asyncHandler(async (req, res) => {
  res.json(await notificationService.markSeen(req.user, req.parsed.data.id));
});
