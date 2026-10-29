const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/public/contact.service");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await contactService.create(req.parsed.data));
});