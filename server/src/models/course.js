const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const COURSE_STATUSES = ["start", "presell"];

const courseSchema = new Schema(
  {
    name: requiredString("Name", { maxlength: 120 }),
    description: requiredString("Description"),
    cover: { type: String, trim: true },
    support: { type: String, trim: true, default: "" },
    shortName: requiredString("Short name", { unique: true, lowercase: true }),
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price can't be negative"] },
    isComplete: flag(0),
    status: { type: String, enum: COURSE_STATUSES, default: "start" },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    categoryID: ref("Category", true),
    creator: ref("User"),
  },
  { timestamps: true }
);

courseSchema.index({ categoryID: 1 });

courseSchema.virtual("sessions", { ref: "Session", localField: "_id", foreignField: "course" });
courseSchema.virtual("comments", { ref: "Comment", localField: "_id", foreignField: "course" });

module.exports = model("Course", courseSchema);
module.exports.COURSE_STATUSES = COURSE_STATUSES;
