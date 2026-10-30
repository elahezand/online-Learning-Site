const Notification = require("../models/notification");

const notifyUser = (userId, msg, { type = "general", link = null } = {}) =>
  Notification.create({ user: userId, msg, type, link });

module.exports = notifyUser;