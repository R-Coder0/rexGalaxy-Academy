"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error(err);
    const isPayloadTooLarge = err?.type === "entity.too.large" || err?.code === "LIMIT_FILE_SIZE";
    const status = isPayloadTooLarge ? 413 : err.statusCode || err.status || 500;
    const message = isPayloadTooLarge
        ? "Uploaded content is too large. Please reduce the file size and try again."
        : err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message,
    });
}
