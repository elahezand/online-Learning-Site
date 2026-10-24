const { Schema, model } = require("mongoose");
const { requiredString } = require("./fields");

const newsletterSchema = new Schema(
  {
    email: requiredString("Email", { unique: true, lowercase: true }),
  },
  { timestamps: true }
);

module.exports = model("NewsLetter", newsletterSchema);
