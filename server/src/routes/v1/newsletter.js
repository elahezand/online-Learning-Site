const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { newsletterLimiter } = require("../../middlewares/rateLimit");
const { newsletterSchema } = require("../../validators/newsletter");
const publicNewsletter = require("../../controllers/public/newsletter.controller");
const adminNewsletter = require("../../controllers/admin/newsletter.controller");

const router = Router();

router.route("/").get(admin, adminNewsletter.getAll).post(newsletterLimiter, validate({ body: newsletterSchema }), publicNewsletter.subscribe);

module.exports = router;
