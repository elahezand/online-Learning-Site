const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/admin/contact.service");
const { idParams } = require("../../validators/common");
const { answerContactSchema } = require("../../validators/contact");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await contactService.list());
});

exports.answer = asyncHandler(async (req, res) => {
  res.json(await contactService.answer(answerContactSchema.parse(req.body)));
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = idParams("Message id").parse(req.params);
  res.json(await contactService.remove(id));
});
