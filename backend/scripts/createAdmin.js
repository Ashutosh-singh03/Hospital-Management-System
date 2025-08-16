import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@hospital.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@hospital.com",
      phone: "1234567890",
      nic: "1234567890123",
      dob: "1990-01-01",
      gender: "Male",
      password: "Admin@123",
      role: "Admin"
    });

    console.log("Admin created successfully:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin(); 