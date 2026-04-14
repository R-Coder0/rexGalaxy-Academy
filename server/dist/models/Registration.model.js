"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RegistrationSchema = new mongoose_1.default.Schema({
    registrationCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 40,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 120,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 120,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 20,
    },
    course: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    zipcode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    status: {
        type: String,
        enum: ["new", "contacted", "enrolled", "rejected"],
        default: "new",
    },
}, { timestamps: true });
RegistrationSchema.index({ createdAt: -1 });
RegistrationSchema.index({ registrationCode: 1 }, { unique: true });
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ phone: 1 });
RegistrationSchema.index({ course: 1 });
exports.Registration = mongoose_1.default.model("Registration", RegistrationSchema);
