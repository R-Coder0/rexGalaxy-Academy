"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegistrationStatus = exports.deleteRegistration = exports.listRegistrations = exports.createRegistration = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Registration_model_1 = require("../models/Registration.model");
const mail_service_1 = require("../services/mail.service");
async function generateRegistrationCode() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const code = `RGA-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const exists = await Registration_model_1.Registration.exists({ registrationCode: code });
        if (!exists)
            return code;
    }
    return `RGA-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`;
}
const createRegistration = async (req, res) => {
    try {
        const fullName = String(req.body.fullName || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phone = String(req.body.phone || "").trim();
        const course = String(req.body.course || "").trim();
        const address = String(req.body.address || "").trim();
        const city = String(req.body.city || "").trim();
        const country = String(req.body.country || "").trim();
        const zipcode = String(req.body.zipcode || "").trim();
        if (!fullName ||
            !email ||
            !phone ||
            !course ||
            !address ||
            !city ||
            !country ||
            !zipcode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }
        const registrationCode = await generateRegistrationCode();
        const registration = await Registration_model_1.Registration.create({
            registrationCode,
            fullName,
            email,
            phone,
            course,
            address,
            city,
            country,
            zipcode,
        });
        (0, mail_service_1.sendRegistrationMails)({
            registrationCode,
            fullName,
            email,
            phone,
            course,
            address,
            city,
            country,
            zipcode,
        }).catch((error) => {
            console.error("Registration mail failed:", error);
        });
        return res.status(201).json({
            success: true,
            message: "Registration submitted successfully.",
            data: {
                id: registration._id,
                registrationCode: registration.registrationCode,
            },
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed. Please check your inputs.",
            });
        }
        console.error("createRegistration error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.createRegistration = createRegistration;
const listRegistrations = async (_req, res) => {
    try {
        const items = await Registration_model_1.Registration.find().sort({ createdAt: -1 }).limit(500);
        return res.json({
            success: true,
            message: "OK",
            data: items,
        });
    }
    catch (err) {
        console.error("listRegistrations error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.listRegistrations = listRegistrations;
const deleteRegistration = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration id.",
            });
        }
        const deleted = await Registration_model_1.Registration.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Registration not found.",
            });
        }
        return res.json({
            success: true,
            message: "Registration deleted successfully.",
            data: { id: deleted._id },
        });
    }
    catch (err) {
        console.error("deleteRegistration error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteRegistration = deleteRegistration;
const updateRegistrationStatus = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        const status = String(req.body.status || "").trim();
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration id.",
            });
        }
        if (!["new", "contacted", "enrolled", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value.",
            });
        }
        const updated = await Registration_model_1.Registration.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Registration not found.",
            });
        }
        return res.json({
            success: true,
            message: "Registration status updated successfully.",
            data: updated,
        });
    }
    catch (err) {
        console.error("updateRegistrationStatus error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.updateRegistrationStatus = updateRegistrationStatus;
