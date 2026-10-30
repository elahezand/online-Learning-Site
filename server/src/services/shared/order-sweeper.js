const Order = require("../../models/order");
const withTransaction = require("../../utils/transaction");
const { verifyPayment } = require("./zarinpal");
const { finalizeOrder, revertOrder } = require("./order");

const ABANDON_AFTER_MS = Number(process.env.ORDER_ABANDON_MINUTES || 30) * 60 * 1000;
const BATCH = 100;

const completeHalfFinishedOrders = async () => {
  const orders = await Order.find({ paymentStatus: "paid", finalizedAt: null, status: { $ne: "cancelled" } })
    .select("_id")
    .limit(BATCH)
    .lean();

  let finished = 0;
  for (const { _id } of orders) {
    try {
      const done = await withTransaction(async (session) => {
        const order = await Order.findById(_id).session(session);
        if (!order || order.paymentStatus !== "paid") return false;
        return finalizeOrder(order, session, { autoCompletedAt: new Date() });
      });
      if (done) finished++;
    } catch (err) {
      console.error(`[sweeper] couldn't finish order ${_id}: ${err.message}`);
    }
  }
  return finished;
};

const markPaid = (id, refId) =>
  withTransaction(async (session) => {
    const order = await Order.findById(id).session(session);
    if (!order) return false;
    return markOrderPaid(order, session, refId, { autoCompletedAt: new Date() });
  });
const cancelUnpaid = (id) =>
  withTransaction(async (session) => {
    const order = await Order.findById(id).session(session);
    if (!order || !["pending", "failed"].includes(order.paymentStatus) || order.status === "cancelled") return false;

    order.paymentStatus = "failed";
    await revertOrder(order, session);
    await order.save({ session });
    return true;
  });

const checkGateway = async (order) => {
  if (order.paymentStatus !== "pending" || !order.payment?.authority) return { paid: false };

  const result = await verifyPayment(order.payment.authority, order.pricing.total);
  if (result.unreachable) return { unreachable: true };
  return { paid: result.success === true, refId: result.refId };
};

const resolvePendingPayments = async () => {
  const deadline = new Date(Date.now() - ABANDON_AFTER_MS);
  const orders = await Order.find({
    paymentStatus: { $in: ["pending", "failed"] },
    status: { $nin: ["cancelled", "completed"] },
    createdAt: { $lte: deadline },
  })
    .select("_id paymentStatus payment pricing")
    .limit(BATCH)
    .lean();

  let paid = 0;
  let cancelled = 0;

  for (const order of orders) {
    try {
      const gateway = await checkGateway(order);
      if (gateway.unreachable) continue;

      if (gateway.paid) {
        if (await markPaid(order._id, gateway.refId)) paid++;
      } else if (await cancelUnpaid(order._id)) {
        cancelled++;
      }
    } catch (err) {
      console.error(`[sweeper] couldn't resolve order ${order._id}: ${err.message}`);
    }
  }
  return { paid, cancelled };
};

const runOrderSweeps = async () => {
  const finished = await completeHalfFinishedOrders();
  const payments = await resolvePendingPayments();
  return { finished, ...payments };
};

module.exports = { completeHalfFinishedOrders, resolvePendingPayments, runOrderSweeps };