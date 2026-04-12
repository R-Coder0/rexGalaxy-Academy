import mongoose from "mongoose";

export type EnquiryAttachment = {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string; // server path
};

export interface IEnquiry extends mongoose.Document {
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
  attachment?: EnquiryAttachment | null;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new mongoose.Schema<EnquiryAttachment>(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
  },
  { _id: false }
);

const EnquirySchema = new mongoose.Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    company: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, minlength: 7, maxlength: 25 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 1, maxlength: 3000 },
    attachment: { type: AttachmentSchema, default: null },
  },
  { timestamps: true }
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ phone: 1 });
EnquirySchema.index({ email: 1 });

export const Enquiry = mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
