const { Schema, model } = require("mongoose");
const { ref } = require("./fields");

const PAYMENT_METHODS = ["zarinpal", "wallet", "free"];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"];
const ORDER_STATUS = ["created", "processing", "completed", "cancelled"];

const orderItemSchema = new Schema(
  {
    course: ref("Course", true),
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, required: true, min: 0 },
    snapshot: {
      name: { type: String, required: true },
      shortName: { type: String, default: null },
      cover: { type: String, default: null },
    },
    cancelledAt: { type: Date, default: null },
    cancelReason: { type: String, default: null },
  }
);

const orderCouponSchema = new Schema(
  {
    off: ref("Off", true),
    code: { type: String, trim: true },
    percent: { type: Number, min: 0, max: 100 },
    course: ref("Course"),
  },
  { _id: false }
);

const pricingSchema = new Schema(
  {
    subtotal: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    walletUsed: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: ref("User", true),
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "An order needs at least one course"],
    },
    coupon: { type: orderCouponSchema, default: null },
    pricing: { type: pricingSchema, required: true },
    status: { type: String, enum: ORDER_STATUS, default: "created" },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "pending" },
    payment: {
      authority: { type: String, default: null },
      refId: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },
    couponCounted: { type: Boolean, default: false },
    walletRefunded: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date, default: null },
    revertedAt: { type: Date, default: null },
    idempotencyKey: { type: String, default: null },
    finalizedAt: { type: Date, default: null },
    autoCompletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index(
  { user: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
);
orderSchema.index({ "payment.authority": 1 });
orderSchema.index({ paymentStatus: 1, createdAt: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = model("Order", orderSchema);
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
module.exports.PAYMENT_STATUS = PAYMENT_STATUS;
module.exports.ORDER_STATUS = ORDER_STATUS;