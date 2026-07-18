// ============================================
// Order Controller
// ============================================
const { prisma } = require("../config/database");

// ============================================
// Create Order (from cart)
// POST /api/orders
// ============================================
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone } = req.body;

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate total and validate stock
    let total = 0;
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
      total += item.product.price * item.quantity;
    }

    // Create order with items
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total: parseFloat(total.toFixed(2)),
          status: "pending",
          shippingAddress: shippingAddress || "",
          phone: phone || "",
        },
      });

      // Create order items and update stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Decrease stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: item.product.stock - item.quantity },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id },
      });

      return newOrder;
    });

    // Fetch the complete order with items
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: fullOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// ============================================
// Get User Orders
// GET /api/orders
// ============================================
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
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
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ============================================
// Get Single Order
// GET /api/orders/:id
// ============================================
const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// ============================================
// Get All Orders (Admin)
// GET /api/orders/admin
// ============================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    res.status(200).json({
      success: true,
      data: {
        orders,
        stats: {
          totalOrders: orders.length,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ============================================
// Update Order Status (Admin)
// PUT /api/orders/:id/status
// ============================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, price: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
};