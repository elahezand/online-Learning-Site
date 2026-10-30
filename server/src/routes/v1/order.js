const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const {
  checkoutSchema, myOrdersQuery, orderListQuery, orderParams, orderItemParams, updateOrderSchema, verifyPaymentQuery,
} = require("../../validators/order");
const publicOrders = require("../../controllers/public/order.controller");
const userOrders = require("../../controllers/user/order.controller");
const adminOrders = require("../../controllers/admin/order.controller");

const router = Router();
const byId = validate({ params: orderParams });

router.get("/verify", validate({ query: verifyPaymentQuery }), publicOrders.verify);

router.post("/checkout", user, validate({ body: checkoutSchema }), userOrders.checkout);
router.get("/me", user, validate({ query: myOrdersQuery }), userOrders.getAll);
router.get("/me/:id", user, byId, userOrders.getOne);
router.post("/me/:id/cancel", user, byId, userOrders.cancel);

router.post("/sweeps", admin, adminOrders.runSweeps);
router.get("/", admin, validate({ query: orderListQuery }), adminOrders.getAll);
router
  .route("/:id")
  .get(admin, byId, adminOrders.getOne)
  .patch(admin, validate({ params: orderParams, body: updateOrderSchema }), adminOrders.update);
router.post("/:id/items/:itemId/cancel", admin, validate({ params: orderItemParams }), adminOrders.cancelItem);

module.exports = router;