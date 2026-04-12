/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "Curriculum Design & Roadmap",
    description:
      "We structure every program with clear learning outcomes, industry-aligned modules, and an AI-assisted roadmap so learners always know what to learn next.",
  },
  {
    title: "Mentor-Led Sessions",
    description:
      "Concepts are taught with real examples and practical workflows. Learners get guided explanations, doubt-solving, and structured practice.",
  },
  {
    title: "Projects & Assessments",
    description:
      "We focus on hands-on implementation—projects, assignments, and mini-assessments to build confidence and job-ready skills.",
  },
  {
    title: "Interview & Career Prep",
    description:
      "We help learners prepare with interview questions, resume support, and portfolio guidance to confidently apply for roles.",
  },
];

export default function HowWeWorkSection() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setorganization] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      organization: organization.trim(),
      message: message.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.organization || !payload.message) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.message || "Unable to submit feedback. Please try again.");
        return;
      }

      setSuccessMsg("Thank you! Your message has been submitted.");

      setFullName("");
      setEmail("");
      setorganization("");
      setMessage("");
    } catch {
      setErrorMsg("Server not reachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 lg:py-20 bg-[var(--bg)]">
      {/* Background Image + Overlay (same concept, theme aligned) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=2070"
          alt="Learning background"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.10),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-8 px-2 lg:flex-row lg:gap-10 lg:px-4">
        {/* LEFT SIDE CONTENT */}
        <div className="flex-1 lg:pr-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]/90">
            From Basics to Job-Ready Skills
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-white lg:text-5xl">
            How We Teach
          </h2>

          <div className="mt-4 h-[2px] w-40 bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />

          <div className="mt-8 space-y-6">
            {STEPS.map((step, index) => {
              const number = String(index + 1).padStart(2, "0");

              return (
                <div key={index} className="flex items-start gap-5">
                  {/* number badge */}
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 border border-white/10 text-sm font-semibold text-white/90">
                      {number}
                    </div>
                  </div>

                  {/* title + description */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-6">
                      <h3 className="md:w-65 md:shrink-0 text-base font-semibold text-white md:text-lg">
                        {step.title}
                      </h3>

                      <p className="min-w-0 text-base leading-relaxed text-white/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE FORM CARD (same structure, theme aligned) */}
        <div className="flex-1 lg:max-w-md lg:self-stretch">
          <div className="h-full rounded-lg bg-white/5 border border-white/10 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
            {/* top accent */}
            <div className="h-1 w-full bg-[var(--brand)]" />

            <div className="p-6 md:p-7 lg:p-8">
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                Talk to Our Team
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Share your requirements. We’ll help you pick the right program and learning path.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--brand)]/60 focus:ring-2 focus:ring-[var(--brand)]/20"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--brand)]/60 focus:ring-2 focus:ring-[var(--brand)]/20"
                />

                <input
                  type="text"
                  placeholder="Company / Organization"
                  value={organization}
                  onChange={(e) => setorganization(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--brand)]/60 focus:ring-2 focus:ring-[var(--brand)]/20"
                />

                <textarea
                  rows={4}
                  placeholder="Write your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--brand)]/60 focus:ring-2 focus:ring-[var(--brand)]/20"
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-1 w-full rounded bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-[var(--brand-hover)] disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>

                {errorMsg ? <p className="text-xs text-red-400">{errorMsg}</p> : null}
                {successMsg ? <p className="text-xs text-green-400">{successMsg}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}