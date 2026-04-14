"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.statusCoe || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}
