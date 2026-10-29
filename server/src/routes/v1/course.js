const { Router } = require("express");
const { user, admin, optionalUser } = require("../guards");
const validate = require("../../middlewares/validate");
const { uploadCover } = require("../../middlewares/upload");
const { idParams } = require("../../validators/common");
const { courseListQuery, popularQuery, shortNameParams, createCourseSchema, updateCourseSchema } = require("../../validators/course");
const publicCourses = require("../../controllers/public/course.controller");
const userCourses = require("../../controllers/user/course.controller");
const adminCourses = require("../../controllers/admin/course.controller");

const router = Router();
const byId = idParams("Course id");
const byShortName = validate({ params: shortNameParams });

router
  .route("/")
  .get(validate({ query: courseListQuery }), publicCourses.getAll)
  .post(admin, uploadCover, validate({ body: createCourseSchema }), adminCourses.create);
router.get("/popular", validate({ query: popularQuery }), publicCourses.getPopular);
router.get("/options", admin, adminCourses.getOptions);
router.get("/related/:shortName", byShortName, publicCourses.getRelated);

router
  .route("/:id")
  .put(admin, uploadCover, validate({ params: byId, body: updateCourseSchema }), adminCourses.update)
  .delete(admin, validate({ params: byId }), adminCourses.remove);
router.post("/:id/register", user, validate({ params: byId }), userCourses.register);

router.get("/:shortName", optionalUser, byShortName, publicCourses.getOne);

module.exports = router;
