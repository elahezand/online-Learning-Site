const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { contactListQuery,createContactSchema } = require("../../validators/contact");
const publicContact = require("../../controllers/public/contact.controller");
const adminContact = require("../../controllers/admin/contact.controller");

const router = Router();

router.route("/").get(admin, validate({ query: contactListQuery }), adminContact.getAll).post(validate({ body: createContactSchema }), publicContact.create);

router.post("/answer", admin, adminContact.answer);
router.delete("/:id", admin, adminContact.remove);

module.exports = router;