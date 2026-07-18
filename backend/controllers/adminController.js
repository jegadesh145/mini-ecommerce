// ============================================
// Admin Controller - Dashboard & Management
// ============================================
import asyncHandler from "express-async-handler";
import { prisma } from "../config/database.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });
  const processingOrders = await prisma.order.count({ where: { status: "processing" } });
  const deliveredOrders = await prisma.order.count({ where: { status: "delivered" } });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      password: false,
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      password: false,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  const { name, email, role } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { name, email, role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      password: false,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  await prisma.user.delete({
    where: { id: parseInt(req.params.id) },
  });

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
    res.status(400).json({
      success: false,
      message: "Invalid status",
    });
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!order) {
    res.status(404).json({
      success: false,
      message: "Order not found",
    });
    return;
  }

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});

export {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  updateOrderStatus,
};
