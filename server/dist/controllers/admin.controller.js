"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetFeedback = exports.adminGetEnquiries = exports.adminGetApplications = exports.adminDeleteJob = exports.adminUpdateJob = exports.adminCreateJob = exports.adminGetJobs = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const Job_model_1 = require("../models/Job.model");
const Application_model_1 = require("../models/Application.model");
const Enquiry_model_1 = require("../models/Enquiry.model");
const Feedback_model_1 = require("../models/Feedback.model");
exports.adminGetJobs = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const jobs = await Job_model_1.Job.find().sort({ createdAt: -1 });
    res.json((0, apiResponse_1.ok)({ jobs }));
});
exports.adminCreateJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const job = await Job_model_1.Job.create(req.body);
    res.status(201).json((0, apiResponse_1.ok)({ job }, "Job created"));
});
exports.adminUpdateJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const job = await Job_model_1.Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json((0, apiResponse_1.ok)({ job }, "Job updated"));
});
exports.adminDeleteJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await Job_model_1.Job.findByIdAndDelete(req.params.id);
    res.json((0, apiResponse_1.ok)({}));
});
exports.adminGetApplications = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const applications = await Application_model_1.Application.find().sort({ createdAt: -1 });
    res.json((0, apiResponse_1.ok)({ applications }));
});
exports.adminGetEnquiries = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const enquiries = await Enquiry_model_1.Enquiry.find().sort({ createdAt: -1 });
    res.json((0, apiResponse_1.ok)({ enquiries }));
});
exports.adminGetFeedback = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const feedback = await Feedback_model_1.Feedback.find().sort({ createdAt: -1 });
    res.json((0, apiResponse_1.ok)({ feedback }));
});
