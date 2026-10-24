const { Schema, model } = require("mongoose");
const { requiredString } = require("./fields");

const bannedPhoneSchema = new Schema(
  {
    phone: requiredString("Phone", { unique: true }),
  },
  { timestamps: true }
);

module.exports = model("BanUser", bannedPhoneSchema);
