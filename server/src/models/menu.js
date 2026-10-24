const { Schema, model } = require("mongoose");
const { ref, requiredString } = require("./fields");

const menuSchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 60 }),
    href: requiredString("Link"),
    parent: ref("Menu"),
  },
  { timestamps: true }
);

module.exports = model("Menu", menuSchema);
