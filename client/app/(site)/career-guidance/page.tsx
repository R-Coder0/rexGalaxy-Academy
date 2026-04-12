/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  IndianRupee,
  CheckCircle2,
  Upload,
  Building2,
  Phone,
  Mail,
  User,
  FileText,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

type ApiJob = {
  _id: string;
  title: string;
  description: string;
  type: "full-time" | "part-time" | "internship";
  location: string;
  qualificationAndExperience: string;
  experienceMin: number;
  experienceMax: number;
  salaryLabel: string;
  responsibilities: string[];
  requirements: string[];
  goodToHave: string[];
  isActive: boolean;
  createdAt: string;
};

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  summary: string;
  qualificationAndExperience: string;
  responsibilities: string[];
  requirements: string[];
  skillsGoodToHave: string[];
};

function formatType(t: ApiJob["type"]) {
  if (t === "full-time") return "Full-time";
  if (t === "part-time") return "Part-time";
  return "Internship";
}

function formatExp(min: number, max: number) {
  if (min === max) return `${min} year${min > 1 ? "s" : ""}`;
  return `${min}–${max} years`;
}

export default function CareersPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const bulletIconClass = "h-3.5 w-3.5 shrink-0 text-[var(--brand)] mt-0.5";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const [jobAppliedFor, setJobAppliedFor] = useState<string>("General Application");
  const [jobAppliedForId, setJobAppliedForId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.title === jobAppliedFor);
  }, [jobs, jobAppliedFor]);

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setExperience("");
    setLocation("");
    setNoticePeriod("");
    setMessage("");
    setResume(null);
    setFormError(null);

    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    return /^[0-9+]{10,15}$/.test(cleaned);
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);

    try {
      if (!API) {
        setJobsLoading(false);
        return;
      }

      const res = await fetch(`${API}/jobs`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setJobsError(data?.message || "Failed to load opportunities.");
        setJobsLoading(false);
        return;
      }

      const list: ApiJob[] = Array.isArray(data?.data) ? data.data : [];
      const active = list.filter((j) => j.isActive);

      const mapped: Job[] = active.map((j) => ({
        id: j._id,
        title: j.title,
        department: "Career Opportunity",
        location: j.location || "On-site",
        type: formatType(j.type),
        experience: formatExp(j.experienceMin, j.experienceMax),
        salary: j.salaryLabel || "As per role",
        summary: j.description || "Explore this opportunity with Rex Galaxy Academy.",
        qualificationAndExperience: j.qualificationAndExperience || "",
        responsibilities: j.responsibilities || [],
        requirements: j.requirements || [],
        skillsGoodToHave: j.goodToHave || [],
      }));

      setJobs(mapped);

      if (mapped.length > 0) {
        setActiveJobId((prev) => prev ?? mapped[0].id);
        setJobAppliedFor((prev) =>
          prev === "General Application" ? mapped[0].title : prev
        );
        setJobAppliedForId((prev) => prev ?? mapped[0].id);
      }
    } catch {
      setJobsError("Server not reachable.");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setFormError(null);

    if (!API) return setFormError("API base URL is missing.");
    if (!fullName.trim()) return setFormError("Please enter your full name.");
    if (!phone.trim() || !validatePhone(phone)) {
      return setFormError("Please enter a valid phone number.");
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return setFormError("Please enter a valid email address.");
    }
    if (!resume) return setFormError("Please upload your resume.");
    if (resume.size > 5 * 1024 * 1024) {
      return setFormError("Resume file must be under 5MB.");
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      if (jobAppliedForId) fd.append("jobId", jobAppliedForId);
      fd.append("jobTitle", jobAppliedFor);

      fd.append("fullName", fullName);
      fd.append("phone", phone);
      fd.append("email", email);

      if (experience) fd.append("experience", experience);
      if (location) fd.append("location", location);
      if (noticePeriod) fd.append("noticePeriod", noticePeriod);
      if (message) fd.append("message", message);

      fd.append("resume", resume);

      const res = await fetch(`${API}/careers/`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setFormError(data?.message || "Failed to submit application.");
        return;
      }

      setSuccess(true);
      resetForm();
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/banner/cbanner.png"
            alt="Rex Galaxy Academy Career Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.16),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.10),transparent_55%)]" />
        </div>

        <div className="relative pt-16 md:pt-2">
          <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6 lg:py-24">
            <nav className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="text-white/35">/</li>
                <li className="text-[var(--brand)]">Careers</li>
              </ol>
            </nav>

            <div className="mt-5 max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur">
                Careers & Guidance
              </div>

              <h1 className="mt-5 text-3xl font-semibold text-white md:text-5xl">
                Build Your Career in IT & AI
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
                Rex Galaxy Academy is an institute of IT and AI training where
                learning goes beyond theory. We help students, freshers, and
                aspiring professionals build practical skills, choose the right
                path, and move confidently toward real career opportunities.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#openings"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[var(--brand-hover)]"
                >
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>

                <a
                  href="#guidance"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8"
                >
                  Career Guidance
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-12 w-full bg-gradient-to-b from-transparent to-[var(--bg)]" />
      </section>

      {/* ABOUT / CULTURE */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute -top-3 left-10 h-3 w-28 rounded-full bg-[var(--brand)]/80 blur-[1px]" />
              <div className="absolute -bottom-4 left-24 h-3 w-32 rounded-full bg-[var(--ai-cyan)]/60 blur-[1px]" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur">
                <img
                  src="/banner/imageai.png"
                  alt="Rex Galaxy Academy students and team"
                  className="h-80 w-full object-cover sm:h-[420px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
              </div>
            </div>

            <div>
              <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                Learn. Build. Grow.
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Career-Focused Learning for the Real World
              </h2>

              <p className="mt-4 pr-0 text-sm leading-relaxed text-white/70 lg:pr-20">
                At Rex Galaxy Academy, we focus on practical training, modern
                tools, and real skill development. Our programs are designed for
                learners who want more than certificates — they want confidence,
                clarity, and career direction.
              </p>

              <p className="mt-3 pr-0 text-sm leading-relaxed text-white/65 lg:pr-10">
                From IT fundamentals to AI-based learning, we help students and
                job seekers prepare for the next step with structured guidance
                and hands-on exposure.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[var(--brand-hover)]"
                >
                  Know More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold text-white/50">Learning Style</p>
                  <p className="mt-1 text-sm font-bold text-white">Practical & Modern</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold text-white/50">Guidance</p>
                  <p className="mt-1 text-sm font-bold text-white">Career-Focused Support</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold text-white/50">Goal</p>
                  <p className="mt-1 text-sm font-bold text-white">Industry Readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER GUIDANCE */}
      <section id="guidance" className="mx-auto max-w-[1500px] px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
              Career Guidance
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
              Not Just Training. Real Direction.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Choosing a career in IT or AI can feel confusing in the beginning.
              That’s why this page is not only about jobs — it’s also about
              guidance. We help learners understand what suits them, what skills
              they need, and how to move forward with confidence.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: BookOpen,
                title: "Career Counselling",
                desc: "Get clarity on the right learning and career path.",
              },
              {
                icon: Sparkles,
                title: "Skill Roadmap",
                desc: "Know what to learn and in what sequence.",
              },
              {
                icon: Briefcase,
                title: "Interview Support",
                desc: "Prepare better for internships and job opportunities.",
              },
              {
                icon: GraduationCap,
                title: "Job-Ready Training",
                desc: "Learn practical tools and concepts that matter.",
              },
              {
                icon: ShieldCheck,
                title: "Placement Guidance",
                desc: "Build confidence for your next step in the industry.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <item.icon className="h-5 w-5 text-[var(--brand)]" />
                <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY JOIN US */}
      <section className="mx-auto max-w-[1500px] px-4 py-12">
        <h2 className="text-2xl font-semibold text-white">
          Why Join Rex Galaxy Academy?
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">
          We keep the learning path simple, relevant, and career-oriented. Our
          focus is to help every learner gain practical knowledge and move ahead
          with clarity.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "Practical Learning",
              desc: "Learn with real examples, guided tasks, and industry-focused concepts.",
            },
            {
              icon: Sparkles,
              title: "Industry-Relevant Skills",
              desc: "Courses built around current IT and AI learning needs.",
            },
            {
              icon: Building2,
              title: "Expert Mentorship",
              desc: "Learn with guidance that helps you stay on the right path.",
            },
            {
              icon: ShieldCheck,
              title: "Career Guidance Support",
              desc: "Get help in choosing roles, skills, and growth direction.",
            },
            {
              icon: Briefcase,
              title: "Placement Assistance",
              desc: "Support for internships, applications, and job readiness.",
            },
            {
              icon: BookOpen,
              title: "Beginner to Advanced",
              desc: "Suitable for freshers, students, and upskilling learners.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur"
            >
              <item.icon className="h-6 w-6 text-[var(--brand)]" />
              <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-white/65">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OPENINGS */}
      <section id="openings" className="border-t border-white/5 bg-[var(--surface)]/30">
        <div className="mx-auto max-w-[1500px] px-4 py-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Career Opportunities</h2>
              {/* <p className="mt-2 text-sm text-white/65">
                We regularly open opportunities for interns, trainers, support
                roles, and IT professionals. If you are passionate about
                technology, AI, learning, or teaching, explore the roles below
                and apply for the one that fits you best.
              </p> */}

              {jobsError && <p className="mt-2 text-sm font-semibold text-red-400">{jobsError}</p>}
              {jobsLoading && <p className="mt-2 text-sm text-white/60">Loading opportunities...</p>}
              {!jobsLoading && !jobsError && jobs.length === 0 && (
                <p className="mt-2 text-sm text-white/60">
                  No openings available right now. You can still submit a general
                  application below.
                </p>
              )}
            </div>

            <a
              href="#apply"
              onClick={() => {
                setJobAppliedFor("General Application");
                setJobAppliedForId(null);
              }}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8 sm:w-auto"
            >
              Submit General Application
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Left: Job List */}
<div className="space-y-3">
  {jobs.map((job) => {
    const active = activeJobId === job.id;

    return (
      <button
        key={job.id}
        type="button"
        onClick={() => {
          setActiveJobId(job.id);
          setJobAppliedFor(job.title);
          setJobAppliedForId(job.id);
        }}
        className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
          active
            ? "border-[var(--brand)]/30 bg-white/8"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-white">{job.title}</p>
          </div>

          <div
            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
              active ? "bg-[var(--brand)]" : "bg-white/20"
            }`}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/60 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/35" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/35" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-white/35" />
            {job.experience}
          </span>
          <span className="inline-flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-white/35" />
            {job.salary}
          </span>
        </div>
      </button>
    );
  })}
</div>

            {/* Right: Job Detail */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
              {selectedJob ? (
                <>
                  <h3 className="text-lg font-extrabold text-white">{selectedJob.title}</h3>
                  <p className="mt-1 text-sm text-white/65">{selectedJob.summary}</p>

                  <div className="mt-5 grid gap-3 text-sm text-white/65 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/35" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/35" />
                      <span>{selectedJob.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-white/35" />
                      <span>{selectedJob.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-white/35" />
                      <span>{selectedJob.salary}</span>
                    </div>
                  </div>

                  {selectedJob.qualificationAndExperience?.trim() ? (
                    <div className="mt-5 rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand)]/8 p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-white">
                        <GraduationCap className="h-4 w-4 text-[var(--brand)]" />
                        Qualification & Experience
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm text-white/75">
                        {selectedJob.qualificationAndExperience}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-bold text-white">Responsibilities</p>
                      <ul className="mt-3 space-y-2 text-sm text-white/65">
                        {selectedJob.responsibilities.length > 0 ? (
                          selectedJob.responsibilities.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                              {r}
                            </li>
                          ))
                        ) : (
                          <li className="flex gap-2">
                            <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                            Assist with assigned responsibilities based on the role.
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">Requirements</p>
                      <ul className="mt-3 space-y-2 text-sm text-white/65">
                        {selectedJob.requirements.length > 0 ? (
                          selectedJob.requirements.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                              {r}
                            </li>
                          ))
                        ) : (
                          <li className="flex gap-2">
                            <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                            Relevant interest, attitude, and willingness to learn.
                          </li>
                        )}
                      </ul>

                      {selectedJob.skillsGoodToHave?.length > 0 && (
                        <>
                          <p className="mt-6 text-sm font-bold text-white">Preferred Skills</p>
                          <ul className="mt-3 space-y-2 text-sm text-white/65">
                            {selectedJob.skillsGoodToHave.map((r, i) => (
                              <li key={i} className="flex gap-2">
                                <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#apply"
                      onClick={() => {
                        setJobAppliedFor(selectedJob.title);
                        setJobAppliedForId(selectedJob.id);
                      }}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black hover:bg-[var(--brand-hover)] sm:w-auto"
                    >
                      Apply for This Role
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/60">Select a role to view details.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="mx-auto max-w-[1500px] px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-white">Apply Now</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Share your details and our team will connect with you.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Whether you are looking for a job, internship, or career guidance,
              this can be your first step toward growth in IT and AI.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-bold text-white">Application Guidelines</p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li className="flex gap-2">
                  <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                  Upload your resume in PDF, DOC, or DOCX format (maximum 5 MB).
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                  Mention your current location and experience if applicable.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className={bulletIconClass} strokeWidth={2} />
                  Add a short message about your interest, profile, or career goal.
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-bold text-white">What You Can Apply For</p>
              <div className="mt-3 space-y-3 text-sm text-white/65">
                <div className="flex items-start gap-2">
                  <Briefcase className="mt-0.5 h-4 w-4 text-white/35" />
                  <span>Jobs and internship opportunities</span>
                </div>
                <div className="flex items-start gap-2">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-white/35" />
                  <span>Career guidance and skill roadmap support</span>
                </div>
                <div className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-white/35" />
                  <span>General profile submission for future openings</span>
                </div>
              </div>
            </div>

            <section className="mx-auto max-w-[1500px] px-0 py-10">
              <h3 className="text-xl font-bold text-white">
                Careers in IT, AI & Digital Skills
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
                We welcome learners, freshers, and professionals who want to
                grow in technology. If you are serious about building a future
                in IT, AI, software tools, or digital skill-based roles, Rex
                Galaxy Academy can support your next move.
              </p>
            </section>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            {success ? (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="text-sm font-extrabold text-white">Application submitted</p>
                    <p className="mt-1 text-sm text-white/70">
                      Thank you. Our team will review your profile and connect
                      with you if there is a suitable match.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="mt-4 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[var(--brand-hover)]"
                    >
                      Submit another application
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-white/70">Applying for</label>
                  <select
                    value={jobAppliedFor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJobAppliedFor(val);

                      if (val === "General Application") {
                        setJobAppliedForId(null);
                        return;
                      }

                      const found = jobs.find((x) => x.title === val);
                      setJobAppliedForId(found?.id ?? null);
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.title} className="bg-[#111] text-white">
                        {j.title}
                      </option>
                    ))}
                    <option value="General Application" className="bg-[#111] text-white">
                      General Application
                    </option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    icon={<User className="h-4 w-4 text-white/35" />}
                    value={fullName}
                    onChange={setFullName}
                    type="text"
                    placeholder="Your full name"
                    required
                  />
                  <FormField
                    label="Phone"
                    icon={<Phone className="h-4 w-4 text-white/35" />}
                    value={phone}
                    onChange={setPhone}
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                  <FormField
                    label="Email"
                    icon={<Mail className="h-4 w-4 text-white/35" />}
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="you@domain.com"
                    required
                  />
                  <FormField
                    label="Current Location"
                    icon={<MapPin className="h-4 w-4 text-white/35" />}
                    value={location}
                    onChange={setLocation}
                    type="text"
                    placeholder="e.g. Delhi"
                  />
                  <FormField
                    label="Total Experience"
                    icon={<Briefcase className="h-4 w-4 text-white/35" />}
                    value={experience}
                    onChange={setExperience}
                    type="text"
                    placeholder="e.g. Fresher / 1 year"
                  />
                  <FormField
                    label="Notice Period"
                    icon={<Clock className="h-4 w-4 text-white/35" />}
                    value={noticePeriod}
                    onChange={setNoticePeriod}
                    type="text"
                    placeholder="e.g. Immediate"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Resume (required)
                    <br />
                    Accepted formats: PDF, DOC, DOCX (Max 5 MB)
                  </label>

                  <div className="mt-1 flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-3 focus-within:border-[var(--brand)]/60 focus-within:ring-1 focus-within:ring-[var(--brand)]/40">
                    <Upload className="h-4 w-4 text-white/35" />
                    <input
                      required
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="w-full text-sm text-white outline-none file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 5 * 1024 * 1024) {
                          setFormError("Resume must be under 5MB.");
                          e.currentTarget.value = "";
                          setResume(null);
                          return;
                        }
                        setResume(file);
                      }}
                    />
                  </div>

                  {resume && (
                    <p className="mt-1 text-xs text-white/55">
                      Selected: <span className="font-semibold text-white">{resume.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Message</label>
                  <div className="mt-1 flex items-start gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-3 focus-within:border-[var(--brand)]/60 focus-within:ring-1 focus-within:ring-[var(--brand)]/40">
                    <FileText className="mt-0.5 h-4 w-4 text-white/35" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Write a short note about your profile, interest, or career goal."
                      className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                  </div>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>

                <p className="text-xs text-white/45">
                  By submitting, you confirm that the information shared by you is correct.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({
  label,
  icon,
  value,
  onChange,
  type,
  placeholder,
  required = false,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-white/70">{label}</label>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-3 focus-within:border-[var(--brand)]/60 focus-within:ring-1 focus-within:ring-[var(--brand)]/40">
        {icon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>
    </div>
  );
}