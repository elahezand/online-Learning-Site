const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/admin/contact.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await contactService.list(req.parsed.data));
});

exports.answer = asyncHandler(async (req, res) => {
  res.json(await contactService.answer(req.parsed.data));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await contactService.remove(req.parsed.data.id));
});
