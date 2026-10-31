const { endExpiredCampaign } = require("../services/shared/campaign");

const EVERY_MS = 60 * 1000;

let running = false;

const runOnce = async () => {
  if (running) return;
  running = true;
  try {
    const ended = await endExpiredCampaign();
    if (ended) console.log(`[campaign] ${ended.percent}% campaign ended`);
  } catch (err) {
    console.error(`[campaign] failed: ${err.message}`);
  } finally {
    running = false;
  }
};

const startCampaignJob = () => {
  runOnce();
  setInterval(runOnce, EVERY_MS).unref();
};

module.exports = { startCampaignJob };
