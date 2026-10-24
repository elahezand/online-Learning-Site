const asyncHandler = require("../../utils/asyncHandler");
const ticketService = require("../../services/public/ticket.service");
const { idParams } = require("../../validators/common");

exports.getDepartments = asyncHandler(async (req, res) => {
  res.json(await ticketService.listDepartments());
});

exports.getDepartmentSubs = asyncHandler(async (req, res) => {
  const { id } = idParams("Department id").parse(req.params);
  res.json(await ticketService.listDepartmentSubs(id));
});
