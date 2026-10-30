const CourseUser = require("../../models/course-user");

const COURSE_FIELDS = "name shortName cover price discount";

const POPULATE = [
    { path: "items.course", select: COURSE_FIELDS },
    { path: "coupon", select: "code percent course uses max" },
];

const priceAfter = (price, percent = 0) => Math.round((price * (100 - percent)) / 100);

const getCouponProblem = (coupon, courseIds) => {
    if (!coupon) return "This code is not valid";
    if (!courseIds.map(String).includes(String(coupon.course))) return "This code doesn't apply to the courses in your cart";
    if (coupon.uses >= coupon.max) return "This code has reached its usage limit";
    return null;
};

const pruneCart = async (cart) => {
    const removedItems = [];
    const courseIds = cart.items.filter((item) => item.course).map((item) => item.course._id);
    const enrolled = new Set(
        (await CourseUser.find({ user: cart.user, course: { $in: courseIds } }).distinct("course")).map(String)
    );

    const items = cart.items.filter((item) => {
        if (!item.course) {
            removedItems.push({ reason: "A course in your cart is no longer available" });
            return false;
        }
        if (enrolled.has(String(item.course._id))) {
            removedItems.push({ reason: `You are already enrolled in ${item.course.name}`, courseId: String(item.course._id) });
            return false;
        }
        return true;
    });

    const keptIds = items.map((item) => item.course._id);
    const coupon = cart.coupon && !getCouponProblem(cart.coupon, keptIds) ? cart.coupon : null;
    if (cart.coupon && !coupon) removedItems.push({ reason: `The code ${cart.coupon.code} no longer applies to your cart` });

    return { items, coupon, removedItems };
};

const toItemView = (course, coupon) => {
    const afterDiscount = priceAfter(course.price, course.discount);
    const couponPercent = coupon && String(coupon.course) === String(course._id) ? coupon.percent : 0;
    return {
        course: { _id: course._id, name: course.name, shortName: course.shortName, cover: course.cover },
        price: course.price,
        discount: course.discount ?? 0,
        finalPrice: priceAfter(afterDiscount, couponPercent),
    };
};

const buildCartView = async (cart) => {
    await cart.populate(POPULATE);
    const { items, coupon, removedItems } = await pruneCart(cart);

    if (removedItems.length) {
        cart.items = items.map((item) => ({ course: item.course._id, addedAt: item.addedAt }));
        cart.coupon = coupon?._id ?? null;
        await cart.save();
    }

    const views = items.map((item) => toItemView(item.course, coupon));
    const subtotal = views.reduce((sum, item) => sum + item.price, 0);
    const total = views.reduce((sum, item) => sum + item.finalPrice, 0);

    return {
        _id: cart._id,
        user: cart.user,
        items: views,
        coupon: coupon ? { _id: coupon._id, code: coupon.code, percent: coupon.percent, course: coupon.course } : null,
        removedItems,
        pricing: { subtotal, discount: subtotal - total, total },
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
};

module.exports = { POPULATE, priceAfter, getCouponProblem, buildCartView };