"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const maxMB = Number(process.env.MAX_FILE_MB || 10);
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_");
        const ext = path_1.default.extname(safeName);
        const base = path_1.default.basename(safeName, ext);
        cb(null, `${base}-${Date.now()}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    // Allow common docs + images
    const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/png",
        "image/jpeg",
        "image/webp",
    ];
    if (allowed.includes(file.mimetype))
        return cb(null, true);
    cb(new Error("Invalid file type. Allowed: PDF/DOC/DOCX/XLS/XLSX/PNG/JPG/WEBP"));
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: maxMB * 1024 * 1024 },
});
