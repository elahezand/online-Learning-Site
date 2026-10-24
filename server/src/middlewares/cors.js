const env = require("../config/env");

const cors = (req, res, next) => {
  const origin = req.header("Origin");
  const allowAll = env.corsOrigin === "*";
  const allowed = env.corsOrigin.split(",").map((value) => value.trim());

  if (allowAll) res.setHeader("Access-Control-Allow-Origin", "*");
  else if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};

module.exports = cors;
