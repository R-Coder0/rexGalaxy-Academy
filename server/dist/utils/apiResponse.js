"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
function ok(data, message = "OK") {
    return { success: true, message, data };
}
function fail(message = "Error", data = null) {
    return { success: false, message, data };
}
