const { Router } = require("express");
const { admin } = require("../guards");
const publicInfo = require("../../controllers/public/info.controller");
const adminInfo = require("../../controllers/admin/info.controller");

const router = Router();

router.get("/index", publicInfo.getIndex);
router.get("/p-admin", admin, adminInfo.getDashboard);

module.exports = router;
