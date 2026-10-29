const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { contactLimiter } = require("../../middlewares/rateLimit");
const { idParams } = require("../../validators/common");
const { createContactSchema, answerContactSchema, contactListQuery } = require("../../validators/contact");
const publicContact = require("../../controllers/public/contact.controller");
const adminContact = require("../../controllers/admin/contact.controller");

const router = Router();

router
  .route("/")
  .get(admin, validate({ query: contactListQuery }), adminContact.getAll)
  .post(contactLimiter, validate({ body: createContactSchema }), publicContact.create);
router.post("/answer", admin, validate({ body: answerContactSchema }), adminContact.answer);
router.delete("/:id", admin, validate({ params: idParams("Message id") }), adminContact.remove);

module.exports = router;
