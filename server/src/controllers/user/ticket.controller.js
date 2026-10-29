const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/user/ticket.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await ticketService.create(req.user, req.parsed.data));
});

exports.getMine = asyncHandler(async (req, res) => {
  res.json(await ticketService.listMine(req.user, req.parsed.data));
});

exports.getAnswer = asyncHandler(async (req, res) => {
  res.json(await ticketService.getAnswer(req.user, req.parsed.data.id));
});

exports.getMessages = asyncHandler(async (req, res) => {
  res.json(await ticketService.getThread(req.user, req.parsed.data.id));
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { id, ...input } = req.parsed.data;
  res.status(201).json(await ticketService.sendMessage(req.user, id, input));
});
