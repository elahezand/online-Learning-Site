const { Router } = require("express");
const { admin } = require("../guards");
const { uploadCover } = require("../../middlewares/upload");
const publicArticles = require("../../controllers/public/article.controller");
const adminArticles = require("../../controllers/admin/article.controller");

const router = Router();

router.route("/").get(publicArticles.getAll).post(admin, uploadCover, adminArticles.create);
router.post("/draft", admin, uploadCover, adminArticles.saveDraft);
router.get("/:shortName", publicArticles.getOne);
router.route("/:id").put(admin, uploadCover, adminArticles.update).delete(admin, adminArticles.remove);

module.exports = router;
