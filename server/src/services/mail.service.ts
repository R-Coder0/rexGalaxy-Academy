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
  course?: string;
  source?: string;
  branch?: string;
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

  const fromName = process.env.MAIL_FROM_NAME || "RexGalaxy Academy";
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER!;
  const from = `${fromName} <${fromEmail}>`;

  const safeName = escapeHtml(params.fullName);
  const safeCompany = params.company ? escapeHtml(params.company) : "";
  const safeCourse = params.course ? escapeHtml(params.course) : "";
  const safeSource = params.source ? escapeHtml(params.source) : "";
  const safeBranch = params.branch ? escapeHtml(params.branch) : "";
  const safePhone = escapeHtml(params.phone);
  const safeEmail = params.email ? escapeHtml(params.email) : "";
  const safeMessage = escapeHtml(params.message).replace(/\n/g, "<br/>");

  const subjectTag = params.course || params.company || params.source;
  const subject = `New Enquiry - ${params.fullName}${subjectTag ? ` (${subjectTag})` : ""}`;

  const rows = [
    {
      label: "Name",
      valueHtml: `<span style="font-weight:600;">${safeName}</span>`,
    },
    params.company
      ? {
          label: "Company",
          valueHtml: safeCompany,
        }
      : null,
    params.course
      ? {
          label: "Course",
          valueHtml: safeCourse,
        }
      : null,
    params.branch
      ? {
          label: "Branch",
          valueHtml: safeBranch,
        }
      : null,
    {
      label: "Phone",
      valueHtml: safePhone,
    },
    params.email
      ? {
          label: "Email",
          valueHtml: `<a href="mailto:${safeEmail}" style="color:#0b5fff;text-decoration:none;">${safeEmail}</a>`,
        }
      : null,
    params.source
      ? {
          label: "Source",
          valueHtml: safeSource,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; valueHtml: string }>;

  const detailsTable = rows
    .map(
      (row, index) => `<tr>
        <td style="padding:10px 0;${index < rows.length - 1 ? "border-bottom:1px solid #eef0f2;" : ""}width:140px;color:#667085;font-size:13px;">${row.label}</td>
        <td style="padding:10px 0;${index < rows.length - 1 ? "border-bottom:1px solid #eef0f2;" : ""}color:#101828;font-size:14px;">${row.valueHtml}</td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
      <div style="padding:18px 20px;background:#0b5fff;color:#ffffff;">
        <div style="font-size:18px;font-weight:700;line-height:1.2;">New Website Enquiry</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px;">RexGalaxy Academy</div>
      </div>

      <div style="padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          ${detailsTable}
        </table>

        <div style="margin-top:16px;">
          <div style="font-size:13px;color:#667085;margin-bottom:8px;">Message</div>
          <div style="background:#f9fafb;border:1px solid #eef0f2;border-radius:10px;padding:14px;color:#101828;font-size:14px;line-height:1.6;">
            ${safeMessage}
          </div>
        </div>

        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #eef0f2;color:#98a2b3;font-size:12px;">
          Sent from RexGalaxy Academy website enquiry form.
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

export async function sendRegistrationMails(params: {
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
}) {
  const transporter = getTransport();

  const adminTo =
    process.env.REGISTRATION_ADMIN_EMAIL ||
    process.env.ENQUIRY_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL;

  if (!adminTo) {
    throw new Error(
      "REGISTRATION_ADMIN_EMAIL or ENQUIRY_ADMIN_EMAIL or ADMIN_EMAIL missing in env."
    );
  }

  const fromName = process.env.MAIL_FROM_NAME || "Rex Galaxy Academy";
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER!;
  const from = `${fromName} <${fromEmail}>`;

  const safeCode = escapeHtml(params.registrationCode);
  const safeName = escapeHtml(params.fullName);
  const safeEmail = escapeHtml(params.email);
  const safePhone = escapeHtml(params.phone);
  const safeCourse = escapeHtml(params.course);
  const safeAddress = escapeHtml(params.address);
  const safeCity = escapeHtml(params.city);
  const safeCountry = escapeHtml(params.country);
  const safeZipcode = escapeHtml(params.zipcode);

  const adminHtml = `
  <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
      <div style="padding:18px 20px;background:#101828;color:#ffffff;">
        <div style="font-size:18px;font-weight:700;">New Online Registration</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px;">Registration Code: ${safeCode}</div>
      </div>
      <div style="padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;width:150px;color:#667085;font-size:13px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;font-weight:600;">${safeName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#0b5fff;text-decoration:none;">${safeEmail}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safePhone}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">Course</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safeCourse}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">Address</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safeAddress}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">City</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safeCity}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#667085;font-size:13px;">Country</td><td style="padding:10px 0;border-bottom:1px solid #eef0f2;color:#101828;font-size:14px;">${safeCountry}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;font-size:13px;">Zipcode</td><td style="padding:10px 0;color:#101828;font-size:14px;">${safeZipcode}</td></tr>
        </table>
      </div>
    </div>
  </div>
  `;

  const userHtml = `
  <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
      <div style="padding:18px 20px;background:#ff6b00;color:#101828;">
        <div style="font-size:18px;font-weight:700;">Registration Submitted Successfully</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px;">Rex Galaxy Academy</div>
      </div>
      <div style="padding:20px;color:#101828;">
        <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Hello ${safeName},</p>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Thank you for submitting your online registration. Please keep your registration code for future communication.</p>
        <div style="margin:18px 0;padding:16px;border:1px solid #fed7aa;background:#fff7ed;border-radius:10px;">
          <div style="font-size:12px;color:#9a3412;margin-bottom:6px;">Registration Code</div>
          <div style="font-size:24px;font-weight:700;letter-spacing:1px;color:#c2410c;">${safeCode}</div>
        </div>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;">Registered Course: <strong>${safeCourse}</strong></p>
        <p style="margin:0;font-size:14px;line-height:1.6;">Our admissions team will contact you shortly.</p>
      </div>
    </div>
  </div>
  `;

  await Promise.all([
    transporter.sendMail({
      from,
      to: adminTo,
      subject: `New Registration - ${params.registrationCode}`,
      html: adminHtml,
      replyTo: params.email,
    }),
    transporter.sendMail({
      from,
      to: params.email,
      subject: `Your Registration Code - ${params.registrationCode}`,
      html: userHtml,
    }),
  ]);
}
