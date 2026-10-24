const { Router } = require("express");
const { user, admin } = require("../guards");
const userComments = require("../../controllers/user/comment.controller");
const adminComments = require("../../controllers/admin/comment.controller");

const router = Router();

router.route("/").get(admin, adminComments.getAll).post(user, userComments.create);
router.delete("/:id", admin, adminComments.remove);
router.post("/answer/:id", admin, adminComments.answer);
router.put("/accept/:id", admin, adminComments.accept);
router.put("/reject/:id", admin, adminComments.reject);

module.exports = router;
