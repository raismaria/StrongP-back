// backend/seed.js - Seed the database with sample products and categories
import mongoose from "mongoose";
import "dotenv/config";
import Product from "./models/products.js";
import Category from "./models/category.js";
import { connectDB } from "./config/db.js";

// First, define categories
const categoryList = [
  "Automatic submersible pump",
  "DC dot booster pump",
  "Centrifugal pumps",
  "Inverter automatic pump",
  "Self-priming",
  "Multi-usage",
  "Peripheral",
  "Solar pump",
  "Submersible sewage pump",
  "Swimming pool",
];

// Then create products with category references (will be populated after categories are created)
const createSampleProducts = (categoryIds) => [
  // Automatic submersible pump: POMP model 1
  {
    name: "Pump Model 1 - Automatic Submersible Pro",
    description:
      "Professional automatic submersible pump with intelligent control. Ideal for wells, boreholes, and underground water sources.",
    price: 399.99,
    category: categoryIds["Automatic submersible pump"],
    images: ["/Images/pump1.jpg"],
    stock: 12,
    status: "active",
  },

  // DC dot booster pump: POMP model 2
  {
    name: "Pump Model 2 - DC Booster Elite",
    description:
      "Advanced DC booster pump with variable voltage control. Perfect for low-pressure applications and pressure boosting.",
    price: 279.99,
    category: categoryIds["DC dot booster pump"],
    images: ["/Images/pump2.jpg"],
    stock: 18,
    status: "active",
  },

  // Centrifugal pumps: POMP model 3
  {
    name: "Pump Model 3 - Centrifugal Pro",
    description:
      "High-efficiency centrifugal pump for demanding flow requirements. Superior head and flow characteristics.",
    price: 379.99,
    category: categoryIds["Centrifugal pumps"],
    images: ["/Images/pump3.jpg"],
    stock: 11,
    status: "active",
  },

  // Inverter automatic pump: POMP model 4
  {
    name: "Pump Model 4 - Inverter Automatic Master",
    description:
      "Smart inverter-controlled pump with frequency modulation. Energy-efficient operation with automatic pressure regulation.",
    price: 459.99,
    category: categoryIds["Inverter automatic pump"],
    images: ["/Images/pump4.jpg"],
    stock: 8,
    status: "active",
  },

  // Self-priming: POMP model 5
  {
    name: "Pump Model 5 - Self-priming Elite",
    description:
      "Professional self-priming pump with rapid priming capability. Handles various fluid types efficiently.",
    price: 329.99,
    category: categoryIds["Self-priming"],
    images: ["/Images/pump5.jpg"],
    stock: 14,
    status: "active",
  },

  // Self-priming: POMP model 6
  {
    name: "Pump Model 6 - Self-priming Standard",
    description:
      "Reliable self-priming pump for general industrial use. Proven performance in diverse applications.",
    price: 299.99,
    category: categoryIds["Self-priming"],
    images: ["/Images/pump6.jpg"],
    stock: 16,
    status: "active",
  },

  // Multi-usage: POMP model 7
  {
    name: "Pump Model 7 - Multi-usage Pro",
    description:
      "Versatile multi-purpose pump suitable for various applications. Excellent adaptability and performance.",
    price: 319.99,
    category: categoryIds["Multi-usage"],
    images: ["/Images/pump7.jpg"],
    stock: 17,
    status: "active",
  },

  // Peripheral: POMP model 8
  {
    name: "Pump Model 8 - Peripheral Basic",
    description:
      "Entry-level peripheral pump with solid performance. Ideal for basic water transfer and circulation needs.",
    price: 199.99,
    category: categoryIds["Peripheral"],
    images: ["/Images/pump8.jpg"],
    stock: 20,
    status: "active",
  },

  // Peripheral: POMP model 9
  {
    name: "Pump Model 9 - Peripheral Standard",
    description:
      "Reliable peripheral pump for standard applications. Perfect balance of performance and cost-effectiveness.",
    price: 229.99,
    category: categoryIds["Peripheral"],
    images: ["/Images/pump9.jpg"],
    stock: 18,
    status: "active",
  },

  // Peripheral: POMP model 10
  {
    name: "Pump Model 10 - Peripheral Pro",
    description:
      "High-performance peripheral pump for general applications. Reliable and efficient with excellent pressure ratings.",
    price: 249.99,
    category: categoryIds["Peripheral"],
    images: ["/Images/pump10.jpg"],
    stock: 15,
    status: "active",
  },

  // Peripheral: POMP model 11
  {
    name: "Pump Model 11 - Peripheral Elite",
    description:
      "Professional-grade peripheral pump for demanding tasks. Advanced engineering ensures maximum durability and performance.",
    price: 299.99,
    category: categoryIds["Peripheral"],
    images: ["/Images/pump11.jpg"],
    stock: 12,
    status: "active",
  },

  // Self-priming: POMP model 12
  {
    name: "Pump Model 12 - Self-priming Pro",
    description:
      "Advanced self-priming pump with automatic air expulsion. No need for manual priming in most applications.",
    price: 349.99,
    category: categoryIds["Self-priming"],
    images: ["/Images/pump12.jpg"],
    stock: 10,
    status: "active",
  },

  // Self-priming: POMP model 13
  {
    name: "Pump Model 13 - Self-priming Basic",
    description:
      "Cost-effective self-priming pump with straightforward operation. Ideal for starting installations.",
    price: 269.99,
    category: categoryIds["Self-priming"],
    images: ["/Images/pump13.jpg"],
    stock: 19,
    status: "active",
  },

  // Solar pump: POMP model 14
  {
    name: "Pump Model 14 - Solar Powered",
    description:
      "Eco-friendly solar-powered pump with battery backup. Perfect for remote locations and sustainable applications.",
    price: 539.99,
    category: categoryIds["Solar pump"],
    images: ["/Images/pump14.jpg"],
    stock: 6,
    status: "active",
  },

  // Submersible sewage pump: POMP model 15
  {
    name: "Pump Model 15 - Submersible Sewage Master",
    description:
      "Heavy-duty submersible sewage pump designed for waste water and slurry handling. Durable and reliable.",
    price: 429.99,
    category: categoryIds["Submersible sewage pump"],
    images: ["/Images/pump15.jpg"],
    stock: 7,
    status: "active",
  },

  // Centrifugal pumps: POMP model 16
  {
    name: "Pump Model 16 - Centrifugal Master",
    description:
      "Premium centrifugal pump with superior performance. Industrial-grade reliability for heavy-duty applications.",
    price: 399.99,
    category: categoryIds["Centrifugal pumps"],
    images: ["/Images/pump16.jpg"],
    stock: 9,
    status: "active",
  },

  // Swimming pool: POMP model 17
  {
    name: "Pump Model 17 - Pool Circulation Master",
    description:
      "Specialized pool circulation pump with variable speed control. Maintains optimal water clarity and temperature.",
    price: 449.99,
    category: categoryIds["Swimming pool"],
    images: ["/Images/pump17.jpg"],
    stock: 13,
    status: "active",
  },

  // Multi-usage: POMP model 18
  {
    name: "Pump Model 18 - Multi-usage Deluxe",
    description:
      "Premium multi-purpose pump with advanced features. Suitable for industrial and residential applications.",
    price: 389.99,
    category: categoryIds["Multi-usage"],
    images: ["/Images/pump18.jpg"],
    stock: 10,
    status: "active",
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing products and categories");

    // Create categories
    const createdCategories = await Category.insertMany(
      categoryList.map((name) => ({ name }))
    );
    console.log(`✅ Seeded ${createdCategories.length} categories`);

    // Create a map of category names to IDs
    const categoryIds = {};
    createdCategories.forEach((cat) => {
      categoryIds[cat.name] = cat._id;
    });

    // Create products with category references
    const sampleProducts = createSampleProducts(categoryIds);

    // Insert with validation disabled to avoid schema conflicts
    const insertedProducts = await Product.collection.insertMany(
      sampleProducts
    );
    console.log(
      `✅ Seeded ${insertedProducts.insertedIds.length} products successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
