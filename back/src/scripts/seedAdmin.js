import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    }

    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      name: "Admin",
      email: adminEmail,
      passwordHash,
      role: "admin"
    });
    await adminUser.save();
    console.log("Admin user created:", adminEmail);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();