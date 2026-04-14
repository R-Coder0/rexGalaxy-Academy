import type { Request, Response } from "express";
import { Job } from "../models/Job.model";
import { Application } from "../models/Application.model";
import { Enquiry } from "../models/Enquiry.model";
import { Feedback } from "../models/Feedback.model";
import { Registration } from "../models/Registration.model";

type ActivityItem = {
  type: "job" | "application" | "enquiry" | "feedback" | "registration";
  title: string;
  meta: string;
  createdAt: Date;
};

export const getAdminDashboard = async (_req: Request, res: Response) => {
  try {
    const [activeJobs, applications, enquiries, feedback, registrations] =
      await Promise.all([
        Job.countDocuments({ isActive: true }),
        Application.countDocuments({}),
        Enquiry.countDocuments({}),
        Feedback.countDocuments({}),
        Registration.countDocuments({}),
      ]);

    const [
      latestApps,
      latestEnqs,
      latestFbs,
      latestJobs,
      latestRegistrations,
    ] = await Promise.all([
      Application.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName jobTitle createdAt"),
      Enquiry.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName email phone createdAt"),
      Feedback.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName email message createdAt"),
      Job.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title type location createdAt"),
      Registration.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName course registrationCode createdAt"),
    ]);

    const activity: ActivityItem[] = [];

    latestApps.forEach((item: any) => {
      activity.push({
        type: "application",
        title: `New application: ${item.fullName || "Candidate"}`,
        meta: item.jobTitle || "Job application",
        createdAt: item.createdAt,
      });
    });

    latestEnqs.forEach((item: any) => {
      activity.push({
        type: "enquiry",
        title: `New enquiry: ${item.fullName || "Visitor"}`,
        meta: item.email || item.phone || "Website enquiry",
        createdAt: item.createdAt,
      });
    });

    latestFbs.forEach((item: any) => {
      activity.push({
        type: "feedback",
        title: `New feedback: ${item.fullName || "User"}`,
        meta: item.message ? `${String(item.message).slice(0, 60)}...` : "Feedback submitted",
        createdAt: item.createdAt,
      });
    });

    latestJobs.forEach((item: any) => {
      activity.push({
        type: "job",
        title: `Job created: ${item.title}`,
        meta: `${item.type || ""}${item.location ? ` • ${item.location}` : ""}`.trim(),
        createdAt: item.createdAt,
      });
    });

    latestRegistrations.forEach((item: any) => {
      activity.push({
        type: "registration",
        title: `New registration: ${item.fullName || "Student"}`,
        meta: `${item.course || "Course registration"}${
          item.registrationCode ? ` • ${item.registrationCode}` : ""
        }`.trim(),
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
  } catch {
    return res.status(500).json({ message: "Dashboard fetch failed." });
  }
};
