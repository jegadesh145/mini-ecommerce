const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const products = [
  { name: "Wireless Bluetooth Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life.", price: 79.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", rating: 4.5, stock: 50 },
  { name: "Classic Leather Watch", description: "Elegant analog watch with genuine leather strap.", price: 149.99, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", rating: 4.3, stock: 30 },
  { name: "Organic Cotton T-Shirt", description: "Soft breathable organic cotton t-shirt.", price: 24.99, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", rating: 4.0, stock: 100 },
  { name: "Smart Fitness Tracker", description: "Track your health with heart rate monitoring.", price: 59.99, category: "Electronics", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400", rating: 4.2, stock: 75 },
  { name: "Stainless Steel Water Bottle", description: "Double-wall vacuum insulated bottle.", price: 34.99, category: "Home", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", rating: 4.7, stock: 200 },
  { name: "Running Shoes Pro", description: "Lightweight performance running shoes.", price: 129.99, category: "Clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", rating: 4.4, stock: 45 },
  { name: "Wireless Charging Pad", description: "Fast wireless charger for all Qi devices.", price: 19.99, category: "Electronics", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", rating: 4.1, stock: 150 },
  { name: "Leather Backpack", description: "Handcrafted genuine leather backpack.", price: 89.99, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", rating: 4.6, stock: 25 },
  { name: "Scented Candle Set", description: "Set of 3 hand-poured soy wax candles.", price: 29.99, category: "Home", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400", rating: 4.8, stock: 80 },
  { name: "Sunglasses Aviator", description: "Classic aviator sunglasses with UV400 protection.", price: 44.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", rating: 4.0, stock: 60 },
  { name: "Yoga Mat Premium", description: "Extra thick 6mm yoga mat with non-slip surface.", price: 39.99, category: "Sports", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", rating: 4.5, stock: 90 },
  { name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard with Cherry MX switches.", price: 109.99, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", rating: 4.3, stock: 40 },
];

async function main() {
  const count = await prisma.product.count();
  console.log(`Products in DB: ${count}`);

  if (count > 0) {
    console.log("Products already exist, skipping seed.");
    await prisma.$disconnect();
    return;
  }

  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@minishop.com" },
    update: {},
    create: { name: "Admin", email: "admin@minishop.com", password: adminHash, role: "admin" },
  });
  console.log("Admin created");

  const userHash = await bcrypt.hash("Test@1234", 12);
  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: { name: "Test User", email: "user@test.com", password: userHash },
  });
  console.log("Test user created");

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`${products.length} products seeded`);

  await prisma.$disconnect();
  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});