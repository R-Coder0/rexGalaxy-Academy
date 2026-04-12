import { Request, Response } from "express";
import mongoose from "mongoose";
import { Enquiry } from "../models/Enquiry.model";
import { sendEnquiryMail } from "../services/mail.service";

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const company = String(req.body.company || "").trim();
    const phone = String(req.body.phone || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const message = String(req.body.message || "").trim();

    if (!fullName || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Phone and Requirement/Message are required.",
      });
    }

    if (email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }
    }

    const file = req.file;

    const enquiry = await Enquiry.create({
      fullName,
      company: company || undefined,
      phone,
      email: email || undefined,
      message,
      attachment: file
        ? {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          }
        : null,
    });

    // ✅ Send mail to admin (non-blocking)
    sendEnquiryMail({
      fullName,
      company: company || undefined,
      phone,
      email: email || undefined,
      message,
      attachmentPath: file?.path,
      attachmentName: file?.originalname,
      attachmentMime: file?.mimetype,
    }).catch((e) => console.error("Enquiry mail failed:", e));

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: { id: enquiry._id },
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your inputs.",
      });
    }

    const msg =
      typeof err?.message === "string"
        ? err.message
        : "Server error. Please try again later.";

    console.error("createEnquiry error:", err);
    return res.status(500).json({ success: false, message: msg });
  }
};

// (Admin) list enquiries
export const listEnquiries = async (_req: Request, res: Response) => {
  try {
    const items = await Enquiry.find().sort({ createdAt: -1 }).limit(300);
    return res.json({ success: true, message: "OK", data: items });
  } catch (err) {
    console.error("listEnquiries error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ✅ (Admin) delete enquiry
// ✅ (Admin) delete enquiry
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    // ✅ force string (fix TS: string | string[])
    const id = String(req.params.id || "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry id.",
      });
    }

    const deleted = await Enquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.json({
      success: true,
      message: "Enquiry deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteEnquiry error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
