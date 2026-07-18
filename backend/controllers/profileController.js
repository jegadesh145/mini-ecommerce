// ============================================
// Profile Controller
// ============================================
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { prisma } = require("../config/database");

// ============================================
// Get Profile
// GET /api/profile
// ============================================
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ============================================
// Update Profile (name only)
// PUT /api/profile
// ============================================
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ============================================
// Upload Avatar
// PUT /api/profile/avatar
// ============================================
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get current user to find old avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // Delete old avatar file if exists
    if (currentUser.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", currentUser.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar path
    const avatarPath = `/uploads/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarPath },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
    });
  }
};

// ============================================
// Remove Avatar
// DELETE /api/profile/avatar
// ============================================
const removeAvatar = async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (currentUser.avatar) {
      const avatarPath = path.join(__dirname, "..", currentUser.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Avatar removed successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Remove Avatar Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove avatar",
    });
  }
};

// ============================================
// Change Password
// PUT /api/profile/password
// ============================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ============================================
// Deactivate Account
// DELETE /api/profile
// ============================================
const deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to deactivate account",
      });
    }

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Deactivate account
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isActive: false },
    });

    // Delete all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  deactivateAccount,
};