"use client";

import { useState } from "react";

type CourseEnquiryFormProps = {
  courseName: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export default function CourseEnquiryForm({
  courseName,
}: CourseEnquiryFormProps) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError("");
    if (submitMessage) setSubmitMessage("");
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Enter a valid email address.";
    }
    if (!form.phone.trim()) return "Phone number is required.";
    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      return "Enter a valid 10-digit phone number.";
    }
    if (!form.message.trim()) return "Message is required.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    if (!API_BASE_URL) {
      setSubmitError("API base URL is missing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("fullName", form.fullName.trim());
      payload.append("phone", form.phone.trim());
      payload.append("email", form.email.trim());
      payload.append("company", courseName);
      payload.append(
        "message",
        `${form.message.trim()}\n\nInterested Course: ${courseName}`
      );

      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to submit enquiry. Please try again."
        );
      }

      setSubmitMessage("Enquiry submitted successfully.");
      setForm(initialState);
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

  return (
    <aside
      className="rounded-[26px] border border-white/10 p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
      }}
    >
      <h3 className="text-xl font-semibold text-white">Get Quick Call</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">
        Fill your details and our counsellor will contact you shortly.
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />

        <input
          value={courseName}
          disabled
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 outline-none"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us what you want to learn"
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />

        <button className="w-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]">
          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
        </button>

        {submitMessage ? (
          <p className="text-sm text-emerald-400">{submitMessage}</p>
        ) : null}

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}
      </form>
    </aside>
  );
}
