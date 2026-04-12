import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/apiResponse";
import { Job } from "../models/Job.model";
import { Application } from "../models/Application.model";
import { Enquiry } from "../models/Enquiry.model";
import { Feedback } from "../models/Feedback.model";

export const adminGetJobs = asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(ok({ jobs }));
});

export const adminCreateJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.create(req.body);
  res.status(201).json(ok({ job }, "Job created"));
});

export const adminUpdateJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ok({ job }, "Job updated"));
});

export const adminDeleteJob = asyncHandler(async (req: Request, res: Response) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json(ok({}));
});

export const adminGetApplications = asyncHandler(async (_req: Request, res: Response) => {
  const applications = await Application.find().sort({ createdAt: -1 });
  res.json(ok({ applications }));
});

export const adminGetEnquiries = asyncHandler(async (_req: Request, res: Response) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(ok({ enquiries }));
});

export const adminGetFeedback = asyncHandler(async (_req: Request, res: Response) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  res.json(ok({ feedback }));
});
