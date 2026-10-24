const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/admin/ticket.service");
const { answerTicketSchema } = require("../../validators/ticket");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await ticketService.list());
});

exports.answer = asyncHandler(async (req, res) => {
  res.json(await ticketService.answer(req.user, answerTicketSchema.parse(req.body)));
});
