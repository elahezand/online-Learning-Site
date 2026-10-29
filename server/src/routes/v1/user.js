const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const { updateProfileSchema, editUserSchema, changeRoleSchema, myCoursesQuery, userListQuery } = require("../../validators/user");
const userAccount = require("../../controllers/user/user.controller");
const courseAccount = require("../../controllers/user/course.controller");
const adminUsers = require("../../controllers/admin/user.controller");

const router = Router();
const byId = validate({ params: idParams("User id") });

router
  .route("/")
  .get(admin, validate({ query: userListQuery }), adminUsers.getAll)
  .put(user, validate({ body: updateProfileSchema }), userAccount.updateProfile);
router.get("/courses", user, validate({ query: myCoursesQuery }), courseAccount.getCourses);
router.put("/role", admin, validate({ body: changeRoleSchema }), adminUsers.changeRole);
router.put("/ban/:id", admin, byId, adminUsers.ban);
router.put("/unban/:id", admin, byId, adminUsers.unban);

router
  .route("/:id")
  .put(admin, validate({ params: idParams("User id"), body: editUserSchema }), adminUsers.edit)
  .delete(admin, byId, adminUsers.remove);

module.exports = router;
