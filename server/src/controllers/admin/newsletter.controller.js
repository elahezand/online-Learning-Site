const asyncHandler = require("../../utils/asyncHandler");
const newsletterService = require("../../services/admin/newsletter.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await newsletterService.list());
});
