const { Router } = require("express");
const { user, admin } = require("../guards");
const publicTickets = require("../../controllers/public/ticket.controller");
const userTickets = require("../../controllers/user/ticket.controller");
const adminTickets = require("../../controllers/admin/ticket.controller");

const router = Router();

router.route("/").get(admin, adminTickets.getAll).post(user, userTickets.create);
router.get("/user", user, userTickets.getMine);
router.get("/departments", publicTickets.getDepartments);
router.get("/departments-subs/:id", publicTickets.getDepartmentSubs);
router.post("/answer", admin, adminTickets.answer);
router.get("/answer/:id", user, userTickets.getAnswer);
router.route("/:id/messages").get(user, userTickets.getMessages).post(user, userTickets.sendMessage);

module.exports = router;
