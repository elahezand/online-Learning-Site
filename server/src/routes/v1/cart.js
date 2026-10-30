const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const { addCartItemSchema, cartCourseParams, applyCouponSchema, cartListQuery } = require("../../validators/cart");
const userCarts = require("../../controllers/user/cart.controller");
const adminCarts = require("../../controllers/admin/cart.controller");

const router = Router();
const byId = validate({ params: idParams("Cart id") });

router.get("/me", user, userCarts.getMine);
router.post("/me/items", user, validate({ body: addCartItemSchema }), userCarts.addItem);
router.delete("/me/items/:courseId", user, validate({ params: cartCourseParams }), userCarts.removeItem);
router
  .route("/me/coupon")
  .post(user, validate({ body: applyCouponSchema }), userCarts.applyCoupon)
  .delete(user, userCarts.removeCoupon);

router.get("/", admin, validate({ query: cartListQuery }), adminCarts.getAll);
router.route("/:id").get(admin, byId, adminCarts.getOne).delete(admin, byId, adminCarts.remove);

module.exports = router;