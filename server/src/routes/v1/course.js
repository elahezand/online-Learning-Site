const { Router } = require("express");
const { user, admin, optionalUser } = require("../guards");
const validate = require("../../middlewares/validate");
const { uploadCover } = require("../../middlewares/upload");
const { idParams } = require("../../validators/common");
const { courseListQuery, popularQuery, registerSchema } = require("../../validators/course");
const publicCourses = require("../../controllers/public/course.controller");
const userCourses = require("../../controllers/user/course.controller");
const adminCourses = require("../../controllers/admin/course.controller");

const router = Router();

router.route("/").get(validate({ query: courseListQuery }), publicCourses.getAll).post(admin, uploadCover, adminCourses.create);
router.get("/popular", validate({ query: popularQuery }), publicCourses.getPopular);
router.get("/options", admin, adminCourses.getOptions);
router.get("/related/:shortName", publicCourses.getRelated);

router.route("/:id").put(admin, uploadCover, adminCourses.update).delete(admin, adminCourses.remove);
router.post("/:id/register", user, validate({ params: idParams("Course id"), body: registerSchema }), userCourses.register);

router.get("/:shortName", optionalUser, publicCourses.getOne);

module.exports = router;