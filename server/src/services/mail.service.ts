import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import path from "path";
import fs from "fs";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP env missing (SMTP_HOST/SMTP_USER/SMTP_PASS).");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEnquiryMail(params: {
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
  attachmentPath?: string;
  attachmentName?: string;
  attachmentMime?: string;
}) {
  const transporter = getTransport();

  const to = process.env.ENQUIRY_ADMIN_EMAIL;
  if (!to) throw new Error("ENQUIRY_ADMIN_EMAIL missing in env.");

  const fromName = process.env.MAIL_FROM_NAME || "NESF Website";
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER!;
  const from = `${fromName} <${fromEmail}>`;

  const safeName = escapeHtml(params.fullName);
  const safeCompany = params.company ? escapeHtml(params.company) : "";
  const safePhone = escapeHtml(params.phone);
  const safeEmail = params.email ? escapeHtml(params.email) : "";
  const safeMessage = escapeHtml(params.message).replace(/\n/g, "<br/>");

  const subject = `New Enquiry — ${params.fullName}${params.company ? ` (${params.company})` : ""}`;

  const html = `
  <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
      
      <div style="padding:18px 20px;background:#0b5fff;color:#ffffff;">
        <div style="font-size:18px;font-weight:700;line-height:1.2;">New Website Enquiry</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px;">NESF Contact Form</div>
      </div>

      <div style="padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eef0f2;width:140px;color:#667085;font-size:13px;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;font-weight:600;">${safeName}</td>
          </tr>

          ${
            params.company
              ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f2;width:140px;color:#667085;font-size:13px;">Company</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safeCompany}</td>
                </tr>`
              : ""
          }

          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eef0f2;width:140px;color:#667085;font-size:13px;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safePhone}</td>
          </tr>

          ${
            params.email
              ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f2;width:140px;color:#667085;font-size:13px;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">
                    <a href="mailto:${safeEmail}" style="color:#0b5fff;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>`
              : ""
          }
        </table>

        <div style="margin-top:16px;">
          <div style="font-size:13px;color:#667085;margin-bottom:8px;">Message</div>
          <div style="background:#f9fafb;border:1px solid #eef0f2;border-radius:10px;padding:14px;color:#101828;font-size:14px;line-height:1.6;">
            ${safeMessage}
          </div>
        </div>

        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #eef0f2;color:#98a2b3;font-size:12px;">
          Sent from NESF website enquiry form.
        </div>
      </div>
    </div>
  </div>
  `;

  const attachments: SendMailOptions["attachments"] = [];

  if (params.attachmentPath && fs.existsSync(params.attachmentPath)) {
    attachments.push({
      filename: params.attachmentName || path.basename(params.attachmentPath),
      path: params.attachmentPath,
      contentType: params.attachmentMime,
    });
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    replyTo: params.email || undefined,
    attachments: attachments.length ? attachments : undefined,
  });
}
