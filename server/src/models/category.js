const { Schema, model } = require("mongoose");
const { requiredString } = require("./fields");

const categorySchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 60 }),
    name: requiredString("Name", { unique: true, lowercase: true, maxlength: 60 }),
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
