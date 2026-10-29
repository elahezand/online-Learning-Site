const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/public/ticket.service");

exports.getDepartments = asyncHandler(async (req, res) => {
  res.json(await ticketService.listDepartments());
});

exports.getDepartmentSubs = asyncHandler(async (req, res) => {
  res.json(await ticketService.listDepartmentSubs(req.parsed.data.id));
});
