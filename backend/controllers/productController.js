// ============================================
// Product Controller
// ============================================
const { prisma } = require("../config/database");

// ============================================
// Get All Products (with filters, search, pagination)
// GET /api/products?page=1&limit=10&category=electronics&search=phone&sortBy=price&sortOrder=asc
// ============================================
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      minRating,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    // Get distinct categories for filter
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: pageNum * limitNum < total,
          hasPrevPage: pageNum > 1,
        },
        categories: categories.map((c) => c.category),
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ============================================
// Get Single Product
// GET /api/products/:id
// ============================================
const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ============================================
// Create Product (Admin only)
// POST /api/products
// ============================================
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, rating, stock } =
      req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || null,
        rating: rating ? parseFloat(rating) : 0,
        stock: stock ? parseInt(stock) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// ============================================
// Update Product (Admin only)
// PUT /api/products/:id
// ============================================
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, rating, stock } =
      req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(rating && { rating: parseFloat(rating) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ============================================
// Delete Product (Admin only)
// DELETE /api/products/:id
// ============================================
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};