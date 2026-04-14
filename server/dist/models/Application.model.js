"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const ApplicationSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: false },
    jobTitle: { type: String, required: true, trim: true, minlength: 2 },
    fullName: { type: String, required: true, trim: true, minlength: 2 },
    phone: { type: String, required: true, trim: true, minlength: 8, maxlength: 16 },
    email: { type: String, required: true, trim: true, lowercase: true },
    experience: { type: String, trim: true },
    location: { type: String, trim: true },
    noticePeriod: { type: String, trim: true },
    message: { type: String, trim: true },
    resumeUrl: { type: String, required: true },
    resumeName: { type: String, required: true },
    resumeMime: { type: String, required: true },
    resumeSize: { type: Number, required: true },
}, { timestamps: true });
// indexes for admin filtering
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ jobId: 1, createdAt: -1 });
ApplicationSchema.index({ email: 1, createdAt: -1 });
exports.Application = (0, mongoose_1.model)("Application", ApplicationSchema);
