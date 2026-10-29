const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const env = require("../config/env");
const Session = require("../models/session");
const { VIDEO_DIR } = require("../utils/files");

const run = async () => {
  const sample = process.argv[2];
  if (!sample || !fs.existsSync(sample)) {
    throw new Error("Give the path of a sample mp4, e.g. npm run seed:videos -- C:\\videos\\sample.mp4");
  }

  await mongoose.connect(env.mongoUri);
  const sessions = await Session.find({ video: { $ne: null } }).select("video").lean();

  let created = 0;
  for (const { video } of sessions) {
    const target = path.join(VIDEO_DIR, path.basename(video));
    if (!fs.existsSync(target)) {
      await fs.promises.copyFile(sample, target);
      created += 1;
    }
  }

  console.log(`Copied the sample video for ${created} of ${sessions.length} sessions`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});