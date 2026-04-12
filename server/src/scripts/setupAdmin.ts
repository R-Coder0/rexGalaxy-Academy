import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { Admin } from "../models/Admin.model";
 
async function setupAdmin() {
  const MONGO_URI = process.env.MONGO_URI as string;
  const email = process.env.ADMIN_EMAIL as string;
  const password = process.env.ADMIN_PASSWORD as string;

  if (!MONGO_URI) throw new Error("MONGO_URI missing");
  if (!email || !password) throw new Error("ADMIN_EMAIL/ADMIN_PASSWORD missing in .env");

  await connectDB(MONGO_URI);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });

  console.log("Admin created successfully:", email);
  process.exit(0);
}

setupAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
