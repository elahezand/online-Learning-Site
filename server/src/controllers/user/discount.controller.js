const asyncHandler = require("../../utils/asyncHandler");
const discountService = require("../../services/user/discount.service");
const { applyDiscountSchema } = require("../../validators/discount");

exports.apply = asyncHandler(async (req, res) => {
  const input = applyDiscountSchema.parse({ code: req.params.code, course: req.body?.course });
  res.json(await discountService.apply(input));
});
