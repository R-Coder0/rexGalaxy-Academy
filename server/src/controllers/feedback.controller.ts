import { Request, Response } from "express";
import mongoose from "mongoose";
import { Feedback } from "../models/Feedback.model";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const organization = String(req.body.organization || "").trim();
    const message = String(req.body.message || "").trim();

    if (!fullName || !email || !organization || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // basic email check
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const doc = await Feedback.create({
      fullName,
      email,
      organization,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: { id: doc._id },
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      const firstKey = Object.keys(err.errors || {})[0];
      const firstError = firstKey ? err.errors[firstKey] : null;

      let msg = "Validation failed. Please check your inputs.";

      if (firstError?.path === "message" && firstError?.kind === "minlength") {
        msg = "Message must be at least 5 characters.";
      } else if (
        firstError?.path === "fullName" &&
        firstError?.kind === "minlength"
      ) {
        msg = "Full Name is too short.";
      } else if (
        firstError?.path === "organization" &&
        firstError?.kind === "minlength"
      ) {
        msg = "Feedback / Suggestion is too short.";
      }

      return res.status(400).json({
        success: false,
        message: msg,
      });
    }

    console.error("createFeedback error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// (Admin) list feedback — latest first
export const listFeedback = async (_req: Request, res: Response) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 }).limit(200);
    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("listFeedback error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ✅ (Admin) delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    // ✅ IMPORTANT: force string (fix TS error)
    const id = String(req.params.id || "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback id.",
      });
    }

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    return res.json({
      success: true,
      message: "Feedback deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteFeedback error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
