const { Router } = require("express");
const { user } = require("../guards");
const publicAuth = require("../../controllers/public/auth.controller");
const userAuth = require("../../controllers/user/auth.controller");

const router = Router();

router.post("/register", publicAuth.register);
router.post("/login", publicAuth.login);
router.get("/me", user, userAuth.getMe);

module.exports = router;
