import mongoose from "mongoose";
import { env } from "../config/env";
import { UserModel } from "../modules/auth/user.model";

/**
 * Reset admin user - delete and recreate
 */
async function resetAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    // Delete existing admin
    const deleteResult = await UserModel.deleteOne({
      email: "admin@vocabprep.com",
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} admin user(s)`);

    // Create new admin user (password will be hashed by pre-save hook)
    const adminUser = await UserModel.create({
      name: "Admin User",
      email: "admin@vocabprep.com",
      password: "admin123",
      isAdmin: true,
      subscriptionTier: "premium",
      aiRequestsRemaining: 500,
      aiResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    console.log("✅ Admin user recreated successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@vocabprep.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: Admin");
    console.log("💎 Tier: Premium");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error resetting admin:", error);
    process.exit(1);
  }
}

// Run the script
resetAdmin();
