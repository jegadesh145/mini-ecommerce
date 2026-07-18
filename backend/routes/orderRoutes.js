// ============================================
// Order Routes
// ============================================
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protected routes (user)
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);

// Admin routes
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;