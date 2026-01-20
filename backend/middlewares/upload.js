const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===============================
   UPLOAD DIRECTORY
=============================== */
const uploadDir = "uploads/payments";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   STORAGE CONFIG
=============================== */
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pay_${Date.now()}${ext}`);
  }
});

/* ===============================
   FILE FILTER
=============================== */
const fileFilter = (_, file, cb) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Unsupported image format"), false);
  }

  cb(null, true);
};

/* ===============================
   MULTER INSTANCE
=============================== */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});

module.exports = upload;
