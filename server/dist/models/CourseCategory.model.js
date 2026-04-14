"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseCategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 120,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength: 140,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    icon: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
CourseCategorySchema.index({ title: 1 });
CourseCategorySchema.index({ slug: 1 }, { unique: true });
CourseCategorySchema.index({ isActive: 1, order: 1 });
exports.CourseCategory = mongoose_1.default.model("CourseCategory", CourseCategorySchema);
