const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const articleSchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 160 }),
    description: requiredString("Description", { maxlength: 500 }),
    body: { type: String, required: [true, "Content is required"] },
    cover: { type: String, trim: true },
    shortName: requiredString("Short name", { unique: true, lowercase: true }),
    categoryID: ref("Category", true),
    creator: ref("User"),
    publish: flag(1),
  },
  { timestamps: true }
);

module.exports = model("Article", articleSchema);
