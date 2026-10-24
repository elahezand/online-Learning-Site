const { Schema, model } = require("mongoose");
const { flag, requiredString } = require("./fields");

const contactSchema = new Schema(
  {
    name: requiredString("Name", { maxlength: 80 }),
    email: requiredString("Email", { lowercase: true }),
    phone: requiredString("Phone"),
    body: requiredString("Message", { maxlength: 2000 }),
    answer: flag(0),
  },
  { timestamps: true }
);

module.exports = model("Contact", contactSchema);
