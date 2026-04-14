"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/* Public */
router.post("/", registration_controller_1.createRegistration);
/* Admin */
router.get("/", auth_middleware_1.requireAdmin, registration_controller_1.listRegistrations);
router.delete("/:id", auth_middleware_1.requireAdmin, registration_controller_1.deleteRegistration);
router.patch("/:id/status", auth_middleware_1.requireAdmin, registration_controller_1.updateRegistrationStatus);
exports.default = router;
