const CourseUser = require("../../models/course-user");
const Cart = require("../../models/cart");
const Off = require("../../models/off");
const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const { escapeRegex } = require("../../utils/text");
const { CART_STATUS } = require("../../models/cart");

const buildOrderIdSearchExpr = (q) => {
  if (!q || !String(q).trim()) return null;
  return {
    $regexMatch: {
      input: { $toString: "$_id" },
      regex: escapeRegex(String(q).trim()),
      options: "i",
    },
  };
};

const activeItems = (order) => (order.items || []).filter((item) => !item.cancelledAt);

const sameId = (a, b) => String(a?._id ?? a) === String(b?._id ?? b);

const addToWallet = (userId, amount, session) =>
  User.updateOne({ _id: userId }, { $inc: { "wallet.balance": amount } }, { session });

const reserveCoupon = async (order, session) => {
  if (!order.coupon?.off || order.couponCounted) return;

  const result = await Off.updateOne(
    { _id: order.coupon.off, $expr: { $lt: ["$uses", "$max"] } },
    { $inc: { uses: 1 } },
    { session }
  );
  if (!result.modifiedCount) throw AppError.conflict("This code can't be used anymore");

  order.couponCounted = true;
  await order.save({ session });
};

const countCoupon = async (order, session) => {
  if (!order.coupon?.off || order.couponCounted) return;
  await Off.updateOne({ _id: order.coupon.off }, { $inc: { uses: 1 } }, { session });
  order.couponCounted = true;
};

const giveBackCoupon = async (order, session) => {
  if (!order.coupon?.off || !order.couponCounted) return;
  await Off.updateOne({ _id: order.coupon.off, uses: { $gt: 0 } }, { $inc: { uses: -1 } }, { session });
  order.couponCounted = false;
};

const giveBackWallet = async (order, session) => {
  const amount = order.pricing.walletUsed || 0;
  if (!amount || order.walletRefunded) return 0;

  await addToWallet(order.user, amount, session);
  order.walletRefunded = true;
  return amount;
};

const enroll = (order, session) => {
  const items = activeItems(order);
  if (!items.length) return null;

  return CourseUser.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { user: order.user, course: item.course },
        update: { $setOnInsert: { price: item.finalPrice } },
        upsert: true,
      },
    })),
    { session }
  );
};

const finalizeOrder = async (order, session, extra = {}) => {
  if (order.finalizedAt) return false;

  await enroll(order, session);
  await countCoupon(order, session);
  await Cart.updateOne(
    { user: order.user, status: CART_STATUS.ACTIVE },
    { $set: { status: CART_STATUS.CONVERTED } },
    { session }
  );

  if (order.status === "created") order.status = "processing";
  order.finalizedAt = new Date();
  Object.assign(order, extra);

  await order.save({ session });
  return true;
};

const releaseWallet = async (order, session) => {
  const amount = await giveBackWallet(order, session);
  if (amount) await order.save({ session });
  return amount;
};

const refundShare = (order, items, isLast) => {
  if (order.paymentStatus !== "paid") return 0;

  const paid = order.pricing.total + (order.pricing.walletUsed || 0);
  if (paid <= 0) return 0;
  if (isLast) return Math.max(0, paid - (order.refundAmount || 0));

  const all = order.items.reduce((sum, item) => sum + item.finalPrice, 0);
  const part = items.reduce((sum, item) => sum + item.finalPrice, 0);
  return all > 0 ? Math.round((paid * part) / all) : 0;
};

const cancelItems = async (order, items, reason, session) => {
  const open = items.filter((item) => !item.cancelledAt);
  if (!open.length) return 0;

  const now = new Date();
  for (const item of open) {
    item.cancelledAt = now;
    item.cancelReason = reason;
  }

  const isLast = activeItems(order).length === 0;
  const refund = refundShare(order, open, isLast);

  await CourseUser.deleteMany(
    { user: order.user, course: { $in: open.map((item) => item.course) } },
    { session }
  );

  if (refund > 0) {
    await addToWallet(order.user, refund, session);
    order.refundAmount = (order.refundAmount || 0) + refund;
    order.refundedAt = now;
  }

  const couponCourseCancelled = open.some((item) => sameId(item.course, order.coupon?.course));
  if (isLast || couponCourseCancelled) await giveBackCoupon(order, session);

  if (isLast) {
    order.status = "cancelled";
    order.revertedAt = now;
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
      order.walletRefunded = true;
    } else {
      await giveBackWallet(order, session);
    }
  }

  await order.save({ session });
  return refund;
};

const revertOrder = async (order, session) => {
  if (order.revertedAt) return 0;
  return cancelItems(order, activeItems(order), "order cancelled", session);
};

const markOrderPaid = async (order, session, refId = null, extra = {}) => {
  if (order.paymentStatus !== "pending") return false;

  order.paymentStatus = "paid";
  order.payment.refId = refId ?? order.payment.refId;
  order.payment.paidAt = order.payment.paidAt || new Date();
  await finalizeOrder(order, session, extra);
  return true;
};

module.exports = {
  buildOrderIdSearchExpr,
  activeItems,
  reserveCoupon,
  finalizeOrder,
  releaseWallet,
  cancelItems,
  revertOrder,
  markOrderPaid
};