// ============================================
// Database Seed Script
// Run: npx prisma db seed
// ============================================
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life. Features deep bass, comfortable ear cushions, and built-in microphone.",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.5,
    stock: 50,
  },
  {
    name: "Classic Leather Watch",
    description: "Elegant analog watch with genuine leather strap, mineral glass crystal, and water-resistant design. Perfect for any occasion.",
    price: 149.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.3,
    stock: 30,
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable organic cotton t-shirt. Available in multiple colors. Ethically sourced and environmentally friendly.",
    price: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    rating: 4.0,
    stock: 100,
  },
  {
    name: "Smart Fitness Tracker",
    description: "Track your health with heart rate monitoring, step counting, sleep analysis, and smartphone notifications. Water-resistant to 50m.",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
    rating: 4.2,
    stock: 75,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-wall vacuum insulated bottle. Keeps drinks cold 24h or hot 12h. BPA-free, leak-proof, and eco-friendly.",
    price: 34.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    rating: 4.7,
    stock: 200,
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.",
    price: 129.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating: 4.4,
    stock: 45,
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with all Qi-enabled devices. Slim design with LED indicator and foreign object detection.",
    price: 19.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    rating: 4.1,
    stock: 150,
  },
  {
    name: "Leather Backpack",
    description: "Handcrafted genuine leather backpack with padded laptop compartment, multiple pockets, and adjustable straps.",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating: 4.6,
    stock: 25,
  },
  {
    name: "Scented Candle Set",
    description: "Set of 3 hand-poured soy wax candles. Natural essential oils, cotton wicks, and reusable glass jars. Burn time 40h each.",
    price: 29.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400",
    rating: 4.8,
    stock: 80,
  },
  {
    name: "Sunglasses Aviator",
    description: "Classic aviator sunglasses with UV400 protection, lightweight metal frame, and polarized lenses. Unisex design.",
    price: 44.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    rating: 4.0,
    stock: 60,
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material, includes carrying strap. Perfect for home workouts.",
    price: 39.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    rating: 4.5,
    stock: 90,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches. Aluminum frame, programmable keys, and detachable USB-C cable.",
    price: 109.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    rating: 4.3,
    stock: 40,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@minishop.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@minishop.com",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create test user
  const userPassword = await bcrypt.hash("Test@1234", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@test.com",
      password: userPassword,
      role: "user",
    },
  });
  console.log(`✅ Test user created: ${testUser.email}`);

  // Seed products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name }, // This won't match, so it creates
      update: {},
      create: product,
    });
  }
  console.log(`✅ ${products.length} products seeded`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });