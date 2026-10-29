const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const env = require("../config/env");
const Session = require("../models/session");
const { UPLOAD_DIR, VIDEO_DIR } = require("../utils/files");

const run = async () => {
  await mongoose.connect(env.mongoUri);
  const sessions = await Session.find({ video: { $ne: null } }).select("video").lean();

  let moved = 0;
  for (const { video } of sessions) {
    const from = path.join(UPLOAD_DIR, path.basename(video));
    const to = path.join(VIDEO_DIR, path.basename(video));
    if (fs.existsSync(from) && !fs.existsSync(to)) {
      await fs.promises.rename(from, to);
      moved += 1;
    }
  }

  console.log(`Moved ${moved} of ${sessions.length} session videos to ${VIDEO_DIR}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
