const asyncHandler = require("../../utils/asyncHandler");
const newsletterService = require("../../services/public/newsletter.service");

exports.subscribe = asyncHandler(async (req, res) => {
  res.status(201).json(await newsletterService.subscribe(req.parsed.data));
});
