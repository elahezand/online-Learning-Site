const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const notificationSchema = new Schema(
  {
    msg: requiredString("Message", { maxlength: 300 }),
    admin: ref("User", true),
    see: flag(0),
  },
  { timestamps: true }
);

notificationSchema.index({ admin: 1, see: 1 });

module.exports = model("Notification", notificationSchema);
