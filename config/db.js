import mongoose from "mongoose";

mongoose.set("debug", false);

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("📡 Attempting MongoDB connection...");

    const conn = await mongoose.connect(mongoUri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`✅ Database: ${conn.connection.db.name}`);

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected - will attempt reconnection");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error.message);
    });

    return conn;
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error instanceof Error ? error.message : String(error)
    );
    // Don't exit in dev mode, allow the server to run
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
}
