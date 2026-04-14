"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.listEnquiries = exports.createEnquiry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Enquiry_model_1 = require("../models/Enquiry.model");
const mail_service_1 = require("../services/mail.service");
const createEnquiry = async (req, res) => {
    try {
        const fullName = String(req.body.fullName || "").trim();
        const company = String(req.body.company || "").trim();
        const phone = String(req.body.phone || "").trim();
        const email = String(req.body.email || "").toLowerCase().trim();
        const message = String(req.body.message || "").trim();
        if (!fullName || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "Full Name, Phone and Requirement/Message are required.",
            });
        }
        if (email) {
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailOk) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address.",
                });
            }
        }
        const file = req.file;
        const enquiry = await Enquiry_model_1.Enquiry.create({
            fullName,
            company: company || undefined,
            phone,
            email: email || undefined,
            message,
            attachment: file
                ? {
                    originalName: file.originalname,
                    fileName: file.filename,
                    mimeType: file.mimetype,
                    size: file.size,
                    path: file.path,
                }
                : null,
        });
        // ✅ Send mail to admin (non-blocking)
        (0, mail_service_1.sendEnquiryMail)({
            fullName,
            company: company || undefined,
            phone,
            email: email || undefined,
            message,
            attachmentPath: file?.path,
            attachmentName: file?.originalname,
            attachmentMime: file?.mimetype,
        }).catch((e) => console.error("Enquiry mail failed:", e));
        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: { id: enquiry._id },
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed. Please check your inputs.",
            });
        }
        const msg = typeof err?.message === "string"
            ? err.message
            : "Server error. Please try again later.";
        console.error("createEnquiry error:", err);
        return res.status(500).json({ success: false, message: msg });
    }
};
exports.createEnquiry = createEnquiry;
// (Admin) list enquiries
const listEnquiries = async (_req, res) => {
    try {
        const items = await Enquiry_model_1.Enquiry.find().sort({ createdAt: -1 }).limit(300);
        return res.json({ success: true, message: "OK", data: items });
    }
    catch (err) {
        console.error("listEnquiries error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.listEnquiries = listEnquiries;
// ✅ (Admin) delete enquiry
// ✅ (Admin) delete enquiry
const deleteEnquiry = async (req, res) => {
    try {
        // ✅ force string (fix TS: string | string[])
        const id = String(req.params.id || "").trim();
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry id.",
            });
        }
        const deleted = await Enquiry_model_1.Enquiry.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }
        return res.json({
            success: true,
            message: "Enquiry deleted successfully.",
            data: { id: deleted._id },
        });
    }
    catch (err) {
        console.error("deleteEnquiry error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteEnquiry = deleteEnquiry;
