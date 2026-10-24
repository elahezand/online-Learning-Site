const Notification = require("../../models/notification");
const AppError = require("../../utils/AppError");

const markSeen = async (admin, id) => {
  const notification = await Notification.findOneAndUpdate({ _id: id, admin: admin._id }, { see: 1 }, { new: true }).lean();
  if (!notification) throw AppError.notFound("Notification not found");
  return notification;
};

module.exports = { markSeen };
