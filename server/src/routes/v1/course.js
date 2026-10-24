const { Router } = require("express");
const { user, admin, optionalUser } = require("../guards");
const { uploadCover, uploadVideo } = require("../../middlewares/upload");
const publicCourses = require("../../controllers/public/course.controller");
const userCourses = require("../../controllers/user/course.controller");
const adminCourses = require("../../controllers/admin/course.controller");

const router = Router();

router.route("/").get(publicCourses.getAll).post(admin, uploadCover, adminCourses.create);
router.get("/presell", publicCourses.getPresell);
router.get("/popular", publicCourses.getPopular);
router.get("/category/:categoryName", publicCourses.getByCategory);
router.get("/related/:shortName", publicCourses.getRelated);

router.get("/sessions", admin, adminCourses.getSessions);
router.delete("/sessions/:id", admin, adminCourses.removeSession);

router.route("/:id").put(admin, uploadCover, adminCourses.update).delete(admin, adminCourses.remove);
router.post("/:id/sessions", admin, uploadVideo, adminCourses.createSession);
router.post("/:id/register", user, userCourses.register);

router.get("/:shortName/:sessionID", user, userCourses.getSession);
router.get("/:shortName", optionalUser, publicCourses.getOne);

module.exports = router;
