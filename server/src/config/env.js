const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongoUri: required("MONGO_URI"),
  accessTokenSecret: required("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: required("REFRESH_TOKEN_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  zarinpal: {
    merchantId: process.env.ZARINPAL_MERCHANT_ID || "",
    sandbox: process.env.ZARINPAL_SANDBOX !== "false",
    callbackUrl: process.env.ZARINPAL_CALLBACK_URL || "http://localhost:4000/v1/orders/verify",
  },
  mail: {
    service: process.env.MAIL_SERVICE || "gmail",
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    fromName: process.env.MAIL_FROM_NAME || "ACADEMIA",
  },
};

env.isProduction = env.nodeEnv === "production";

module.exports = env;