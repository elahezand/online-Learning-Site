const env = require("./config/env");
const { connectDatabase } = require("./config/db");
const app = require("./app");
const { startOrderSweeper } = require("./jobs/order-sweeper.job");
const { startCampaignJob } = require("./jobs/campaign.job");
const start = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
    startOrderSweeper();
    startCampaignJob();
  } catch (error) {
    console.error("Could not start the server:", error);
    process.exit(1);
  }
};

start();