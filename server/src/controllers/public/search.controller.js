const asyncHandler = require("../../utils/asyncHandler");
const searchService = require("../../services/public/search.service");
const { searchParams } = require("../../validators/search");

exports.search = asyncHandler(async (req, res) => {
  const { value } = searchParams.parse(req.params);
  res.json(await searchService.search(value));
});
