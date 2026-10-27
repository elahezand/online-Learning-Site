const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const { createCommentSchema, answerCommentSchema, commentListQuery } = require("../../validators/comment");
const userComments = require("../../controllers/user/comment.controller");
const adminComments = require("../../controllers/admin/comment.controller");

const router = Router();
const byId = validate({ params: idParams("Comment id") });

router.route("/")
  .get(admin, validate({ query: commentListQuery }), adminComments.getAll)
  .post(user, validate({ body: createCommentSchema }), userComments.create);
router.delete("/:id", admin, byId, adminComments.remove);
router.post("/answer/:id", admin, byId, validate({ body: answerCommentSchema }), adminComments.answer);
router.put("/accept/:id", admin, byId, adminComments.accept);
router.put("/reject/:id", admin, byId, adminComments.reject);

module.exports = router;