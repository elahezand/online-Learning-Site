const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/user/ticket.service");
const { idParams } = require("../../validators/common");
const { createTicketSchema, ticketMessageSchema } = require("../../validators/ticket");

const ticketId = (req) => idParams("Ticket id").parse(req.params).id;

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await ticketService.create(req.user, createTicketSchema.parse(req.body)));
});

exports.getMine = asyncHandler(async (req, res) => {
  res.json(await ticketService.listMine(req.user));
});

exports.getAnswer = asyncHandler(async (req, res) => {
  res.json(await ticketService.getAnswer(req.user, ticketId(req)));
});

exports.getMessages = asyncHandler(async (req, res) => {
  res.json(await ticketService.getThread(req.user, ticketId(req)));
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const id = ticketId(req);
  res.status(201).json(await ticketService.sendMessage(req.user, id, ticketMessageSchema.parse(req.body)));
});
