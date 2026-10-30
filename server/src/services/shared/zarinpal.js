const env = require("../../config/env");
const AppError = require("../../utils/AppError");

const HOST = env.zarinpal.sandbox ? "https://sandbox.zarinpal.com" : "https://payment.zarinpal.com";
const CURRENCY = "IRT";
const TIMEOUT_MS = 10000;

const post = async (path, body) => {
  const response = await fetch(`${HOST}/pg/v4/payment/${path}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ merchant_id: env.zarinpal.merchantId, ...body }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (response.status >= 500) throw new Error(`Gateway answered ${response.status}`);
  return response.json();
};

const paymentUrlFor = (authority) => `${HOST}/pg/StartPay/${authority}`;

const createPayment = async ({ amount, description, mobile, email }) => {
  let result;
  try {
    result = await post("request", {
      amount,
      currency: CURRENCY,
      description,
      callback_url: env.zarinpal.callbackUrl,
      metadata: { mobile, email },
    });
  } catch {
    throw new AppError(502, "Couldn't connect to the payment gateway, try again");
  }

  if (result?.data?.code !== 100 || !result.data.authority) {
    throw new AppError(502, "The payment gateway didn't accept this payment");
  }
  return { authority: result.data.authority };
};

const verifyPayment = async (authority, amount) => {
  let result;
  try {
    result = await post("verify", { authority, amount, currency: CURRENCY });
  } catch {
    return { unreachable: true };
  }

  const code = result?.data?.code;
  if (code === 100 || code === 101) return { success: true, refId: String(result.data.ref_id) };
  return { success: false };
};

module.exports = { createPayment, verifyPayment, paymentUrlFor };