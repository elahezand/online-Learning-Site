const { Router } = require("express");
const { user } = require("../guards");
const userOrders = require("../../controllers/user/order.controller");

const router = Router();

router.get("/", user, userOrders.getAll);
router.get("/:id", user, userOrders.getOne);

module.exports = router;
