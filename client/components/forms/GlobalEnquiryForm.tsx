"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  BookOpen,
  X,
  ChevronDown,
} from "lucide-react";

type GlobalEnquiryFormProps = {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  source?: string;
  courseOptions?: string[];
  showCourseField?: boolean;
  className?: string;
  initialCourse?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (payload: {
    fullName: string;
    email: string;
    phone: string;
    course: string;
    message: string;
    source: string;
  }) => void;
};

type EnquiryFormState = {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  message: string;
};

type FormErrors = Partial<Record<keyof EnquiryFormState, string>>;

const defaultCourses = [
  "Microsoft Azure Cloud",
  "Power BI",
  "Advance Digital Marketing",
  "Business Analyst",
  "AWS Training",
  "AutoCAD",
  "Cyber Security",
  "Java",
  "PL SQL",
  "Python",
  "Python Data Analyst",
];

const getInitialForm = (course = ""): EnquiryFormState => ({
  fullName: "",
  email: "",
  phone: "",
  course,
  message: "",
});

export default function GlobalEnquiryForm({
  title = "Enquire Now",
  subtitle = "Fill in your details and our team will connect with you shortly.",
  submitLabel = "Submit Enquiry",
  source = "website",
  courseOptions = defaultCourses,
  showCourseField = true,
  className = "",
  initialCourse = "",
  isOpen = true,
  onClose,
  onSuccess,
}: GlobalEnquiryFormProps) {
  const [form, setForm] = useState<EnquiryFormState>(getInitialForm(initialCourse));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    setForm(getInitialForm(initialCourse));
    setErrors({});
    setIsSuccess(false);
    setSubmitError("");
  }, [initialCourse, isOpen]);

  const hasCourseOptions = useMemo(
    () => Array.isArray(courseOptions) && courseOptions.length > 0,
    [courseOptions]
  );

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (showCourseField && !form.course.trim()) {
      nextErrors.course = "Please select a course";
    }

    if (!form.message.trim()) nextErrors.message = "Message is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof EnquiryFormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);
    setSubmitError("");

    if (!validate()) return;

    if (!API_BASE_URL) {
      setSubmitError(
        "API base URL is missing. Please set NEXT_PUBLIC_API_BASE_URL."
      );
      return;
    }

    const payload = {
      ...form,
      source,
    };

    try {
      setIsSubmitting(true);
      const formPayload = new FormData();
      formPayload.append("fullName", form.fullName.trim());
      formPayload.append("phone", form.phone.trim());
      formPayload.append("email", form.email.trim());
      formPayload.append("company", form.course.trim() || source.trim());
      formPayload.append(
        "message",
        `${form.message.trim()}${
          form.course ? `\n\nInterested Course: ${form.course.trim()}` : ""
        }`
      );

      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to submit enquiry. Please try again."
        );
      }

      setIsSuccess(true);
      setForm(getInitialForm(initialCourse));
      setErrors({});

      onSuccess?.(payload);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div
          className={[
            "relative z-10 w-full max-w-2xl rounded-[var(--radius-lg)] border border-white/10 bg-[var(--surface-2)]/95 backdrop-blur-md shadow-[var(--shadow)]",
            className,
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <h3 className="font-[var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {title}
              </h3>
              <p className="mt-2 text-sm text-white/65">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="field">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/35 focus:border-[var(--brand)] focus:bg-white/[0.07]"
                  />
                </div>
                {errors.fullName ? (
                  <p className="mt-2 text-xs text-red-400">{errors.fullName}</p>
                ) : null}
              </div>

              <div className="field">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/35 focus:border-[var(--brand)] focus:bg-white/[0.07]"
                  />
                </div>
                {errors.email ? (
                  <p className="mt-2 text-xs text-red-400">{errors.email}</p>
                ) : null}
              </div>

              <div className="field">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    maxLength={10}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/35 focus:border-[var(--brand)] focus:bg-white/[0.07]"
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-2 text-xs text-red-400">{errors.phone}</p>
                ) : null}
              </div>

              {showCourseField && (
                <div className="field">
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Course
                  </label>
                  <div className="relative">
                    <BookOpen className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/40" />

                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white outline-none transition focus:border-[var(--brand)] focus:bg-white/[0.07]"
                    >
                      <option value="">Select course</option>
                      {hasCourseOptions &&
                        courseOptions.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  </div>
                  {errors.course ? (
                    <p className="mt-2 text-xs text-red-400">{errors.course}</p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="field mt-4">
              <label className="mb-2 block text-sm font-medium text-white/75">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-white/40" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you are looking for"
                  className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 pt-3 text-white outline-none transition placeholder:text-white/35 focus:border-[var(--brand)] focus:bg-white/[0.07]"
                />
              </div>
              {errors.message ? (
                <p className="mt-2 text-xs text-red-400">{errors.message}</p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-white/45">
                Fill the form to access the brochure.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : submitLabel}
              </button>
            </div>

            {isSuccess ? (
              <div className="mt-4 rounded-[var(--radius)] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Enquiry submitted successfully. Our team will contact you
                shortly.
              </div>
            ) : null}

            {submitError ? (
              <div className="mt-4 rounded-[var(--radius)] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {submitError}
              </div>
            ) : null}
          </form>
        </div>
      </div>

      <style jsx global>{`
        select option {
          background-color: #0f172a;
          color: #ffffff;
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        input,
        textarea,
        select {
          font-size: 16px;
        }

        textarea {
          resize: none;
        }
      `}</style>
    </>
  );
}
