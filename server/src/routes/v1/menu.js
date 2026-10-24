const { Router } = require("express");
const { admin } = require("../guards");
const publicMenus = require("../../controllers/public/menu.controller");
const adminMenus = require("../../controllers/admin/menu.controller");

const router = Router();

router.route("/").get(publicMenus.getAll).post(admin, adminMenus.create);
router.get("/all", publicMenus.getAllForPanel);
router.get("/topbar", publicMenus.getTopbar);
router.delete("/:id", admin, adminMenus.remove);

module.exports = router;
