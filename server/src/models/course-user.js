const { Schema, model } = require("mongoose");
const { ref } = require("./fields");

const enrollmentSchema = new Schema(
  {
    course: ref("Course", true),
    user: ref("User", true),
    price: { type: Number, required: [true, "Price is required"], min: 0 },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ course: 1 });

module.exports = model("CourseUser", enrollmentSchema);
