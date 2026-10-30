const Cart = require("../../models/cart");
const { CART_STATUS } = require("../../models/cart");
const Course = require("../../models/course");
const CourseUser = require("../../models/course-user");
const Off = require("../../models/off");
const AppError = require("../../utils/AppError");
const { priceAfter, buildCartView } = require("../shared/cart");

const ACTIVE = { status: CART_STATUS.ACTIVE };

const getOrCreateActiveCart = async (userId) => {
  try {
    return await Cart.findOneAndUpdate(
      { user: userId, ...ACTIVE },
      { $setOnInsert: { user: userId, items: [], ...ACTIVE } },
      { new: true, upsert: true }
    );
  } catch (error) {
    if (error?.code === 11000) return Cart.findOne({ user: userId, ...ACTIVE });
    throw error;
  }
};

const getMine = async (user) => buildCartView(await getOrCreateActiveCart(user._id));

const addItem = async (user, { courseId }) => {
  const course = await Course.findById(courseId).select("price discount").lean();
  if (!course) throw AppError.notFound("Course not found");
  
  if (priceAfter(course.price, course.discount) === 0) {
    throw AppError.badRequest("This course is free, enroll from its page");
  }
  if (await CourseUser.exists({ user: user._id, course: courseId })) {
    throw AppError.conflict("You are already enrolled in this course");
  }

  const cart = await getOrCreateActiveCart(user._id);
  
  const updated = await Cart.findOneAndUpdate(
    { _id: cart._id, "items.course": { $ne: courseId } },
    { $push: { items: { course: courseId } } },
    { new: true }
  );
  if (!updated) throw AppError.conflict("This course is already in your cart");
  return buildCartView(updated);
};

const removeItem = async (user, { courseId }) => {
  const cart = await Cart.findOneAndUpdate(
    { user: user._id, ...ACTIVE, "items.course": courseId },
    { $pull: { items: { course: courseId } } },
    { new: true }
  );
  if (!cart) throw AppError.notFound("This course is not in your cart");
  return buildCartView(cart);
};

const applyCoupon = async (user, { code }) => {
  const cart = await getOrCreateActiveCart(user._id);
  const courseIds = cart.items.map((item) => item.course);
  if (!courseIds.length) throw AppError.badRequest("Add a course to your cart first");

  const coupon = await Off.findOne({ code, course: { $in: courseIds } }).lean();
  if (!coupon) {
    if (await Off.exists({ code })) throw AppError.badRequest("This code doesn't apply to the courses in your cart");
    throw AppError.notFound("This code is not valid");
  }
  if (coupon.uses >= coupon.max) throw AppError.badRequest("This code has reached its usage limit");

  cart.coupon = coupon._id;
  await cart.save();
  return buildCartView(cart);
};

const removeCoupon = async (user) => {
  const cart = await getOrCreateActiveCart(user._id);
  cart.coupon = null;
  await cart.save();
  return buildCartView(cart);
};

module.exports = { getOrCreateActiveCart, getMine, addItem, removeItem, applyCoupon, removeCoupon };