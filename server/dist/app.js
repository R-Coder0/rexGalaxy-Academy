"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    app.use(`/${uploadDir}`, express_1.default.static(path_1.default.resolve(uploadDir)));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", routes_1.default);
    app.use(error_middleware_1.errorHandler);
    return app;
}
