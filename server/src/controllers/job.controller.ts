import { Request, Response } from "express";
import { Job } from "../models/Job.model";

// PUBLIC: list active jobs
export async function listJobs(req: Request, res: Response) {
  const { q, type, location } = req.query;

  const filter: any = { isActive: true };

  if (type) filter.type = String(type);
  if (location) filter.location = new RegExp(String(location), "i");

  if (q) {
    const rx = new RegExp(String(q), "i");
    filter.$or = [
      { title: rx },
      { description: rx },
      { location: rx },
      { qualificationAndExperience: rx }, // ✅ added
    ];
  }

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
}

// PUBLIC: job detail (only active)
export async function getJob(req: Request, res: Response) {
  const { id } = req.params;

  const job = await Job.findOne({ _id: id, isActive: true });
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  res.json({ success: true, data: job });
}

// ADMIN: list all jobs (active + inactive)
export async function adminListJobs(req: Request, res: Response) {
  const jobs = await Job.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
}

// ADMIN: create job
export async function createJob(req: Request, res: Response) {
  const payload = req.body;

  const job = await Job.create({
    title: payload.title,
    description: payload.description,
    type: payload.type,
    location: payload.location,

    qualificationAndExperience: payload.qualificationAndExperience, // ✅ added

    experienceMin: Number(payload.experienceMin ?? 0),
    experienceMax: Number(payload.experienceMax ?? 0),

    salaryLabel: payload.salaryLabel,

    responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities : [],
    requirements: Array.isArray(payload.requirements) ? payload.requirements : [],
    goodToHave: Array.isArray(payload.goodToHave) ? payload.goodToHave : [],

    isActive: payload.isActive ?? true,
  });

  res.status(201).json({ success: true, data: job });
}

// ADMIN: update job
export async function updateJob(req: Request, res: Response) {
  const { id } = req.params;
  const payload = req.body;

  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  if (payload.title !== undefined) job.title = payload.title;
  if (payload.description !== undefined) job.description = payload.description;
  if (payload.type !== undefined) job.type = payload.type;
  if (payload.location !== undefined) job.location = payload.location;

  if (payload.qualificationAndExperience !== undefined)
    job.qualificationAndExperience = payload.qualificationAndExperience; // ✅ added

  if (payload.experienceMin !== undefined) job.experienceMin = Number(payload.experienceMin);
  if (payload.experienceMax !== undefined) job.experienceMax = Number(payload.experienceMax);

  if (payload.salaryLabel !== undefined) job.salaryLabel = payload.salaryLabel;

  if (payload.responsibilities !== undefined)
    job.responsibilities = Array.isArray(payload.responsibilities) ? payload.responsibilities : [];

  if (payload.requirements !== undefined)
    job.requirements = Array.isArray(payload.requirements) ? payload.requirements : [];

  if (payload.goodToHave !== undefined)
    job.goodToHave = Array.isArray(payload.goodToHave) ? payload.goodToHave : [];

  if (payload.isActive !== undefined) job.isActive = Boolean(payload.isActive);

  await job.save();
  res.json({ success: true, data: job });
}

// ADMIN: toggle active
export async function toggleJob(req: Request, res: Response) {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  job.isActive = !job.isActive;
  await job.save();

  res.json({ success: true, data: job });
}

// ADMIN: delete job (hard delete - basic)
export async function deleteJob(req: Request, res: Response) {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  res.json({ success: true, message: "Job deleted" });
}
