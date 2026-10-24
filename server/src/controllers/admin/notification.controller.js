const asyncHandler = require("../../utils/asyncHandler");
const notificationService = require("../../services/admin/notification.service");
const { idParams } = require("../../validators/common");

exports.markSeen = asyncHandler(async (req, res) => {
  const { id } = idParams("Notification id").parse(req.params);
  res.json(await notificationService.markSeen(req.user, id));
});
