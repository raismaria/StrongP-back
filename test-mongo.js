import "dotenv/config";
import mongoose from "mongoose";

console.log("🔍 Testing MongoDB connection...");
console.log("📍 URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Not found");

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connection SUCCESSFUL!");
    console.log("📊 Connection status:", mongoose.connection.readyState);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection FAILED!");
    console.error("Error:", error.message);
    process.exit(1);
  });

// Timeout after 15 seconds
setTimeout(() => {
  console.error("⏱️ Connection timeout (15 seconds)");
  process.exit(1);
}, 15000);
