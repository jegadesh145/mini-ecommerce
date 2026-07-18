// ============================================
// Admin Routes
// ============================================
import express from "express";
import {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminMiddleware);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users CRUD
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Orders management
router.get("/orders", getOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;