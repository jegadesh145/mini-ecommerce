// ============================================
// Mini E-Commerce Backend Server
// ============================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/database.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// Security headers
app.use(helmet());

// CORS - allow frontend to access API
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies
  })
);

// Parse JSON request body
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// ============================================
// Routes
// ============================================

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mini E-Commerce API is running 🚀",
    version: "1.0.0",
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini Ecommerce API Running",
  });
});

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// API routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ============================================
// Start Server
// ============================================
const DEFAULT_PORT = process.env.PORT || 5000;

const startServer = async (port = DEFAULT_PORT) => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    const server = app.listen(port, () => {
      console.log("\n===================================");
      console.log("🚀 Secure Authentication API Started");
      console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 Port        : ${port}`);
      console.log("===================================\n");
    });

    // Handle port already in use error - try next port
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`\n⚠️  Port ${port} is already in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("\n❌ Server error:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("\n❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
