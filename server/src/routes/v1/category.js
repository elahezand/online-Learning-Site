const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const { categorySchema } = require("../../validators/category");
const publicCategories = require("../../controllers/public/category.controller");
const adminCategories = require("../../controllers/admin/category.controller");

const router = Router();
const byId = idParams("Category id");

router.route("/").get(publicCategories.getAll).post(admin, validate({ body: categorySchema }), adminCategories.create);
router
  .route("/:id")
  .put(admin, validate({ params: byId, body: categorySchema }), adminCategories.update)
  .delete(admin, validate({ params: byId }), adminCategories.remove);

module.exports = router;
