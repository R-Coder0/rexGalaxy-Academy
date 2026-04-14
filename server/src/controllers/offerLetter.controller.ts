import { Request, Response } from "express";
import mongoose from "mongoose";
import { OfferLetter } from "../models/OfferLetter.model";

function isValidDate(value: string) {
  return !Number.isNaN(new Date(value).getTime());
}

export const createOfferLetter = async (req: Request, res: Response) => {
  try {
    const regNo = String(req.body.regNo || "").trim();
    const issueDate = String(req.body.issueDate || "").trim();
    const candidateName = String(req.body.candidateName || "").trim();
    const location = String(req.body.location || "").trim();
    const position = String(req.body.position || "").trim();
    const joiningDate = String(req.body.joiningDate || "").trim();
    const salaryPackage = String(req.body.salaryPackage || "").trim();

    const headerImagePath =
      String(req.body.headerImagePath || "").trim() || "/letters/offer-letter-top.png";
    const footerImagePath =
      String(req.body.footerImagePath || "").trim() || "/letters/offer-letter-bottom.png";
    const logoPath = String(req.body.logoPath || "").trim() || "/letters/logo.png";
    const signaturePath =
      String(req.body.signaturePath || "").trim() || "/letters/signature.png";

    if (
      !regNo ||
      !issueDate ||
      !candidateName ||
      !location ||
      !position ||
      !joiningDate ||
      !salaryPackage
    ) {
      return res.status(400).json({
        success: false,
        message: "Reg no, issue date, candidate name, location, position, joining date and salary package are required.",
      });
    }

    if (!isValidDate(issueDate) || !isValidDate(joiningDate)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid issue date and joining date.",
      });
    }

    const existing = await OfferLetter.exists({ regNo });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An offer letter with this registration number already exists.",
      });
    }

    const adminEmail =
      typeof (req as Request & { admin?: { email?: string } }).admin?.email === "string"
        ? (req as Request & { admin?: { email?: string } }).admin?.email
        : undefined;

    const letter = await OfferLetter.create({
      regNo,
      issueDate: new Date(issueDate),
      candidateName,
      location,
      position,
      joiningDate: new Date(joiningDate),
      salaryPackage,
      headerImagePath,
      footerImagePath,
      logoPath,
      signaturePath,
      createdBy: adminEmail,
    });

    return res.status(201).json({
      success: true,
      message: "Offer letter created successfully.",
      data: letter,
    });
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your inputs.",
      });
    }

    console.error("createOfferLetter error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const listOfferLetters = async (_req: Request, res: Response) => {
  try {
    const items = await OfferLetter.find().sort({ createdAt: -1 }).limit(300);

    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("listOfferLetters error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const deleteOfferLetter = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer letter id.",
      });
    }

    const deleted = await OfferLetter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Offer letter not found.",
      });
    }

    return res.json({
      success: true,
      message: "Offer letter deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteOfferLetter error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
