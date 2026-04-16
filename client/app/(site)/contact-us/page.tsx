"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_EMAIL_LINK,
  SITE_HOURS,
  SITE_LOCATION_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_LINK,
  SITE_WHATSAPP_LINK,
} from "@/lib/site-contact";

const contactCards = [
  {
    title: "Call Us",
    value: SITE_PHONE_DISPLAY,
    desc: "Speak with our counsellor for course guidance.",
    actionText: "Call Now",
    href: SITE_PHONE_LINK,
  },
  {
    title: "Email",
    value: SITE_EMAIL,
    desc: "Send your query and we’ll reply ASAP.",
    actionText: "Send Email",
    href: SITE_EMAIL_LINK,
  },
  {
    title: "WhatsApp",
    value: SITE_PHONE_DISPLAY,
    desc: "Quick reply for fees, batches, and demo class.",
    actionText: "Chat Now",
    href: SITE_WHATSAPP_LINK,
  },
];

const branches = [
  {
    city: SITE_LOCATION_NAME,
    address: SITE_ADDRESS,
    timing: "Mon–Sat: 9:00 AM – 7:00 PM",
  },
  {
    city: "Delhi",
    address:
      "Instructor-led batches with doubt sessions, labs, and placement support.",
    timing: "Mon–Sat: 9:30 AM – 7:30 PM",
  },
  {
    city: "Gurgaon",
    address: "Job-ready programs, projects and interview prep workshops.",
    timing: "Mon–Sat: 10:00 AM – 7:00 PM",
  },
  {
    city: "Online",
    address:
      "Live classes, recordings, mentor support and regular assessments.",
    timing: "Everyday: Flexible batches",
  },
];

const faqs = [
  {
    q: "How soon will I get a callback?",
    a: "Usually within 15–60 minutes during working hours.",
  },
  {
    q: "Can I book a free demo class?",
    a: "Yes. Share your preferred course and time, we’ll schedule a demo.",
  },
  {
    q: "Do you provide course completion certificates?",
    a: "Yes, after successful completion and assessments (as per course).",
  },
  {
    q: "Do you offer online + offline both?",
    a: "Yes. Our Noida office supports both classroom guidance and online learning assistance.",
  },
];

const courseOptions = [
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

type FormState = {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  course: string;
};

const initialFormState: FormState = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  message: "",
  course: "",
};

const primaryBranch = branches[0]
  ? {
      ...branches[0],
      city: SITE_LOCATION_NAME,
      address: SITE_ADDRESS,
      timing: SITE_HOURS,
    }
  : {
      city: SITE_LOCATION_NAME,
      address: SITE_ADDRESS,
      timing: SITE_HOURS,
    };

export default function ContactUsPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (submitError) setSubmitError("");
    if (submitMessage) setSubmitMessage("");
  };

  const validateForm = () => {
    const errors: Partial<FormState> = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (form.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
      if (!emailOk) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!form.message.trim()) {
      errors.message = "Message is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitMessage("");

    if (!validateForm()) return;

    if (!API_BASE_URL) {
      setSubmitError(
        "API base URL is missing. Please set NEXT_PUBLIC_API_BASE_URL in your .env.local file."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("fullName", form.fullName.trim());
      payload.append("company", form.course.trim() || form.company.trim());
      payload.append("phone", form.phone.trim());
      payload.append("email", form.email.trim());
      payload.append(
        "message",
        `${form.message.trim()}${
          form.course ? `\n\nInterested Course: ${form.course}` : ""
        }`
      );

      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to submit enquiry. Please try again."
        );
      }

      setSubmitMessage("Enquiry submitted successfully.");
      setForm(initialFormState);
      setFieldErrors({});
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
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[360px] bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-transparent blur-2xl" />

      <section className="mx-auto max-w-[1500px] px-5 pb-10 pt-14 md:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Contact Us
        </p>

        <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              Let’s Talk About Your{" "}
              <span className="text-orange-500">Career Goals</span>
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
              Need help choosing the right course? Share your details and our
              counsellor will connect with you shortly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Explore Courses
              </Link>

              <a
                href={SITE_WHATSAPP_LINK}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/15 transition hover:opacity-90"
              >
                WhatsApp Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
            {contactCards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-orange-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="mt-1 text-sm font-bold text-orange-500">
                      {c.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {c.desc}
                    </p>
                  </div>

                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400 transition group-hover:bg-orange-500 group-hover:text-black">
                    {c.actionText}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                Send a <span className="text-orange-500">Message</span>
              </h2>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                Fast Response
              </span>
            </div>

            <p className="mt-2 text-sm text-white/60">
              Fill in your details. Our team will guide you with course, fees
              and batch timings.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-white/60">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-500/50"
                  />
                  {fieldErrors.fullName ? (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.fullName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={SITE_PHONE_DISPLAY}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-500/50"
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-white/60">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={SITE_EMAIL}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-500/50"
                  />
                  {fieldErrors.email ? (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">
                    Interested Course
                  </label>
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
                  >
                    <option value="">Select course</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you want to learn..."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-500/50"
                />
                {fieldErrors.message ? (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/15 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>

              {submitMessage ? (
                <p className="text-center text-sm text-emerald-400">
                  {submitMessage}
                </p>
              ) : null}

              {submitError ? (
                <p className="text-center text-sm text-red-400">
                  {submitError}
                </p>
              ) : null}

              <p className="text-center text-xs text-white/40">
                By submitting, you agree to be contacted by our team.
              </p>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">
                  Find Our <span className="text-orange-500">Office on Google Maps</span>
                </p>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                  Location
                </span>
              </div>

              <p className="mt-2 text-xs text-white/60">
                Get directions and visit our center easily.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border border-orange-500/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0828742361664!2d77.36992837570912!3d28.627278184318897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce506a25025d3%3A0xdcfea1184d800e5e!2sRexGalaxy%20Technology!5e0!3m2!1sen!2sin!4v1769224409656!5m2!1sen!2sin"
                  width="100%"
                  height="260"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h2 className="text-xl font-bold">
              Visit Our <span className="text-orange-500">Office</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Connect with our single office for counselling, batches, and admissions.
            </p>

            <div className="mt-6 space-y-4">
              {[primaryBranch].map((b) => (
                <div
                  key={b.city}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{b.city}</h3>
                      <p className="mt-1 text-sm text-white/70">{b.address}</p>
                      <p className="mt-2 text-xs text-orange-400">{b.timing}</p>
                    </div>

                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                      Open
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/courses"
                      className="text-sm font-semibold text-white/70 hover:text-white"
                    >
                      View Courses →
                    </Link>
                    <Link
                      href="/contact-us"
                      className="text-sm font-semibold text-orange-400 hover:text-orange-300"
                    >
                      Get Directions →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-14">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Contact <span className="text-orange-500">FAQs</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Common questions before registration.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{f.q}</span>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400 group-open:bg-orange-500 group-open:text-black">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16">
        <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 via-white/5 to-transparent p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Book Your{" "}
                <span className="text-orange-500">Free Counselling</span>
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Get personalized course suggestions, batch timings and fee
                details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={SITE_PHONE_LINK}
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/15 transition hover:opacity-90"
              >
                Call Now
              </a>
              <a
                href={SITE_WHATSAPP_LINK}
                className="rounded-xl border border-orange-500/40 bg-transparent px-6 py-3 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
