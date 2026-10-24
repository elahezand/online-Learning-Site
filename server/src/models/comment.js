const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const commentSchema = new Schema(
  {
    body: requiredString("Comment text", { maxlength: 2000 }),
    course: ref("Course", true),
    creator: ref("User", true),
    answer: flag(0),
    isAnswer: flag(0),
    score: { type: Number, min: 1, max: 5, default: 5 },
    mainCommendID: ref("Comment"),
  },
  { timestamps: true }
);

commentSchema.index({ course: 1, answer: 1 });

module.exports = model("Comment", commentSchema);
