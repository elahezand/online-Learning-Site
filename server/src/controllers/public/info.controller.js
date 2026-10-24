const asyncHandler = require("../../utils/asyncHandler");
const infoService = require("../../services/public/info.service");

exports.getIndex = asyncHandler(async (req, res) => {
  res.json(await infoService.getIndex());
});
