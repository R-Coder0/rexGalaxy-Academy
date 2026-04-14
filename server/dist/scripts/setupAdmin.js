"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const Admin_model_1 = require("../models/Admin.model");
async function setupAdmin() {
    const MONGO_URI = process.env.MONGO_URI;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!MONGO_URI)
        throw new Error("MONGO_URI missing");
    if (!email || !password)
        throw new Error("ADMIN_EMAIL/ADMIN_PASSWORD missing in .env");
    await (0, db_1.connectDB)(MONGO_URI);
    const existing = await Admin_model_1.Admin.findOne({ email });
    if (existing) {
        console.log("Admin already exists:", email);
        process.exit(0);
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    await Admin_model_1.Admin.create({ email, passwordHash });
    console.log("Admin created successfully:", email);
    process.exit(0);
}
setupAdmin().catch((e) => {
    console.error(e);
    process.exit(1);
});
