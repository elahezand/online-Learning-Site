const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const NOTIFICATION_TYPES = ["general", "order_status"];

const notificationSchema = new Schema(
  {
    msg: requiredString("Message", { maxlength: 300 }),
    user: ref("User", true),
    type: { type: String, enum: NOTIFICATION_TYPES, default: "general" },
    link: { type: String, default: null },
    see: flag(0),
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, see: 1 });

module.exports = model("Notification", notificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;