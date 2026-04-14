import mongoose from "mongoose";

export interface IOfferLetter extends mongoose.Document {
  regNo: string;
  issueDate: Date;
  candidateName: string;
  location: string;
  position: string;
  joiningDate: Date;
  salaryPackage: string;
  headerImagePath: string;
  footerImagePath: string;
  logoPath: string;
  signaturePath: string;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  hrName: string;
  hrTitle: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfferLetterSchema = new mongoose.Schema<IOfferLetter>(
  {
    regNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 60,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    salaryPackage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    headerImagePath: {
      type: String,
      trim: true,
      default: "/letters/offer-letter-top.png",
      maxlength: 200,
    },
    footerImagePath: {
      type: String,
      trim: true,
      default: "/letters/offer-letter-bottom.png",
      maxlength: 200,
    },
    logoPath: {
      type: String,
      trim: true,
      default: "/letters/logo.png",
      maxlength: 200,
    },
    signaturePath: {
      type: String,
      trim: true,
      default: "/letters/signature.png",
      maxlength: 200,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "+91-7411-2111-48",
      maxlength: 40,
    },
    contactEmail: {
      type: String,
      trim: true,
      default: "contact@rexgalaxy.com",
      maxlength: 120,
    },
    officeAddress: {
      type: String,
      trim: true,
      default: "A 40, Ithum Tower A, 6th Floor, 606, Noida, Uttar Pradesh 201301",
      maxlength: 300,
    },
    hrName: {
      type: String,
      trim: true,
      default: "Aman Dubey",
      maxlength: 120,
    },
    hrTitle: {
      type: String,
      trim: true,
      default: "HR Manager",
      maxlength: 120,
    },
    createdBy: {
      type: String,
      trim: true,
      maxlength: 120,
    },
  },
  { timestamps: true }
);

OfferLetterSchema.index({ regNo: 1 }, { unique: true });
OfferLetterSchema.index({ createdAt: -1 });
OfferLetterSchema.index({ candidateName: 1 });
OfferLetterSchema.index({ position: 1 });

export const OfferLetter = mongoose.model<IOfferLetter>(
  "OfferLetter",
  OfferLetterSchema
);
