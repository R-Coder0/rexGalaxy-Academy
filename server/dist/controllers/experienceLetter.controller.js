"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperienceLetter = exports.listExperienceLetters = exports.createExperienceLetter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ExperienceLetter_model_1 = require("../models/ExperienceLetter.model");
function isValidDate(value) {
    return !Number.isNaN(new Date(value).getTime());
}
const createExperienceLetter = async (req, res) => {
    try {
        const regNo = String(req.body.regNo || "").trim();
        const issueDate = String(req.body.issueDate || "").trim();
        const candidateName = String(req.body.candidateName || "").trim();
        const location = String(req.body.location || "").trim();
        const position = String(req.body.position || "").trim();
        const experienceDuration = String(req.body.experienceDuration || "").trim();
        const experienceFrom = String(req.body.experienceFrom || "").trim();
        const experienceTo = String(req.body.experienceTo || "").trim();
        const headerImagePath = String(req.body.headerImagePath || "").trim() || "/letters/offer-letter-top.png";
        const footerImagePath = String(req.body.footerImagePath || "").trim() || "/letters/bottom.png";
        const logoPath = String(req.body.logoPath || "").trim() || "/letters/logo.jpeg";
        const signaturePath = String(req.body.signaturePath || "").trim() || "/letters/sign.png";
        if (!regNo ||
            !issueDate ||
            !candidateName ||
            !location ||
            !position ||
            !experienceDuration ||
            !experienceFrom ||
            !experienceTo) {
            return res.status(400).json({
                success: false,
                message: "Reg no, issue date, candidate name, location, position, experience duration, from date and to date are required.",
            });
        }
        if (!isValidDate(issueDate) ||
            !isValidDate(experienceFrom) ||
            !isValidDate(experienceTo)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid issue, from and to dates.",
            });
        }
        const existing = await ExperienceLetter_model_1.ExperienceLetter.exists({ regNo });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "An experience letter with this registration number already exists.",
            });
        }
        const adminEmail = typeof req.admin?.email === "string"
            ? req.admin?.email
            : undefined;
        const letter = await ExperienceLetter_model_1.ExperienceLetter.create({
            regNo,
            issueDate: new Date(issueDate),
            candidateName,
            location,
            position,
            experienceDuration,
            experienceFrom: new Date(experienceFrom),
            experienceTo: new Date(experienceTo),
            headerImagePath,
            footerImagePath,
            logoPath,
            signaturePath,
            createdBy: adminEmail,
        });
        return res.status(201).json({
            success: true,
            message: "Experience letter created successfully.",
            data: letter,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed. Please check your inputs.",
            });
        }
        console.error("createExperienceLetter error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.createExperienceLetter = createExperienceLetter;
const listExperienceLetters = async (_req, res) => {
    try {
        const items = await ExperienceLetter_model_1.ExperienceLetter.find().sort({ createdAt: -1 }).limit(300);
        return res.json({
            success: true,
            message: "OK",
            data: items,
        });
    }
    catch (err) {
        console.error("listExperienceLetters error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.listExperienceLetters = listExperienceLetters;
const deleteExperienceLetter = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience letter id.",
            });
        }
        const deleted = await ExperienceLetter_model_1.ExperienceLetter.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Experience letter not found.",
            });
        }
        return res.json({
            success: true,
            message: "Experience letter deleted successfully.",
            data: { id: deleted._id },
        });
    }
    catch (err) {
        console.error("deleteExperienceLetter error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteExperienceLetter = deleteExperienceLetter;
