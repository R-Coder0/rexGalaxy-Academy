import { Request, Response } from "express";
import { Application } from "../models/Application.model";
import mongoose from "mongoose";
import path from "path";
import { promises as fs } from "fs";

const toPublicUrl = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

// converts "/uploads/abc.pdf" -> absolute filesystem path
const toAbsolutePathFromPublicUrl = (publicUrl: string) => {
  const clean = publicUrl.replace(/\\/g, "/").replace(/^\//, ""); // remove leading slash
  return path.join(process.cwd(), clean);
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const {
      jobId,
      jobTitle,
      fullName,
      phone,
      email,
      experience,
      location,
      noticePeriod,
      message,
    } = req.body as Record<string, string>;

    const file = req.file;

    if (!jobTitle?.trim())
      return res.status(400).json({ message: "jobTitle is required" });
    if (!fullName?.trim())
      return res.status(400).json({ message: "fullName is required" });
    if (!phone?.trim())
      return res.status(400).json({ message: "phone is required" });
    if (!email?.trim())
      return res.status(400).json({ message: "email is required" });

    if (!file) return res.status(400).json({ message: "resume file is required" });

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Invalid resume type. Allowed: PDF/DOC/DOCX" });
    }

    const doc = await Application.create({
      jobId: jobId || undefined,
      jobTitle: jobTitle.trim(),

      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),

      experience: experience?.trim() || undefined,
      location: location?.trim() || undefined,
      noticePeriod: noticePeriod?.trim() || undefined,
      message: message?.trim() || undefined,

      resumeUrl: toPublicUrl(file.path),
      resumeName: file.originalname,
      resumeMime: file.mimetype,
      resumeSize: file.size,
    });

    return res.status(201).json({
      message: "Application submitted",
      data: {
        id: doc._id,
        createdAt: doc.createdAt,
      },
    });
  } catch (e: any) {
    return res.status(500).json({ message: "Failed to submit application" });
  }
};

export const listApplicationsAdmin = async (req: Request, res: Response) => {
  try {
    const { from, to, q, jobId, page = "1", limit = "20" } = req.query as Record<
      string,
      string
    >;

    const filter: any = {};

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (jobId) filter.jobId = jobId;

    if (q?.trim()) {
      const rx = new RegExp(q.trim(), "i");
      filter.$or = [{ fullName: rx }, { email: rx }, { phone: rx }, { jobTitle: rx }];
    }

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);

    const [items, total] = await Promise.all([
      Application.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      Application.countDocuments(filter),
    ]);

    res.json({
      message: "Applications fetched",
      data: items,
      meta: { page: p, limit: l, total },
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// ✅ DELETE controller
// Route: DELETE /api/careers/admin/:id
export const deleteApplicationAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    // find doc first to get resumeUrl for file cleanup
    const doc = await Application.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Application not found" });
    }

    const resumeUrl = (doc as any).resumeUrl as string | undefined;
    const fileAbsPath = resumeUrl ? toAbsolutePathFromPublicUrl(resumeUrl) : null;

    // delete DB record
    await doc.deleteOne();

    // best-effort file delete (ignore errors like file missing)
    if (fileAbsPath) {
      try {
        await fs.unlink(fileAbsPath);
      } catch {
        // ignore
      }
    }

    return res.status(200).json({ message: "Application deleted" });
  } catch (e) {
    return res.status(500).json({ message: "Failed to delete application" });
  }
};
