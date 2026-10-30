const Order = require("../../models/order");
const AppError = require("../../utils/AppError");
const withTransaction = require("../../utils/transaction");
const { verifyPayment } = require("../shared/zarinpal");
const { finalizeOrder, markOrderPaid, revertOrder } = require("../shared/order");

const inTransaction = (orderId, change) =>
  withTransaction(async (session) => {
    const order = await Order.findById(orderId).session(session);
    await change(order, session);
    return order;
  });

const finishPaid = (orderId) => inTransaction(orderId, (order, session) => finalizeOrder(order, session));

const confirm = (orderId, refId) => inTransaction(orderId, (order, session) => markOrderPaid(order, session, refId));

const fail = (orderId) =>
  inTransaction(orderId, async (order, session) => {
    if (order.paymentStatus !== "pending") return;
    order.paymentStatus = "failed";
    await revertOrder(order, session);
    await order.save({ session });
  });

const toResult = (order) => ({
  orderId: order._id,
  status: order.status,
  paymentStatus: order.paymentStatus,
  refId: order.payment?.refId ?? null,
});

const resolve = async (authority, status) => {
  const order = await Order.findOne({ "payment.authority": authority }).lean();
  if (!order) throw AppError.notFound("Order not found");

  if (order.paymentStatus === "paid") return order.finalizedAt ? order : finishPaid(order._id);
  if (order.paymentStatus !== "pending") return order;
  if (status === "NOK") return fail(order._id);

  const result = await verifyPayment(authority, order.pricing.total);
  if (result.unreachable) return order;
  if (!result.success) return fail(order._id);

  return confirm(order._id, result.refId);
};

const verify = async ({ authority, status }) => toResult(await resolve(authority, status));

module.exports = { verify };