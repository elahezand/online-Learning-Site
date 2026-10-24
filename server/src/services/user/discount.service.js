const Off = require("../../models/off");
const AppError = require("../../utils/AppError");

const apply = async ({ code, course }) => {
  const discount = await Off.findOneAndUpdate(
    { code, course, $expr: { $lt: ["$uses", "$max"] } },
    { $inc: { uses: 1 } },
    { new: true }
  ).lean();
  if (discount) return discount;

  const exists = await Off.exists({ code, course });
  if (exists) throw AppError.conflict("This code has reached its usage limit");
  throw AppError.notFound("This code is not valid");
};

module.exports = { apply };
