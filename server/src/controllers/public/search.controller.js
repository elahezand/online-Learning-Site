const asyncHandler = require("../../utils/asyncHandler");
const searchService = require("../../services/public/search.service");

exports.search = asyncHandler(async (req, res) => {
  res.json(await searchService.search(req.parsed.data.value));
});
