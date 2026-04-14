"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = void 0;
const Job_model_1 = require("../models/Job.model");
const Application_model_1 = require("../models/Application.model");
const Enquiry_model_1 = require("../models/Enquiry.model");
const Feedback_model_1 = require("../models/Feedback.model");
const Registration_model_1 = require("../models/Registration.model");
const getAdminDashboard = async (_req, res) => {
    try {
        const [activeJobs, applications, enquiries, feedback, registrations] = await Promise.all([
            Job_model_1.Job.countDocuments({ isActive: true }),
            Application_model_1.Application.countDocuments({}),
            Enquiry_model_1.Enquiry.countDocuments({}),
            Feedback_model_1.Feedback.countDocuments({}),
            Registration_model_1.Registration.countDocuments({}),
        ]);
        const [latestApps, latestEnqs, latestFbs, latestJobs, latestRegistrations,] = await Promise.all([
            Application_model_1.Application.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("fullName jobTitle createdAt"),
            Enquiry_model_1.Enquiry.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("fullName email phone createdAt"),
            Feedback_model_1.Feedback.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("fullName email message createdAt"),
            Job_model_1.Job.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("title type location createdAt"),
            Registration_model_1.Registration.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("fullName course registrationCode createdAt"),
        ]);
        const activity = [];
        latestApps.forEach((item) => {
            activity.push({
                type: "application",
                title: `New application: ${item.fullName || "Candidate"}`,
                meta: item.jobTitle || "Job application",
                createdAt: item.createdAt,
            });
        });
        latestEnqs.forEach((item) => {
            activity.push({
                type: "enquiry",
                title: `New enquiry: ${item.fullName || "Visitor"}`,
                meta: item.email || item.phone || "Website enquiry",
                createdAt: item.createdAt,
            });
        });
        latestFbs.forEach((item) => {
            activity.push({
                type: "feedback",
                title: `New feedback: ${item.fullName || "User"}`,
                meta: item.message ? `${String(item.message).slice(0, 60)}...` : "Feedback submitted",
                createdAt: item.createdAt,
            });
        });
        latestJobs.forEach((item) => {
            activity.push({
                type: "job",
                title: `Job created: ${item.title}`,
                meta: `${item.type || ""}${item.location ? ` • ${item.location}` : ""}`.trim(),
                createdAt: item.createdAt,
            });
        });
        latestRegistrations.forEach((item) => {
            activity.push({
                type: "registration",
                title: `New registration: ${item.fullName || "Student"}`,
                meta: `${item.course || "Course registration"}${item.registrationCode ? ` • ${item.registrationCode}` : ""}`.trim(),
                createdAt: item.createdAt,
            });
        });
        activity.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        return res.json({
            message: "ok",
            data: {
                stats: {
                    activeJobs,
                    applications,
                    enquiries,
                    feedback,
                    registrations,
                },
                latest: activity.slice(0, 8).map((item) => ({
                    type: item.type,
                    title: item.title,
                    meta: item.meta,
                    createdAt: item.createdAt,
                })),
            },
        });
    }
    catch {
        return res.status(500).json({ message: "Dashboard fetch failed." });
    }
};
exports.getAdminDashboard = getAdminDashboard;
