// ============================================
// Database Configuration
// ============================================
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Test database connection
 * Logs success or failure to console
 */
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };