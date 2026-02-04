import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

export async function connectDB() {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    "mongodb://127.0.0.1:27017/qr-menu";
  const dbName = process.env.MONGO_DB || "qr-menu";
  await mongoose.connect(uri, { dbName });
  console.log("MongoDB connected");
}

export async function seedAdminUser() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "password123";
  const isAdmin = true;
  const existing = await User.findOne({ username });
  if (!existing) {
    await User.create({ username, password, isAdmin });
    console.log(`Admin user seeded: ${username}/${password}`);
  } else {
    console.log("Admin user already exists");
  }
}

export default { connectDB, seedAdminUser };

