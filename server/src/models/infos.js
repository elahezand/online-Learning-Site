const { Schema, model } = require("mongoose");
const { requiredString } = require("./fields");

const siteInfoSchema = new Schema(
  {
    phone: requiredString("Phone"),
    email: requiredString("Email", { lowercase: true }),
    logo: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = model("Info", siteInfoSchema);
