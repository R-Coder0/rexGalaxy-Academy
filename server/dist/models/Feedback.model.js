"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbackSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    organization: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
}, { timestamps: true });
// helpful indexes
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ email: 1 });
exports.Feedback = mongoose_1.default.model("Feedback", FeedbackSchema);
