// ============================================
// Authentication Middleware
// ============================================
const { verifyAccessToken } = require("../utils/generateToken");
const { prisma } = require("../config/database");

/**
 * Protect routes - verify JWT access token
 * Extracts token from Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid or expired token",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - User not found",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

/**
 * Authorize by role
 * @param {...string} roles - Allowed roles (e.g., "admin", "user")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role "${req.user.role}" is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };