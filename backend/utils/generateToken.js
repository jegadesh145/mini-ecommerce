// ============================================
// JWT Token Generation Utility
// ============================================
const jwt = require("jsonwebtoken");

/**
 * Generate JWT Access Token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Generate JWT Refresh Token
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - Refresh token
 * @returns {object|null} Decoded payload or null
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};