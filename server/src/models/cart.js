const { Schema, model } = require("mongoose");
const { ref } = require("./fields");

const CART_STATUS = Object.freeze({
  ACTIVE: "active",
  ABANDONED: "abandoned",
  CONVERTED: "converted",
});

const cartItemSchema = new Schema(
  {
    course: ref("Course", true),
  },
  { _id: false, timestamps: { createdAt: "addedAt", updatedAt: false } }
);

const cartSchema = new Schema(
  {
    user: ref("User", true),
    items: { type: [cartItemSchema], default: [] },
    coupon: ref("Off"),
    status: {
      type: String,
      enum: Object.values(CART_STATUS),
      default: CART_STATUS.ACTIVE,
    },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { status: CART_STATUS.ACTIVE } }
);
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("Cart", cartSchema);
module.exports.CART_STATUS = CART_STATUS;