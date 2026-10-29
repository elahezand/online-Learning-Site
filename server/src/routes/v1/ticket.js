const { Router } = require("express");
const { user, admin } = require("../guards");
const validate = require("../../middlewares/validate");
const { ticketLimiter } = require("../../middlewares/rateLimit");
const { idParams } = require("../../validators/common");
const {
  createTicketSchema,
  answerTicketSchema,
  ticketMessageSchema,
  myTicketsQuery,
  ticketListQuery,
} = require("../../validators/ticket");
const publicTickets = require("../../controllers/public/ticket.controller");
const userTickets = require("../../controllers/user/ticket.controller");
const adminTickets = require("../../controllers/admin/ticket.controller");

const router = Router();
const byTicketId = idParams("Ticket id");

router
  .route("/")
  .get(admin, validate({ query: ticketListQuery }), adminTickets.getAll)
  .post(user, ticketLimiter, validate({ body: createTicketSchema }), userTickets.create);
router.get("/user", user, validate({ query: myTicketsQuery }), userTickets.getMine);
router.get("/departments", publicTickets.getDepartments);
router.get("/departments-subs/:id", validate({ params: idParams("Department id") }), publicTickets.getDepartmentSubs);
router.post("/answer", admin, validate({ body: answerTicketSchema }), adminTickets.answer);
router.get("/answer/:id", user, validate({ params: byTicketId }), userTickets.getAnswer);
router
  .route("/:id/messages")
  .get(user, validate({ params: byTicketId }), userTickets.getMessages)
  .post(user, ticketLimiter, validate({ params: byTicketId, body: ticketMessageSchema }), userTickets.sendMessage);

module.exports = router;
