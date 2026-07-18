// ============================================
// Authentication Routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/refresh", refresh);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;