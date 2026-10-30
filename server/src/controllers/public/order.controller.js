const env = require("../../config/env");
const orderService = require("../../services/public/order.service");

const redirectTo = (res, page, orderId) =>
  res.redirect(`${env.clientUrl}/${page}${orderId ? `?orderId=${orderId}` : ""}`);

exports.verify = async (req, res) => {
  const { Authority: authority, Status: status } = req.query;
  if (!authority) return redirectTo(res, "payment-failed");

  try {
    const result = await orderService.verify({ authority: String(authority), status: String(status) });
    const page = result.paymentStatus === "paid" ? "payment-success" : "payment-failed";
    return redirectTo(res, page, result.orderId);
  } catch (err) {
    console.error(`[payment] verify failed for authority ${authority}: ${err.message}`);
    return redirectTo(res, "payment-failed");
  }
};