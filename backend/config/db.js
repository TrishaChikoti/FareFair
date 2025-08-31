const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/farefair";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️ Running without database - some features may be limited");
    console.log("💡 To fix this:");
    console.log("   1. Install MongoDB locally: brew install mongodb-community");
    console.log("   2. Start MongoDB: brew services start mongodb-community");
    console.log("   3. Or use MongoDB Atlas (cloud database)");
  }
};

module.exports = connectDB;
