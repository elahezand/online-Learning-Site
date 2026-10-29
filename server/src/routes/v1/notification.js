const { Router } = require("express");
const { admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { idParams } = require("../../validators/common");
const adminNotifications = require("../../controllers/admin/notification.controller");

const router = Router();

router.put("/see/:id", admin, validate({ params: idParams("Notification id") }), adminNotifications.markSeen);

module.exports = router;
