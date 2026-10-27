const { Router } = require("express");
const { user } = require("../guards");
const validate = require("../../middlewares/validate");
const { loginLimiter, registerLimiter, refreshLimiter } = require("../../middlewares/rateLimit");
const { registerSchema, loginSchema, refreshSchema } = require("../../validators/auth");
const publicAuth = require("../../controllers/public/auth.controller");
const userAuth = require("../../controllers/user/auth.controller");

const router = Router();

router.post("/register", registerLimiter, validate({ body: registerSchema }), publicAuth.register);
router.post("/login", loginLimiter, validate({ body: loginSchema }), publicAuth.login);
router.post("/refresh", refreshLimiter, validate({ body: refreshSchema }), publicAuth.refresh);
router.post("/logout", validate({ body: refreshSchema }), publicAuth.logout);
router.get("/me", user, userAuth.getMe);

module.exports = router;
