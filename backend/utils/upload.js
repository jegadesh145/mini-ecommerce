// ============================================
// Multer File Upload Configuration
// ============================================
const multer = require("multer");
const path = require("path");

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."),
      false
    );
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = upload;