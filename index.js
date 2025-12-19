import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Start server with proper error handling
async function startServer() {
  try {
    console.log("\n🚀 Starting Express server...");
    console.log(`📋 PORT: ${PORT}`);
    console.log(`📋 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
    console.log(`📋 MONGO_URI: ${process.env.MONGO_URI ? "Set" : "NOT SET"}`);

    // Connect to MongoDB
    console.log("\n📡 Connecting to MongoDB...");
    const dbConnection = await connectDB();
    if (dbConnection) {
      console.log("✅ MongoDB connected successfully");
    } else {
      console.warn(
        "⚠️  MongoDB connection failed, but continuing in development mode..."
      );
    }

    // Start Express server on all interfaces
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log("\n" + "=".repeat(60));
      console.log("✅ Server is running on http://localhost:" + PORT);
      console.log("✅ API available at http://localhost:" + PORT + "/api");
      console.log("✅ Health check: http://localhost:" + PORT + "/api/health");
      console.log("=".repeat(60) + "\n");
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();
