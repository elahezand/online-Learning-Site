const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const sessionSchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 120 }),
    time: requiredString("Time", { match: [/^\d{1,3}:[0-5]\d$/, "Time must look like 12:30"] }),
    video: { type: String, trim: true },
    free: flag(0),
    course: ref("Course", true),
  },
  { timestamps: true }
);

sessionSchema.index({ course: 1 });

module.exports = model("Session", sessionSchema);
