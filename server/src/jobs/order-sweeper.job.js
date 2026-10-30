const { runOrderSweeps } = require("../services/shared/order-sweeper");

const EVERY_MS = 24 * 60 * 60 * 1000;

let running = false;

const runOnce = async () => {
  if (running) return;
  running = true;
  try {
    const result = await runOrderSweeps();
    console.log("[sweeper] done", result);
  } catch (err) {
    console.error(`[sweeper] failed: ${err.message}`);
  } finally {
    running = false;
  }
};

const startOrderSweeper = () => {
  runOnce();
  setInterval(runOnce, EVERY_MS).unref();
};

module.exports = { startOrderSweeper };