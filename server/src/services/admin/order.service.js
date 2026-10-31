const Order = require("../../models/order");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const withTransaction = require("../../utils/transaction");
const { buildOrderIdSearchExpr, revertOrder, cancelItems, activeItems } = require("../shared/order");
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

const assertCancellable = (order) => {
  if (order.status === "cancelled") throw AppError.badRequest("This order is already cancelled");
  if (order.paymentStatus !== "paid") {
    throw AppError.badRequest("Only a paid order can be cancelled — unpaid orders are closed by Run checks");
  }
};

const cancel = (id) =>
  withTransaction(async (session) => {
    const order = await findOrder(id, session);
    assertCancellable(order);
    await revertOrder(order, session);
    return order;
  });

const cancelItem = async (id, itemId) => {
  const { order, item, refund } = await withTransaction(async (session) => {
    const order = await findOrder(id, session);
    assertCancellable(order);

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

module.exports = { list, getOne, cancel, cancelItem, runSweeps };
