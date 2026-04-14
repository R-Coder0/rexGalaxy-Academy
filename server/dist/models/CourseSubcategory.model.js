"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSubcategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSubcategorySchema = new mongoose_1.default.Schema({
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CourseCategory",
        required: true,
    },
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
        maxlength: 140,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
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
CourseSubcategorySchema.index({ categoryId: 1, order: 1 });
CourseSubcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });
CourseSubcategorySchema.index({ isActive: 1 });
exports.CourseSubcategory = mongoose_1.default.model("CourseSubcategory", CourseSubcategorySchema);
