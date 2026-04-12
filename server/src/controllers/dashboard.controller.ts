import type { Request, Response } from "express";
import { Job } from "../models/Job.model";
import { Application } from "../models/Application.model";
import { Enquiry } from "../models/Enquiry.model";
import { Feedback } from "../models/Feedback.model";

type ActivityItem = {
  type: "job" | "application" | "enquiry" | "feedback";
  title: string;
  meta: string;
  createdAt: Date;
};

export const getAdminDashboard = async (_req: Request, res: Response) => {
  try {
    // counts
    const [activeJobs, applications, enquiries, feedback] = await Promise.all([
      Job.countDocuments({ isActive: true }),
      Application.countDocuments({}),
      Enquiry.countDocuments({}),
      Feedback.countDocuments({}),
    ]);

    // latest (fetch separately then merge + sort)
    const [latestApps, latestEnqs, latestFbs, latestJobs] = await Promise.all([
      Application.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName jobTitle createdAt"),
      Enquiry.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name email phone createdAt"),
      Feedback.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name email message createdAt"),
      Job.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title type location createdAt"),
    ]);

    const activity: ActivityItem[] = [];

    latestApps.forEach((a: any) => {
      activity.push({
        type: "application",
        title: `New application: ${a.fullName || "Candidate"}`,
        meta: a.jobTitle ? `${a.jobTitle}` : "Job application",
        createdAt: a.createdAt,
      });
    });

    latestEnqs.forEach((e: any) => {
      activity.push({
        type: "enquiry",
        title: `New enquiry: ${e.name || "Visitor"}`,
        meta: e.email ? `${e.email}` : e.phone ? `${e.phone}` : "Website enquiry",
        createdAt: e.createdAt,
      });
    });

    latestFbs.forEach((f: any) => {
      activity.push({
        type: "feedback",
        title: `New feedback: ${f.name || "User"}`,
        meta: f.message ? `${String(f.message).slice(0, 60)}...` : "Feedback submitted",
        createdAt: f.createdAt,
      });
    });

    latestJobs.forEach((j: any) => {
      activity.push({
        type: "job",
        title: `Job created: ${j.title}`,
        meta: `${j.type || ""}${j.location ? ` • ${j.location}` : ""}`.trim(),
        createdAt: j.createdAt,
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
        },
        latest: activity.slice(0, 6).map((x) => ({
          type: x.type,
          title: x.title,
          meta: x.meta,
          createdAt: x.createdAt,
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Dashboard fetch failed." });
  }
};
