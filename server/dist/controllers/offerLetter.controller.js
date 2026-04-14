"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOfferLetter = exports.listOfferLetters = exports.createOfferLetter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OfferLetter_model_1 = require("../models/OfferLetter.model");
function isValidDate(value) {
    return !Number.isNaN(new Date(value).getTime());
}
const createOfferLetter = async (req, res) => {
    try {
        const regNo = String(req.body.regNo || "").trim();
        const issueDate = String(req.body.issueDate || "").trim();
        const candidateName = String(req.body.candidateName || "").trim();
        const location = String(req.body.location || "").trim();
        const position = String(req.body.position || "").trim();
        const joiningDate = String(req.body.joiningDate || "").trim();
        const salaryPackage = String(req.body.salaryPackage || "").trim();
        const headerImagePath = String(req.body.headerImagePath || "").trim() || "/letters/offer-letter-top.png";
        const footerImagePath = String(req.body.footerImagePath || "").trim() || "/letters/offer-letter-bottom.png";
        const logoPath = String(req.body.logoPath || "").trim() || "/letters/logo.png";
        const signaturePath = String(req.body.signaturePath || "").trim() || "/letters/signature.png";
        if (!regNo ||
            !issueDate ||
            !candidateName ||
            !location ||
            !position ||
            !joiningDate ||
            !salaryPackage) {
            return res.status(400).json({
                success: false,
                message: "Reg no, issue date, candidate name, location, position, joining date and salary package are required.",
            });
        }
        if (!isValidDate(issueDate) || !isValidDate(joiningDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid issue date and joining date.",
            });
        }
        const existing = await OfferLetter_model_1.OfferLetter.exists({ regNo });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "An offer letter with this registration number already exists.",
            });
        }
        const adminEmail = typeof req.admin?.email === "string"
            ? req.admin?.email
            : undefined;
        const letter = await OfferLetter_model_1.OfferLetter.create({
            regNo,
            issueDate: new Date(issueDate),
            candidateName,
            location,
            position,
            joiningDate: new Date(joiningDate),
            salaryPackage,
            headerImagePath,
            footerImagePath,
            logoPath,
            signaturePath,
            createdBy: adminEmail,
        });
        return res.status(201).json({
            success: true,
            message: "Offer letter created successfully.",
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
        console.error("createOfferLetter error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.createOfferLetter = createOfferLetter;
const listOfferLetters = async (_req, res) => {
    try {
        const items = await OfferLetter_model_1.OfferLetter.find().sort({ createdAt: -1 }).limit(300);
        return res.json({
            success: true,
            message: "OK",
            data: items,
        });
    }
    catch (err) {
        console.error("listOfferLetters error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.listOfferLetters = listOfferLetters;
const deleteOfferLetter = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer letter id.",
            });
        }
        const deleted = await OfferLetter_model_1.OfferLetter.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Offer letter not found.",
            });
        }
        return res.json({
            success: true,
            message: "Offer letter deleted successfully.",
            data: { id: deleted._id },
        });
    }
    catch (err) {
        console.error("deleteOfferLetter error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteOfferLetter = deleteOfferLetter;
