const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const { createMenuSchema } = require("../../validators/menu");
const publicMenus = require("../../controllers/public/menu.controller");
const adminMenus = require("../../controllers/admin/menu.controller");

const router = Router();

router.route("/").get(publicMenus.getAll).post(admin, validate({ body: createMenuSchema }), adminMenus.create);
router.get("/all", publicMenus.getAllForPanel);
router.get("/topbar", publicMenus.getTopbar);
router.delete("/:id", admin, validate({ params: idParams("Menu id") }), adminMenus.remove);

module.exports = router;