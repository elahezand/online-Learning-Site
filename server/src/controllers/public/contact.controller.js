const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/public/contact.service");
const { createContactSchema } = require("../../validators/contact");

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await contactService.create(createContactSchema.parse(req.body)));
});
