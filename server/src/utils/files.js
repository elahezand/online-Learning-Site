const fs = require("fs/promises");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "public", "courses", "covers");

const removeUpload = async (fileName) => {
  if (!fileName) return;
  try {
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(fileName)));
  } catch (error) {
    if (error.code !== "ENOENT") console.error(`Could not remove file ${fileName}:`, error.message);
  }
};

module.exports = { UPLOAD_DIR, removeUpload };
