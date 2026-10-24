const { Schema, model } = require("mongoose");
const { ref, requiredString } = require("./fields");

const discountCodeSchema = new Schema(
  {
    code: requiredString("Code", { maxlength: 30 }),
    percent: { type: Number, required: [true, "Percent is required"], min: 0, max: 100 },
    course: ref("Course", true),
    max: { type: Number, required: [true, "Usage limit is required"], min: 1 },
    uses: { type: Number, default: 0, min: 0 },
    creator: ref("User", true),
  },
  { timestamps: true }
);

discountCodeSchema.index({ code: 1, course: 1 }, { unique: true });

module.exports = model("Off", discountCodeSchema);
