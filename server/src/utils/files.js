const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const UPLOAD_DIR = path.join(ROOT, "public", "courses", "covers");
const VIDEO_DIR = path.join(ROOT, "storage", "videos");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const removeFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") console.error(`Could not remove file ${filePath}:`, error.message);
  }
};

const removeUpload = (fileName) => (fileName ? removeFile(path.join(UPLOAD_DIR, path.basename(fileName))) : undefined);

const removeVideo = (fileName) => (fileName ? removeFile(path.join(VIDEO_DIR, path.basename(fileName))) : undefined);

module.exports = { UPLOAD_DIR, VIDEO_DIR, removeFile, removeUpload, removeVideo };
