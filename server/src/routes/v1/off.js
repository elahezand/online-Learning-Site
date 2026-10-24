const { Router } = require("express");
const { user, admin } = require("../guards");
const userDiscounts = require("../../controllers/user/discount.controller");
const adminDiscounts = require("../../controllers/admin/discount.controller");

const router = Router();

router.route("/").get(admin, adminDiscounts.getAll).post(admin, adminDiscounts.create);
router.route("/all").post(admin, adminDiscounts.setOnAll).delete(admin, adminDiscounts.removeFromAll);
router.post("/:code", user, userDiscounts.apply);
router.delete("/:id", admin, adminDiscounts.remove);

module.exports = router;
