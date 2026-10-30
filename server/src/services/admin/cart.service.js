const Cart = require("../../models/cart");
const { CART_STATUS } = require("../../models/cart");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { buildCartView } = require("../shared/cart");

const POPULATE = [
  { path: "user", select: "name email phone" },
  { path: "items.course", select: "name shortName price discount cover" },
];

const list = ({ page, limit, status }) =>
  paginate(Cart, {
    filter: status ? { status } : {},
    sort: { updatedAt: -1, _id: -1 },
    page,
    limit,
    populate: POPULATE,
  });

const getOne = async (id) => {
  const cart = await Cart.findById(id).populate(POPULATE);
  if (!cart) throw AppError.notFound("Cart not found");
  return buildCartView(cart, { prune: false });
};

const remove = async (id) => {
  const cart = await Cart.findByIdAndDelete(id).lean();
  if (!cart) throw AppError.notFound("Cart not found");
  return { message: "Cart deleted" };
};

module.exports = { list, getOne, remove };