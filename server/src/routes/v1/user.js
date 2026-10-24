const { Router } = require("express");
const { user, admin } = require("../guards");
const userAccount = require("../../controllers/user/user.controller");
const adminUsers = require("../../controllers/admin/user.controller");

const router = Router();

router.route("/").get(admin, adminUsers.getAll).put(user, userAccount.updateProfile);
router.get("/courses", user, userAccount.getCourses);
router.put("/role", admin, adminUsers.changeRole);
router.put("/ban/:id", admin, adminUsers.ban);
router.route("/:id").put(admin, adminUsers.edit).delete(admin, adminUsers.remove);

module.exports = router;
