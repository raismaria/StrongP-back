import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Start server with MongoDB connection
async function start() {
  try {
    console.log("🚀 Starting server...");
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

start();
