"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_model_1 = require("../models/Admin.model");
const adminLogin = async (req, res) => {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email & password required" });
    }
    const admin = await Admin_model_1.Admin.findOne({ email });
    if (!admin) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcryptjs_1.default.compare(password, admin.passwordHash);
    if (!match) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token });
};
exports.adminLogin = adminLogin;
