const Newsletter = require("../../models/newsletter");
const AppError = require("../../utils/AppError");

const subscribe = async ({ email }) => {
  if (await Newsletter.exists({ email })) throw AppError.conflict("This email is already subscribed");
  return Newsletter.create({ email });
};

module.exports = { subscribe };
