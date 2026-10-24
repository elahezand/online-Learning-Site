const asyncHandler = require("../../utils/asyncHandler");
const newsletterService = require("../../services/public/newsletter.service");
const { newsletterSchema } = require("../../validators/newsletter");

exports.subscribe = asyncHandler(async (req, res) => {
  res.status(201).json(await newsletterService.subscribe(newsletterSchema.parse(req.body)));
});
