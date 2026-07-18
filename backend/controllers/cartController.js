// ============================================
// Cart Controller
// ============================================
const { prisma } = require("../config/database");

// ============================================
// Get Cart
// GET /api/cart
// ============================================
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ============================================
// Add to Cart
// POST /api/cart
// ============================================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more items than available in stock",
        });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: {
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

// ============================================
// Update Cart Item Quantity
// PUT /api/cart/:id
// ============================================
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;

    // Check if item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: quantity <= 0 ? "Item removed from cart" : "Cart updated",
      data: {
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// ============================================
// Remove from Cart
// DELETE /api/cart/:id
// ============================================
const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: {
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

// ============================================
// Clear Cart
// DELETE /api/cart
// ============================================
const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: {
        items: [],
        total: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};