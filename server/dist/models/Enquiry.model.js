"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AttachmentSchema = new mongoose_1.default.Schema({
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
}, { _id: false });
const EnquirySchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    company: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, minlength: 7, maxlength: 25 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 1, maxlength: 3000 },
    attachment: { type: AttachmentSchema, default: null },
}, { timestamps: true });
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ phone: 1 });
EnquirySchema.index({ email: 1 });
exports.Enquiry = mongoose_1.default.model("Enquiry", EnquirySchema);
