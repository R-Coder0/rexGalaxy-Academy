/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  InputHTMLAttributes,
} from "react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  Eye,
  FilePlus2,
  Printer,
  RefreshCcw,
  ScrollText,
  Trash2,
} from "lucide-react";

type OfferLetter = {
  _id: string;
  regNo: string;
  issueDate: string;
  candidateName: string;
  location: string;
  position: string;
  joiningDate: string;
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
  createdAt: string;
};

type OfferLetterForm = {
  regNo: string;
  issueDate: string;
  candidateName: string;
  location: string;
  position: string;
  joiningDate: string;
  salaryPackage: string;
  headerImagePath: string;
  footerImagePath: string;
  logoPath: string;
  signaturePath: string;
};

type FormErrors = Partial<Record<keyof OfferLetterForm, string>>;

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialForm: OfferLetterForm = {
  regNo: "",
  issueDate: "",
  candidateName: "",
  location: "",
  position: "",
  joiningDate: "",
  salaryPackage: "",
  headerImagePath: "/letters/offer-letter-top.png",
  footerImagePath: "/letters/bottom.png",
  logoPath: "/letters/logo.jpeg",
  signaturePath: "/letters/sign.png",
};

const cardStyle: CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
  boxShadow: "var(--shadow-sm)",
};

function formatLongDate(value: string) {
  if (!value) return "DD/MM/YYYY";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatReadableDate(value: string) {
  if (!value) return "Joining Date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildPreview(form: OfferLetterForm) {
  return {
    ...form,
    hrName: "Aman Dubey",
    hrTitle: "HR Manager",
    contactPhone: "+91-7411-2111-48",
    contactEmail: "contact@rexgalaxy.com",
    officeAddress: "A 40, Ithum Tower A, 6th Floor, 606, Noida, Uttar Pradesh 201301",
  };
}

function normalizeLetter(letter: Partial<OfferLetter> | ReturnType<typeof buildPreview>) {
  return {
    regNo: letter.regNo || "RGT/INT/2026/1006",
    issueDate: letter.issueDate || "",
    candidateName: letter.candidateName || "Candidate Name",
    location: letter.location || "Location",
    position: letter.position || "Position",
    joiningDate: letter.joiningDate || "",
    salaryPackage: letter.salaryPackage || "9,60,000",
    headerImagePath: letter.headerImagePath || "/letters/offer-letter-top.png",
    footerImagePath: letter.footerImagePath || "/letters/bottom.png",
    logoPath: letter.logoPath || "/letters/logo.jpeg",
    signaturePath: letter.signaturePath || "/letters/sign.png",
    contactPhone: letter.contactPhone || "+91-7411-2111-48",
    contactEmail: letter.contactEmail || "contact@rexgalaxy.com",
    officeAddress:
      letter.officeAddress ||
      "A 40, Ithum Tower A, 6th Floor, 606, Noida, Uttar Pradesh 201301",
    hrName: letter.hrName || "Aman Dubey",
    hrTitle: letter.hrTitle || "HR Manager",
  };
}

function getDownloadFileName(letter: ReturnType<typeof normalizeLetter>) {
  return `${letter.candidateName.toLowerCase().replace(/\s+/g, "-") || "offer-letter"}-${letter.regNo
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.html`;
}

function toAbsoluteAssetUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

export default function AdminOfferLetterPage() {
  const [form, setForm] = useState<OfferLetterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [items, setItems] = useState<OfferLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<OfferLetter | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);

  const preview = useMemo(() => buildPreview(form), [form]);
  const activePreview = useMemo(
    () => normalizeLetter(selected ?? preview),
    [selected, preview]
  );

  const fetchLetters = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/offer-letters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message || "Failed to load offer letters.");
        setLoading(false);
        return;
      }

      setItems(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Server not reachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.regNo.trim()) nextErrors.regNo = "Registration number is required";
    if (!form.issueDate) nextErrors.issueDate = "Issue date is required";
    if (!form.candidateName.trim()) {
      nextErrors.candidateName = "Candidate name is required";
    }
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.position.trim()) nextErrors.position = "Position is required";
    if (!form.joiningDate) nextErrors.joiningDate = "Joining date is required";
    if (!form.salaryPackage.trim()) {
      nextErrors.salaryPackage = "Salary package is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof OfferLetterForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (message) setMessage(null);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/offer-letters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to create offer letter.");
      }

      setMessage("Offer letter created successfully.");
      setItems((prev) => [data.data, ...prev]);
      setSelected(data.data);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create offer letter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const focusPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePreviewSelect = (item: OfferLetter) => {
    setSelected(item);
    focusPreview();
  };

  const handlePreviewCurrentForm = () => {
    setSelected(null);
    focusPreview();
  };

  const handleDownload = async () => {
    if (!letterRef.current) {
      alert("Preview is not ready yet.");
      return;
    }

    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const scale = Math.min(widthRatio, heightRatio);
      const imageWidth = canvas.width * scale;
      const imageHeight = canvas.height * scale;
      const x = (pageWidth - imageWidth) / 2;
      const y = (pageHeight - imageHeight) / 2;

      pdf.addImage(imageData, "PNG", x, y, imageWidth, imageHeight);

      pdf.save(getDownloadFileName(activePreview).replace(/\.html$/i, ".pdf"));
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=1000,height=1400");
    if (!printWindow) {
      alert("Please allow popups to print the offer letter.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildLetterHtml(activePreview, true));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer letter?")) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/offer-letters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        alert(data?.message || "Failed to delete offer letter.");
        return;
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
      setSelected((prev) => (prev?._id === id ? null : prev));
    } catch {
      alert("Server not reachable. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className="badge badge-brand"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              Admin
            </span>
            <h1
              className="mt-3 text-2xl"
              style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}
            >
              Offer Letters
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Create offer letters from the admin panel and keep a record of all issued letters.
            </p>
          </div>

          <button onClick={fetchLetters} className="btn btn-outline btn-md">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
        <div
          className="rounded-2xl p-6 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto"
          style={cardStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
            >
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                Create Letter
              </h2>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                Fill only the variable details. The letter content stays fixed.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Field
              label="Reg No."
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              placeholder="RGT/INT/2026/1006"
              error={errors.regNo}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date of Issue"
                name="issueDate"
                type="date"
                value={form.issueDate}
                onChange={handleChange}
                error={errors.issueDate}
              />
              <Field
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                error={errors.joiningDate}
              />
            </div>

            <Field
              label="Candidate Name"
              name="candidateName"
              value={form.candidateName}
              onChange={handleChange}
              placeholder="Kanika Marwaha"
              error={errors.candidateName}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Greater Noida West"
                error={errors.location}
              />
              <Field
                label="Position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Data Analyst"
                error={errors.position}
              />
            </div>

            <Field
              label="Salary Package"
              name="salaryPackage"
              value={form.salaryPackage}
              onChange={handleChange}
              placeholder="9,60,000 per annum"
              error={errors.salaryPackage}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Top Design Path"
                name="headerImagePath"
                value={form.headerImagePath}
                onChange={handleChange}
                placeholder="/letters/offer-letter-top.png"
              />
              <Field
                label="Bottom Design Path"
                name="footerImagePath"
                value={form.footerImagePath}
                onChange={handleChange}
                placeholder="/letters/offer-letter-bottom.png"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Logo Path"
                name="logoPath"
                value={form.logoPath}
                onChange={handleChange}
                placeholder="/letters/logo.png"
              />
              <Field
                label="Signature Path"
                name="signaturePath"
                value={form.signaturePath}
                onChange={handleChange}
                placeholder="/letters/signature.png"
              />
            </div>

            {message ? (
              <div className="rounded-xl px-4 py-3 text-sm" style={{
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#6ee7b7",
              }}>
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl px-4 py-3 text-sm" style={{
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
              }}>
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={submitting} className="btn btn-primary btn-md w-full">
              {submitting ? "Creating..." : "Create Offer Letter"}
            </button>
          </form>
        </div>

        <div className="min-w-0 space-y-6">
          <div ref={previewRef} className="rounded-2xl p-6" style={cardStyle}>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
              >
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  Live Preview
                </h2>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {selected
                    ? `Previewing saved letter for ${selected.candidateName}.`
                    : "Previewing the current form data before saving."}
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handlePreviewCurrentForm}
              >
                <Eye className="h-4 w-4" />
                Current Form Preview
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>

            <LetterPreview ref={letterRef} letter={activePreview} />
          </div>

          <div className="rounded-2xl" style={cardStyle}>
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  Saved Offer Letters
                </h2>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {loading ? "Loading..." : `${items.length} records available`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                Loading offer letters...
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                No offer letters created yet.
              </div>
            ) : (
              <div>
                {items.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between"
                    style={{
                      borderBottom: index < items.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          {item.candidateName}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            background: "var(--brand-soft)",
                            border: "1px solid rgba(255,107,0,0.22)",
                            color: "var(--brand)",
                          }}
                        >
                          {item.regNo}
                        </span>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
                        {item.position} • {item.location} • Joining {formatReadableDate(item.joiningDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handlePreviewSelect(item)}
                      >
                        <ScrollText className="h-4 w-4" />
                        Preview
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.22)",
                          color: "rgba(239,68,68,0.88)",
                        }}
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: "var(--surface-2)",
          border: `1px solid ${error ? "rgba(239,68,68,0.35)" : "var(--border-strong)"}`,
          color: "var(--text)",
        }}
      />
      {error ? (
        <p className="mt-2 text-xs" style={{ color: "#fca5a5" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

const LetterPreview = forwardRef<
  HTMLDivElement,
  {
    letter: ReturnType<typeof normalizeLetter>;
  }
>(function LetterPreview({ letter }, ref) {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #d6dcef",
        color: "#16327c",
        aspectRatio: "210 / 297",
      }}
    >
      <img
        src={letter.headerImagePath}
        alt="Offer letter header"
        className="absolute left-0 top-0 h-[72px] w-full object-cover"
      />

      <img
        src={letter.footerImagePath}
        alt="Offer letter footer"
        className="absolute bottom-0 left-0 h-[78px] w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-[78px] top-[72px] px-6 pb-5 pt-5">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[240px]">
              <img
                src={letter.logoPath}
                alt="RexGalaxy"
                className="h-18 w-auto object-contain"
              />
            </div>

            <div
              className="max-w-[270px] text-right text-[11px] leading-[1.5]"
              style={{ color: "#24448f" }}
            >
              <p style={{ color: "#24448f" }}>{letter.contactPhone}</p>
              <p style={{ color: "#24448f" }}>{letter.contactEmail}</p>
              <p style={{ color: "#24448f" }}>{letter.officeAddress}</p>
            </div>
          </div>

          <div
            className="mt-8 flex items-start justify-between gap-6 text-[11px] font-semibold"
            style={{ color: "#173982" }}
          >
            <div className="max-w-[52%]">
              <p style={{ color: "#173982" }}>TO,</p>
              <p className="mt-1 text-[15px] font-bold uppercase" style={{ color: "#173982" }}>
                {letter.candidateName}
              </p>
              <p className="mt-1 text-[11px] font-medium italic" style={{ color: "#3a4f87" }}>
                {letter.location}
              </p>
            </div>

            <div className="text-right leading-[1.55]" style={{ color: "#173982" }}>
              <p style={{ color: "#173982" }}>Ref No.: {letter.regNo}</p>
              <p style={{ color: "#173982" }}>Date of Issue: {formatLongDate(letter.issueDate)}</p>
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-4 text-[11.5px] leading-[1.55]" style={{ color: "#26407b" }}>
            <div>
              <p className="font-bold italic" style={{ color: "#173982" }}>
                Subject: Offer of Employment
              </p>
              <p className="mt-1.5" style={{ color: "#26407b" }}>
                We are pleased to offer you the position of <strong>{letter.position}</strong> at{" "}
                <strong>RexGalaxy Technology</strong>. Based on your qualifications, experience,
                and interaction with our team, we are confident that you will make a valuable
                contribution to the organization.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>1. Date of Joining</p>
              <p style={{ color: "#26407b" }}>
                You are requested to join on or before <strong>{formatReadableDate(letter.joiningDate)}</strong>{" "}
                at our <strong>{letter.location}</strong> office. Kindly report to the HR department on
                the date of joining for completion of onboarding formalities.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>2. Compensation</p>
              <p style={{ color: "#26407b" }}>
                Your Cost to Company (CTC) will be <strong>Rs. {letter.salaryPackage}</strong> per annum.
                This amount is inclusive of salary components, allowances, and other applicable
                benefits, and will be governed by company policy and statutory deductions.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>3. Probation Period</p>
              <p style={{ color: "#26407b" }}>
                You will be on probation for a period of 3 months from your date of joining.
                Confirmation of employment will be subject to satisfactory performance,
                professional conduct, and compliance with company policies during this period.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>4. Document Submission Requirement</p>
              <ol className="ml-4 mt-1 list-decimal space-y-0.5" style={{ color: "#26407b" }}>
                <li style={{ color: "#26407b" }}>Proof of identity (Aadhaar Card, Passport, or PAN Card)</li>
                <li style={{ color: "#26407b" }}>Address proof</li>
                <li style={{ color: "#26407b" }}>Educational certificates and mark sheets</li>
                <li style={{ color: "#26407b" }}>Previous employment documents, if applicable</li>
                <li style={{ color: "#26407b" }}>Recent salary slips, if applicable</li>
                <li style={{ color: "#26407b" }}>Two passport-size photographs</li>
              </ol>
              <p className="mt-1.5" style={{ color: "#26407b" }}>
                Failure to provide valid and authentic documents may result in withdrawal of this
                offer or cancellation of employment.
              </p>
            </div>
          </div>

          <div className="mt-4 text-[11px]" style={{ color: "#26407b" }}>
            <p className="font-semibold" style={{ color: "#173982" }}>{letter.hrName}</p>
            <p style={{ color: "#26407b" }}>{letter.hrTitle}</p>
            <img
              src={letter.signaturePath}
              alt="Signature"
              className="mt-2 h-20 w-auto object-contain"
            />
            <p className="mt-1.5" style={{ color: "#26407b" }}>{letter.contactEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

function buildLetterHtml(
  letter: ReturnType<typeof normalizeLetter>,
  autoPrint = false
) {
  const headerImagePath = toAbsoluteAssetUrl(letter.headerImagePath);
  const footerImagePath = toAbsoluteAssetUrl(letter.footerImagePath);
  const logoPath = toAbsoluteAssetUrl(letter.logoPath);
  const signaturePath = toAbsoluteAssetUrl(letter.signaturePath);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Offer Letter - ${letter.candidateName}</title>
  <style>
    body {
      margin: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #20356d;
    }
    .page {
      width: 794px;
      margin: 12px auto;
      background: #fff;
      border: 1px solid #d6dcef;
      overflow: hidden;
      position: relative;
      height: 1123px;
    }
    .asset-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 72px;
      display: block;
      object-fit: cover;
    }
    .asset-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 78px;
      display: block;
      object-fit: cover;
    }
    .inner {
      position: absolute;
      inset: 72px 0 78px 0;
      padding: 18px 26px 20px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-start;
    }
    .top-right {
      max-width: 280px;
      text-align: right;
      line-height: 1.5;
      color: #16327c;
      font-size: 11px;
    }
    .meta {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      color: #16327c;
      font-size: 11px;
      font-weight: 600;
    }
    .candidate {
      max-width: 52%;
    }
    .candidate-name {
      margin-top: 6px;
      font-size: 21px;
      font-weight: 700;
      text-transform: uppercase;
      color: #173982;
    }
    .candidate-location {
      margin-top: 4px;
      font-style: italic;
      color: #3a4f87;
    }
    .meta-right {
      text-align: right;
      line-height: 1.55;
    }
    .content {
      flex: 1;
    }
    .title {
      font-style: italic;
      font-weight: 700;
      color: #16327c;
    }
    .section {
      margin-top: 14px;
      font-size: 11.5px;
      line-height: 1.55;
      color: #20356d;
    }
    .section b {
      color: #16327c;
    }
    ol {
      margin-top: 5px;
      margin-bottom: 0;
      padding-left: 18px;
    }
    .sign {
      margin-top: auto;
      padding-top: 16px;
      font-size: 11px;
    }
    .logo {
      height: 56px;
      width: auto;
      object-fit: contain;
    }
    .signature {
      margin-top: 6px;
      height: 50px;
      width: auto;
      object-fit: contain;
    }
    @media print {
      body {
        background: #fff;
      }
      .page {
        margin: 0 auto;
        border: none;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <img class="asset-top" src="${headerImagePath}" alt="Header" />
    <img class="asset-bottom" src="${footerImagePath}" alt="Footer" />
    <div class="inner">
      <div class="row">
        <div>
          <img class="logo" src="${logoPath}" alt="Logo" />
        </div>
        <div class="top-right">
          <div>${letter.contactPhone}</div>
          <div>${letter.contactEmail}</div>
          <div>${letter.officeAddress}</div>
        </div>
      </div>

      <div class="meta">
        <div class="candidate">
          <div>TO,</div>
          <div class="candidate-name">${letter.candidateName}</div>
          <div class="candidate-location">${letter.location}</div>
        </div>
        <div class="meta-right">
          <div>Ref No.: ${letter.regNo}</div>
          <div>Date of Issue: ${formatLongDate(letter.issueDate)}</div>
        </div>
      </div>

      <div class="content">
        <div class="section">
          <div class="title">Subject: Offer of Employment</div>
          <div style="margin-top: 6px;">
            We are pleased to offer you the position of <b>${letter.position}</b> at <b>RexGalaxy Technology</b>. Based on your qualifications, experience, and interaction with our team, we are confident that you will make a valuable contribution to the organization.
          </div>
        </div>

        <div class="section">
          <b>1. Date of Joining</b>
          <div>You are requested to join on or before <b>${formatReadableDate(letter.joiningDate)}</b> at our <b>${letter.location}</b> office. Kindly report to the HR department on the date of joining for completion of onboarding formalities.</div>
        </div>

        <div class="section">
          <b>2. Compensation</b>
          <div>Your Cost to Company (CTC) will be <b>Rs. ${letter.salaryPackage}</b> per annum. This amount is inclusive of salary components, allowances, and other applicable benefits, and will be governed by company policy and statutory deductions.</div>
        </div>

        <div class="section">
          <b>3. Probation Period</b>
          <div>You will be on probation for a period of 3 months from your date of joining. Confirmation of employment will be subject to satisfactory performance, professional conduct, and compliance with company policies during this period.</div>
        </div>

        <div class="section">
          <b>4. Document Submission Requirement</b>
          <ol>
            <li>Proof of identity (Aadhaar Card, Passport, or PAN Card)</li>
            <li>Address proof</li>
            <li>Educational certificates and mark sheets</li>
            <li>Previous employment documents, if applicable</li>
            <li>Recent salary slips, if applicable</li>
            <li>Two passport-size photographs</li>
          </ol>
          <div>Failure to provide valid and authentic documents may result in withdrawal of this offer or cancellation of employment.</div>
        </div>
      </div>

      <div class="sign">
        <div style="font-weight: 700; color: #16327c;">${letter.hrName}</div>
        <div>${letter.hrTitle}</div>
        <img class="signature" src="${signaturePath}" alt="Signature" />
        <div style="margin-top: 8px;">${letter.contactEmail}</div>
      </div>
    </div>
  </div>
  ${autoPrint ? "<script>window.onload = function(){ window.print(); };</script>" : ""}
</body>
</html>`;
}
