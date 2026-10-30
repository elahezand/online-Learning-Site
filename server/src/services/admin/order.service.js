const Order = require("../../models/order");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const withTransaction = require("../../utils/transaction");
const { buildOrderIdSearchExpr, revertOrder, releaseWallet, cancelItems, activeItems } = require("../shared/order");
const { runOrderSweeps } = require("../shared/order-sweeper");
const notifyUser = require("../../utils/notify");

const POPULATE = [
  { path: "user", select: "name username phone" },
  { path: "items.course", select: "name shortName cover" },
];

const shortId = (order) => String(order._id).slice(-6).toUpperCase();

const findOrder = async (id, session) => {
  const order = await Order.findById(id).session(session);
  if (!order) throw AppError.notFound("Order not found");
  return order;
};

const buildFilter = ({ status, paymentStatus, user, q }) => {
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (user) filter.user = user;

  const searchExpr = buildOrderIdSearchExpr(q);
  if (searchExpr) filter.$expr = searchExpr;

  return filter;
};

const list = ({ page, limit, ...query }) =>
  paginate(Order, {
    filter: buildFilter(query),
    sort: { _id: -1 },
    page,
    limit,
    populate: POPULATE,
  });

const getOne = async (id) => {
  const order = await Order.findById(id).populate(POPULATE).lean();
  if (!order) throw AppError.notFound("Order not found");
  return order;
};

const assertAdminOrderChange = (order, data) => {
  if (data.status && data.status !== order.status) {
    if (data.status !== "cancelled" || ["completed", "cancelled"].includes(order.status)) {
      throw AppError.badRequest(`An order can't go from "${order.status}" to "${data.status}"`);
    }
  }

  if (data.paymentStatus && data.paymentStatus !== order.paymentStatus) {
    const canFail = data.paymentStatus === "failed" && order.paymentStatus === "pending";
    if (!canFail) {
      throw AppError.badRequest(`Payment status can't go from "${order.paymentStatus}" to "${data.paymentStatus}"`);
    }
  }
};

const update = (id, data) =>
  withTransaction(async (session) => {
    const order = await findOrder(id, session);
    assertAdminOrderChange(order, data);

    const wasStatus = order.status;
    const wasPayment = order.paymentStatus;

    if (data.paymentStatus) order.paymentStatus = data.paymentStatus;
    if (wasPayment === "pending" && order.paymentStatus === "failed") await releaseWallet(order, session);

    if (wasStatus !== "cancelled" && data.status === "cancelled") await revertOrder(order, session);

    await order.save({ session });
    return order;
  });

const cancelItem = async (id, itemId) => {
  const { order, item, refund } = await withTransaction(async (session) => {
    const order = await findOrder(id, session);

    const item = activeItems(order).find((entry) => String(entry._id) === String(itemId));
    if (!item) throw AppError.notFound("Course not found in this order or already cancelled");

    const refund = await cancelItems(order, [item], "cancelled by admin", session);
    return { order, item, refund };
  });

  await notifyUser(
    order.user,
    `"${item.snapshot.name}" in your order #${shortId(order)} was cancelled` + (refund > 0 ? ` and ${refund} was refunded to your wallet.` : "."),
    { type: "order_status", link: `/my-account/orders/${order._id}` }
  );

  return order;
};

const runSweeps = () => runOrderSweeps();

module.exports = { list, getOne, update, cancelItem, runSweeps };