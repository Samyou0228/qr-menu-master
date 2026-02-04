import dotenv from "dotenv";
import { connectDB, seedAdminUser } from "./db.js";

dotenv.config();

async function run() {
  try {
    await connectDB();
    await seedAdminUser();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    // Allow mongoose to close naturally; small timeout to flush logs
    setTimeout(() => process.exit(), 200);
  }
}

run();

