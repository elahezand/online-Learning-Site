const { Router } = require("express");
const { admin } = require("../guards");
const publicContact = require("../../controllers/public/contact.controller");
const adminContact = require("../../controllers/admin/contact.controller");

const router = Router();

router.route("/").get(admin, adminContact.getAll).post(publicContact.create);
router.post("/answer", admin, adminContact.answer);
router.delete("/:id", admin, adminContact.remove);

module.exports = router;
