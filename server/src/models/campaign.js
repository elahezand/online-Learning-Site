const { Schema, model } = require("mongoose");
const { ref } = require("./fields");

const CAMPAIGN_STATUS = ["active", "ended"];

const previousDiscountSchema = new Schema(
  {
    course: ref("Course", true),
    discount: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const campaignSchema = new Schema(
  {
    percent: { type: Number, required: [true, "Percent is required"], min: 1, max: 100 },
    endsAt: { type: Date, required: [true, "End date is required"] },
    status: { type: String, enum: CAMPAIGN_STATUS, default: "active" },
    previous: { type: [previousDiscountSchema], default: [] },
    endedAt: { type: Date, default: null },
    creator: ref("User"),
  },
  { timestamps: true, versionKey: false }
);

campaignSchema.index({ status: 1 }, { unique: true, partialFilterExpression: { status: "active" } });
campaignSchema.index({ status: 1, endsAt: 1 });

module.exports = model("Campaign", campaignSchema);
module.exports.CAMPAIGN_STATUS = CAMPAIGN_STATUS;
