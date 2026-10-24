const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const AppError = require("../utils/AppError");
const { UPLOAD_DIR } = require("../utils/files");

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/mpeg"];
const MB = 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`);
  },
});

const uploader = ({ field, types, maxMB, label }) =>
  multer({
    storage,
    limits: { fileSize: maxMB * MB, files: 1 },
    fileFilter: (req, file, cb) => {
      if (types.includes(file.mimetype)) return cb(null, true);
      cb(AppError.badRequest(`${label} must be one of: ${types.join(", ")}`));
    },
  }).single(field);

const uploadCover = uploader({ field: "cover", types: IMAGE_TYPES, maxMB: 10, label: "Cover image" });
const uploadVideo = uploader({ field: "video", types: VIDEO_TYPES, maxMB: 500, label: "Video" });

module.exports = { uploadCover, uploadVideo, IMAGE_TYPES, VIDEO_TYPES };
