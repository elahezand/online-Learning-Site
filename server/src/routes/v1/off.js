const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams, paginationQuery } = require("../../validators/common");
const { createDiscountSchema, siteWideDiscountSchema } = require("../../validators/discount");
const adminDiscounts = require("../../controllers/admin/discount.controller");

const router = Router();

router
    .route("/")
    .get(admin, validate({ query: paginationQuery }), adminDiscounts.getAll)
    .post(admin, validate({ body: createDiscountSchema }), adminDiscounts.create);
router
    .route("/all")
    .post(admin, validate({ body: siteWideDiscountSchema }), adminDiscounts.setOnAll)
    .delete(admin, adminDiscounts.removeFromAll);
router.delete("/:id", admin, validate({ params: idParams("Discount id") }), adminDiscounts.remove);

module.exports = router;