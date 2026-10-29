const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/admin/ticket.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await ticketService.list(req.parsed.data));
});

exports.answer = asyncHandler(async (req, res) => {
  res.json(await ticketService.answer(req.user, req.parsed.data));
});