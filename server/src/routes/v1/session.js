const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { uploadVideo } = require("../../middlewares/upload");
const { idParams } = require("../../validators/common");
const { createSessionSchema, sessionListQuery, sessionParams, videoQuery } = require("../../validators/session");
const adminSessions = require("../../controllers/admin/session.controller");
const userSessions = require("../../controllers/user/session.controller");

const router = Router();

router
  .route("/")
  .get(admin, validate({ query: sessionListQuery }), adminSessions.getAll)
  .post(admin, uploadVideo, validate({ body: createSessionSchema }), adminSessions.create);
router.get("/:id/video", validate({ params: idParams("Session id"), query: videoQuery }), userSessions.streamVideo);
router.get("/:shortName/:sessionID", user, validate({ params: sessionParams }), userSessions.getOne);
router.delete("/:id", admin, validate({ params: idParams("Session id") }), adminSessions.remove);

module.exports = router;