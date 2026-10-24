const { Router } = require("express");
const { admin } = require("../guards");
const adminNotifications = require("../../controllers/admin/notification.controller");

const router = Router();

router.put("/see/:id", admin, adminNotifications.markSeen);

module.exports = router;
