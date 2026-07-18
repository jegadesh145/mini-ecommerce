// ============================================
// Profile Routes
// ============================================
const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  deactivateAccount,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require("../middleware/validationMiddleware");
const upload = require("../utils/upload");

// All profile routes are protected (require authentication)
router.get("/", protect, getProfile);
router.put("/", protect, validateProfileUpdate, updateProfile);
router.put(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);
router.delete("/avatar", protect, removeAvatar);
router.put(
  "/password",
  protect,
  validatePasswordChange,
  changePassword
);
router.delete("/", protect, deactivateAccount);

module.exports = router;