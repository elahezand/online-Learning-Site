const { Router } = require("express");
const { admin } = require("../guards");
const publicNewsletter = require("../../controllers/public/newsletter.controller");
const adminNewsletter = require("../../controllers/admin/newsletter.controller");

const router = Router();

router.route("/").get(admin, adminNewsletter.getAll).post(publicNewsletter.subscribe);

module.exports = router;
