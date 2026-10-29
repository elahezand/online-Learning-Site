const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { myCoursesQuery } = require("../../validators/user");
const courseAccount = require("../../controllers/user/course.controller");

const userAccount = require("../../controllers/user/user.controller");
const adminUsers = require("../../controllers/admin/user.controller");

const router = Router();

router.route("/").get(admin, adminUsers.getAll).put(user, userAccount.updateProfile);
router.put("/role", admin, adminUsers.changeRole);
router.put("/ban/:id", admin, adminUsers.ban);
router.route("/:id").put(admin, adminUsers.edit).delete(admin, adminUsers.remove);
router.get("/courses", user, validate({ query: myCoursesQuery }), courseAccount.getCourses);

module.exports = router;
