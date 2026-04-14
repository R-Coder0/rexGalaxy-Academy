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
  FileBadge2,
  Printer,
  RefreshCcw,
  ScrollText,
  Trash2,
} from "lucide-react";

type ExperienceLetter = {
  _id: string;
  regNo: string;
  issueDate: string;
  candidateName: string;
  location: string;
  position: string;
  experienceDuration: string;
  experienceFrom: string;
  experienceTo: string;
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

type ExperienceLetterForm = {
  regNo: string;
  issueDate: string;
  candidateName: string;
  location: string;
  position: string;
  experienceDuration: string;
  experienceFrom: string;
  experienceTo: string;
  headerImagePath: string;
  footerImagePath: string;
  logoPath: string;
  signaturePath: string;
};

type FormErrors = Partial<Record<keyof ExperienceLetterForm, string>>;

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialForm: ExperienceLetterForm = {
  regNo: "",
  issueDate: "",
  candidateName: "",
  location: "",
  position: "",
  experienceDuration: "",
  experienceFrom: "",
  experienceTo: "",
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
  if (!value) return "Date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildPreview(form: ExperienceLetterForm) {
  return {
    ...form,
    hrName: "Aman Dubey",
    hrTitle: "HR Manager",
    contactPhone: "+91-7411-2111-48",
    contactEmail: "contact@rexgalaxy.com",
    officeAddress:
      "A 40, Ithum Tower A, 6th Floor, 606, Noida, Uttar Pradesh 201301",
  };
}

function normalizeLetter(
  letter: Partial<ExperienceLetter> | ReturnType<typeof buildPreview>
) {
  return {
    regNo: letter.regNo || "RGT/EXP/2026/1006",
    issueDate: letter.issueDate || "",
    candidateName: letter.candidateName || "Candidate Name",
    location: letter.location || "Noida",
    position: letter.position || "Software Engineer",
    experienceDuration: letter.experienceDuration || "1 Year 6 Months",
    experienceFrom: letter.experienceFrom || "",
    experienceTo: letter.experienceTo || "",
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
  return `${letter.candidateName.toLowerCase().replace(/\s+/g, "-") || "experience-letter"}-${letter.regNo
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.pdf`;
}

export default function AdminExperienceLetterPage() {
  const [form, setForm] = useState<ExperienceLetterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [items, setItems] = useState<ExperienceLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<ExperienceLetter | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);

  const preview = useMemo(() => buildPreview(form), [form]);
  const activePreview = useMemo(
    () => normalizeLetter(selected ?? preview),
    [preview, selected]
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

      const res = await fetch(`${API}/experience-letters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message || "Failed to load experience letters.");
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
    if (!form.candidateName.trim()) nextErrors.candidateName = "Candidate name is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.position.trim()) nextErrors.position = "Position is required";
    if (!form.experienceDuration.trim()) {
      nextErrors.experienceDuration = "Experience duration is required";
    }
    if (!form.experienceFrom) nextErrors.experienceFrom = "From date is required";
    if (!form.experienceTo) nextErrors.experienceTo = "To date is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ExperienceLetterForm]) {
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

      const res = await fetch(`${API}/experience-letters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to create experience letter.");
      }

      setMessage("Experience letter created successfully.");
      setItems((prev) => [data.data, ...prev]);
      setSelected(data.data);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create experience letter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const focusPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePreviewSelect = (item: ExperienceLetter) => {
    setSelected(item);
    focusPreview();
  };

  const handlePreviewCurrentForm = () => {
    setSelected(null);
    focusPreview();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience letter?")) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/experience-letters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        alert(data?.message || "Failed to delete experience letter.");
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
      pdf.save(getDownloadFileName(activePreview));
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
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
              Experience Letters
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Create and manage experience letters with the same signed company format.
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
              <FileBadge2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                Create Letter
              </h2>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                Fill employee details and issue a professional experience letter.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Field label="Reg No." name="regNo" value={form.regNo} onChange={handleChange} error={errors.regNo} placeholder="RGT/EXP/2026/1006" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of Issue" name="issueDate" type="date" value={form.issueDate} onChange={handleChange} error={errors.issueDate} />
              <Field label="Candidate Name" name="candidateName" value={form.candidateName} onChange={handleChange} error={errors.candidateName} placeholder="Rishabh Pratap" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="Noida" />
              <Field label="Position" name="position" value={form.position} onChange={handleChange} error={errors.position} placeholder="SDE III" />
            </div>

            <Field label="Experience Duration" name="experienceDuration" value={form.experienceDuration} onChange={handleChange} error={errors.experienceDuration} placeholder="1 Year 8 Months" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Experience From" name="experienceFrom" type="date" value={form.experienceFrom} onChange={handleChange} error={errors.experienceFrom} />
              <Field label="Experience To" name="experienceTo" type="date" value={form.experienceTo} onChange={handleChange} error={errors.experienceTo} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Top Design Path" name="headerImagePath" value={form.headerImagePath} onChange={handleChange} placeholder="/letters/offer-letter-top.png" />
              <Field label="Bottom Design Path" name="footerImagePath" value={form.footerImagePath} onChange={handleChange} placeholder="/letters/bottom.png" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Logo Path" name="logoPath" value={form.logoPath} onChange={handleChange} placeholder="/letters/logo.jpeg" />
              <Field label="Signature Path" name="signaturePath" value={form.signaturePath} onChange={handleChange} placeholder="/letters/sign.png" />
            </div>

            {message ? (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }}>
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={submitting} className="btn btn-primary btn-md w-full">
              {submitting ? "Creating..." : "Create Experience Letter"}
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
              <button type="button" className="btn btn-outline btn-sm" onClick={handlePreviewCurrentForm}>
                <Eye className="h-4 w-4" />
                Current Form Preview
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>

            <ExperienceLetterPreview ref={letterRef} letter={activePreview} />
          </div>

          <div className="rounded-2xl" style={cardStyle}>
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  Saved Experience Letters
                </h2>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {loading ? "Loading..." : `${items.length} records available`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                Loading experience letters...
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                No experience letters created yet.
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
                        {item.position} • {item.experienceDuration} • {formatReadableDate(item.experienceFrom)} to {formatReadableDate(item.experienceTo)}
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

const ExperienceLetterPreview = forwardRef<
  HTMLDivElement,
  {
    letter: ReturnType<typeof normalizeLetter>;
  }
>(function ExperienceLetterPreview({ letter }, ref) {
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
        alt="Experience letter header"
        className="absolute left-0 top-0 h-[72px] w-full object-cover"
      />
      <img
        src={letter.footerImagePath}
        alt="Experience letter footer"
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

          <div className="text-right leading-[1.55]">
            <p style={{ color: "#173982" }}>Ref No.: {letter.regNo}</p>
            <p style={{ color: "#173982" }}>Date of Issue: {formatLongDate(letter.issueDate)}</p>
          </div>
        </div>

          <div className="mt-6 flex-1 space-y-4 text-[11.5px] leading-[1.55]" style={{ color: "#26407b" }}>
            <div>
              <p className="font-bold italic" style={{ color: "#173982" }}>
                Subject: Experience Letter
              </p>
              <p className="mt-1.5" style={{ color: "#26407b" }}>
                This is to certify that <strong>{letter.candidateName}</strong> was employed with{" "}
                <strong>RexGalaxy Technology</strong> as a <strong>{letter.position}</strong> from{" "}
                <strong>{formatReadableDate(letter.experienceFrom)}</strong> to{" "}
                <strong>{formatReadableDate(letter.experienceTo)}</strong>.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>1. Employment Duration</p>
              <p style={{ color: "#26407b" }}>
                During the above tenure, the employee served the organization for a total experience
                period of <strong>{letter.experienceDuration}</strong>.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>2. Roles and Responsibilities</p>
              <p style={{ color: "#26407b" }}>
                In this role, {letter.candidateName} was involved in day-to-day execution,
                team coordination, task ownership, and delivery of assigned responsibilities in
                accordance with organizational standards and timelines.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>3. Performance and Conduct</p>
              <p style={{ color: "#26407b" }}>
                Throughout the period of employment, the employee demonstrated professional behavior,
                dedication toward work, and a positive approach in carrying out responsibilities.
                Their conduct with management and team members was found to be satisfactory.
              </p>
            </div>

            <div>
              <p className="font-bold" style={{ color: "#173982" }}>4. Issuance Purpose</p>
              <p style={{ color: "#26407b" }}>
                This letter has been issued upon the employee&apos;s request for official and record
                purposes. We wish them continued success in their future professional endeavors.
              </p>
            </div>
          </div>

          <div className="mt-4 text-[11px]" style={{ color: "#26407b" }}>
            <p className="font-semibold" style={{ color: "#173982" }}>{letter.hrName}</p>
            <p style={{ color: "#26407b" }}>{letter.hrTitle}</p>
            <img
              src={letter.signaturePath}
              alt="Signature"
              className="mt-2 h-18 w-auto object-contain"
            />
            <p className="mt-1.5" style={{ color: "#26407b" }}>{letter.contactEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
