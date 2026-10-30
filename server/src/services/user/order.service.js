const Cart = require("../../models/cart");
const Order = require("../../models/order");
const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const withTransaction = require("../../utils/transaction");
const { CART_STATUS } = require("../../models/cart");
const { buildCartView } = require("../shared/cart");
const { createPayment, paymentUrlFor } = require("../shared/zarinpal");
const { buildOrderIdSearchExpr, finalizeOrder, revertOrder, reserveCoupon } = require("../shared/order");


const POPULATE = [{ path: "items.course", select: "name shortName cover" }];

const withPaymentUrl = (order) => ({
  order,
  paymentUrl: order.paymentStatus === "pending" && order.payment?.authority ? paymentUrlFor(order.payment.authority) : null,
});

const findExisting = async (userId, idempotencyKey) => {
  if (!idempotencyKey) return null;
  return Order.findOne({ user: userId, idempotencyKey });
};

const loadCartView = async (userId) => {
  const cart = await Cart.findOne({ user: userId, status: CART_STATUS.ACTIVE });
  if (!cart || !cart.items.length) throw AppError.badRequest("Your cart is empty");

  const view = await buildCartView(cart);
  if (view.removedItems.length) {
    throw new AppError(409, "Your cart changed, please check it again", view.removedItems);
  }
  if (!view.items.length) throw AppError.badRequest("Your cart is empty");
  return view;
};

const toOrderItems = (view) =>
  view.items.map((item) => ({
    course: item.course._id,
    price: item.price,
    discount: item.discount,
    finalPrice: item.finalPrice,
    snapshot: { name: item.course.name, shortName: item.course.shortName, cover: item.course.cover },
  }));

const takeFromWallet = async (userId, wanted, session) => {
  if (wanted <= 0) return 0;

  const buyer = await User.findById(userId).select("wallet").session(session);
  const amount = Math.min(buyer?.wallet?.balance || 0, wanted);
  if (amount <= 0) return 0;

  const result = await User.updateOne(
    { _id: userId, "wallet.balance": { $gte: amount } },
    { $inc: { "wallet.balance": -amount } },
    { session }
  );
  if (!result.modifiedCount) throw AppError.conflict("Your wallet balance changed, try again");
  return amount;
};

const paymentMethodFor = (online, walletUsed) => {
  if (online > 0) return "zarinpal";
  return walletUsed > 0 ? "wallet" : "free";
};

const placeOrder = (user, view, { useWallet, idempotencyKey }) =>
  withTransaction(async (session) => {
    const cartUnchanged = await Cart.exists({
      _id: view._id,
      status: CART_STATUS.ACTIVE,
      updatedAt: view.updatedAt,
    }).session(session);
    if (!cartUnchanged) throw AppError.conflict("Your cart changed, please check it again");

    const walletUsed = useWallet ? await takeFromWallet(user._id, view.pricing.total, session) : 0;
    const online = view.pricing.total - walletUsed;

    const [order] = await Order.create(
      [
        {
          user: user._id,
          items: toOrderItems(view),
          coupon: view.coupon
            ? { off: view.coupon._id, code: view.coupon.code, percent: view.coupon.percent, course: view.coupon.course }
            : null,
          pricing: { subtotal: view.pricing.subtotal, discount: view.pricing.discount, walletUsed, total: online },
          paymentMethod: paymentMethodFor(online, walletUsed),
          paymentStatus: "pending",
          status: "created",
          idempotencyKey,
        },
      ],
      { session }
    );

    await reserveCoupon(order, session);

    if (online === 0) {
      order.paymentStatus = "paid";
      order.payment.paidAt = new Date();
      await finalizeOrder(order, session);
    }

    return order;
  });

const failOrder = (orderId) =>
  withTransaction(async (session) => {
    const order = await Order.findById(orderId).session(session);
    if (!order || order.paymentStatus !== "pending") return;

    order.paymentStatus = "failed";
    await revertOrder(order, session);
    await order.save({ session });
  });

const startPayment = async (order, user) => {
  try {
    const { authority } = await createPayment({
      amount: order.pricing.total,
      description: `ACADEMIA order ${order._id}`,
      mobile: user.phone,
      email: user.email,
    });

    order.payment.authority = authority;
    await order.save();
    return paymentUrlFor(authority);
  } catch (err) {
    await failOrder(order._id);
    throw err instanceof AppError ? err : new AppError(502, "Couldn't connect to the payment gateway, try again");
  }
};

const checkout = async (user, { useWallet = false, idempotencyKey = null }) => {
  const existing = await findExisting(user._id, idempotencyKey);
  if (existing) return withPaymentUrl(existing);

  const view = await loadCartView(user._id);

  let order;
  try {
    order = await placeOrder(user, view, { useWallet, idempotencyKey });
  } catch (err) {
    if (err.code !== 11000) throw err;
    const duplicate = await findExisting(user._id, idempotencyKey);
    if (!duplicate) throw err;
    return withPaymentUrl(duplicate);
  }

  if (order.paymentStatus === "paid") return { order, paymentUrl: null };

  const paymentUrl = await startPayment(order, user);
  return { order, paymentUrl };
};

const list = (user, { page, limit, status, q }) => {
  const filter = { user: user._id };
  if (status) filter.status = status;

  const searchExpr = buildOrderIdSearchExpr(q);
  if (searchExpr) filter.$expr = searchExpr;

  return paginate(Order, { filter, sort: { _id: -1 }, page, limit, populate: POPULATE });
};

const getOne = async (user, id) => {
  const order = await Order.findOne({ _id: id, user: user._id }).populate(POPULATE).lean();
  if (!order) throw AppError.notFound("Order not found");
  return order;
};

const cancel = (user, id) =>
  withTransaction(async (session) => {
    const order = await Order.findOne({ _id: id, user: user._id }).session(session);
    if (!order) throw AppError.notFound("Order not found");

    if (order.paymentStatus !== "pending" || order.status !== "created") {
      throw AppError.badRequest("Only an unpaid order can be cancelled — contact support for a refund");
    }

    order.paymentStatus = "failed";
    await revertOrder(order, session);
    await order.save({ session });
    return order;
  });

module.exports = { checkout, list, getOne, cancel };