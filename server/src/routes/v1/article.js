const { Router } = require("express");
const { admin, optionalUser } = require("../guards");
const validate = require("../../middlewares/validate");
const { uploadCover } = require("../../middlewares/upload");
const { idParams } = require("../../validators/common");
const {
  createArticleSchema,
  draftArticleSchema,
  updateArticleSchema,
  articleParams,
  articleListQuery,
} = require("../../validators/article");
const publicArticles = require("../../controllers/public/article.controller");
const adminArticles = require("../../controllers/admin/article.controller");

const router = Router();
const byId = idParams("Article id");

router
  .route("/")
  .get(optionalUser, validate({ query: articleListQuery }), publicArticles.getAll)
  .post(admin, uploadCover, validate({ body: createArticleSchema }), adminArticles.create);
router.post("/draft", admin, uploadCover, validate({ body: draftArticleSchema }), adminArticles.saveDraft);
router.get("/:shortName", optionalUser, validate({ params: articleParams }), publicArticles.getOne);
router
  .route("/:id")
  .put(admin, uploadCover, validate({ params: byId, body: updateArticleSchema }), adminArticles.update)
  .delete(admin, validate({ params: byId }), adminArticles.remove);

module.exports = router;
