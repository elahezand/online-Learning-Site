const { Router } = require("express");
const { admin } = require("../guards");
const publicCategories = require("../../controllers/public/category.controller");
const adminCategories = require("../../controllers/admin/category.controller");

const router = Router();

router.route("/").get(publicCategories.getAll).post(admin, adminCategories.create);
router.route("/:id").put(admin, adminCategories.update).delete(admin, adminCategories.remove);

module.exports = router;
