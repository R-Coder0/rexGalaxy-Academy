/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  X,
  Trash2,
  Pencil,
  Power,
  MapPin,
  Clock,
  BadgeIndianRupee,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

type JobType = "full-time" | "part-time" | "internship";

type Job = {
  _id: string;
  title: string;
  description: string;
  type: JobType;
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

const TYPE_OPTIONS: { label: string; value: JobType }[] = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Internship", value: "internship" },
];

function formatType(t: JobType) {
  if (t === "full-time") return "Full-time";
  if (t === "part-time") return "Part-time";
  return "Internship";
}

function toArrayFromTextarea(v: string) {
  return v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toTextareaFromArray(arr: string[]) {
  return (arr || []).join("\n");
}

export default function AdminJobsPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<JobType | "all">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Job | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<JobType>("full-time");
  const [location, setLocation] = useState("");
  const [qualificationAndExperience, setQualificationAndExperience] = useState("");
  const [experienceMin, setExperienceMin] = useState<number>(0);
  const [experienceMax, setExperienceMax] = useState<number>(0);
  const [salaryLabel, setSalaryLabel] = useState("Not disclosed");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [goodToHaveText, setGoodToHaveText] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("full-time");
    setLocation("");
    setQualificationAndExperience("");
    setExperienceMin(0);
    setExperienceMax(0);
    setSalaryLabel("Not disclosed");
    setResponsibilitiesText("");
    setRequirementsText("");
    setGoodToHaveText("");
    setFormError(null);
    setEditing(null);
  };

  const openCreate = () => {
    setMode("create");
    resetForm();
    setOpen(true);
  };

  const openEdit = (job: Job) => {
    setMode("edit");
    setEditing(job);

    setTitle(job.title);
    setDescription(job.description);
    setType(job.type);
    setLocation(job.location);
    setQualificationAndExperience(job.qualificationAndExperience || "");
    setExperienceMin(job.experienceMin);
    setExperienceMax(job.experienceMax);
    setSalaryLabel(job.salaryLabel);
    setResponsibilitiesText(toTextareaFromArray(job.responsibilities));
    setRequirementsText(toTextareaFromArray(job.requirements));
    setGoodToHaveText(toTextareaFromArray(job.goodToHave));

    setFormError(null);
    setOpen(true);
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to load jobs.");
        setLoading(false);
        return;
      }

      const list = Array.isArray(data?.data) ? data.data : [];
      setItems(list);
    } catch {
      setError("Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((j) => {
      if (typeFilter !== "all" && j.type !== typeFilter) return false;
      if (activeFilter === "active" && !j.isActive) return false;
      if (activeFilter === "inactive" && j.isActive) return false;

      if (query) {
        const hay = `${j.title} ${j.description} ${j.location} ${j.salaryLabel} ${
          j.qualificationAndExperience || ""
        }`.toLowerCase();
        if (!hay.includes(query)) return false;
      }

      return true;
    });
  }, [items, q, typeFilter, activeFilter]);

  const toggleJob = async (id: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const ok = confirm("Toggle job active/inactive?");
    if (!ok) return;

    const res = await fetch(`${API}/admin/jobs/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Failed to toggle job.");
      return;
    }

    fetchJobs();
  };

  const deleteJob = async (id: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const ok = confirm("Delete this job permanently?");
    if (!ok) return;

    const res = await fetch(`${API}/admin/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Failed to delete job.");
      return;
    }

    fetchJobs();
  };

  const saveJob = async () => {
    setFormError(null);

    if (title.trim().length < 3) return setFormError("Title must be at least 3 characters.");
    if (description.trim().length < 10) {
      return setFormError("Description must be at least 10 characters.");
    }
    if (!location.trim()) return setFormError("Location is required.");
    if (!qualificationAndExperience.trim()) {
      return setFormError("Qualification & Experience is required.");
    }
    if (experienceMax < experienceMin) {
      return setFormError("Experience max cannot be less than experience min.");
    }
    if (!salaryLabel.trim()) return setFormError("Salary is required.");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      type,
      location: location.trim(),
      qualificationAndExperience: qualificationAndExperience.trim(),
      experienceMin: Number(experienceMin),
      experienceMax: Number(experienceMax),
      salaryLabel: salaryLabel.trim(),
      responsibilities: toArrayFromTextarea(responsibilitiesText),
      requirements: toArrayFromTextarea(requirementsText),
      goodToHave: toArrayFromTextarea(goodToHaveText),
    };

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return setFormError("Not logged in.");

      const url =
        mode === "create" ? `${API}/admin/jobs` : `${API}/admin/jobs/${editing?._id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setFormError(data?.message || "Failed to save job.");
        return;
      }

      setOpen(false);
      resetForm();
      fetchJobs();
    } catch {
      setFormError("Server not reachable.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[var(--shadow)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Panel
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white">Jobs Management</h2>
            <p className="mt-2 text-sm text-white/65">
              Create, update, activate, deactivate, and manage job listings from one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={fetchJobs}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]"
            >
              <Plus className="h-4 w-4" />
              Add Job
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <Search className="h-4 w-4 text-white/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, location, salary, qualification..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="mt-1 w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="all" className="bg-[#111] text-white">
                All
              </option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#111] text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="mt-1 w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="all" className="bg-[#111] text-white">
                All
              </option>
              <option value="active" className="bg-[#111] text-white">
                Active only
              </option>
              <option value="inactive" className="bg-[#111] text-white">
                Inactive only
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 shadow-[var(--shadow)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <p className="text-sm font-semibold text-white">
            Showing: <span className="text-[var(--brand)]">{filtered.length}</span>
            <span className="text-white/45"> / {items.length}</span>
          </p>
          <p className="text-xs text-white/45">All jobs list</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-white/65">Loading jobs...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-white/65">No jobs found.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {filtered.map((j) => (
              <div key={j._id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 text-base font-bold text-white">
                        <Briefcase className="h-5 w-5 text-[var(--brand)]" />
                        {j.title}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          j.isActive
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/55"
                        }`}
                      >
                        {j.isActive ? "Active" : "Inactive"}
                      </span>

                      <span className="rounded-full border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand-hover)]">
                        {formatType(j.type)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-white/70">{j.description}</p>

                    {j.qualificationAndExperience ? (
                      <p className="mt-3 text-sm text-white/80">
                        <span className="font-semibold text-white">
                          Qualification & Experience:
                        </span>{" "}
                        <span className="text-white/65">{j.qualificationAndExperience}</span>
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-white/55">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/35" />
                        {j.location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/35" />
                        {j.experienceMin}–{j.experienceMax} yrs
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <BadgeIndianRupee className="h-4 w-4 text-white/35" />
                        {j.salaryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                    <button
                      onClick={() => openEdit(j)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/8"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => toggleJob(j._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/8"
                    >
                      <Power className="h-4 w-4" />
                      Toggle
                    </button>

                    <button
                      onClick={() => deleteJob(j._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs font-semibold text-white/50">Responsibilities</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {j.responsibilities?.length || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs font-semibold text-white/50">Requirements</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {j.requirements?.length || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs font-semibold text-white/50">Good to have</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {j.goodToHave?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="h-1.5 w-full bg-[var(--brand)]" />

            <div className="flex items-start justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
                  {mode === "create" ? "Create Job" : "Edit Job"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {mode === "create" ? "Add a new role" : "Update role details"}
                </h3>
                <p className="mt-1 text-xs text-white/45">
                  Use one new line for each responsibility, requirement, or preferred skill.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/8"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto px-6 pb-6 custom-scrollbar">
              {formError ? (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                  {formError}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="AI Trainer / Frontend Developer / Career Counsellor"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Role Overview *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Write a short summary of the role and expected outcome."
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as JobType)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#111] text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Location *</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ahmedabad / Remote / On-site"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">
                    Qualification & Experience *
                  </label>
                  <textarea
                    value={qualificationAndExperience}
                    onChange={(e) => setQualificationAndExperience(e.target.value)}
                    rows={3}
                    placeholder="Mention required education, skill level, and years of experience."
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Minimum Experience *
                  </label>
                  <input
                    type="number"
                    value={experienceMin}
                    min={0}
                    max={50}
                    onChange={(e) => setExperienceMin(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Maximum Experience *
                  </label>
                  <input
                    type="number"
                    value={experienceMax}
                    min={0}
                    max={50}
                    onChange={(e) => setExperienceMax(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Salary *</label>
                  <input
                    value={salaryLabel}
                    onChange={(e) => setSalaryLabel(e.target.value)}
                    placeholder="Not disclosed / As per role / ₹ 3L - 5L"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Key Responsibilities</label>
                  <textarea
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    rows={5}
                    placeholder="Write one responsibility per line."
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Requirements</label>
                  <textarea
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    rows={5}
                    placeholder="Write one requirement per line."
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Good to Have</label>
                  <textarea
                    value={goodToHaveText}
                    onChange={(e) => setGoodToHaveText(e.target.value)}
                    rows={4}
                    placeholder="Write one preferred skill per line."
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--brand)]/60 focus:ring-1 focus:ring-[var(--brand)]/40"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  Cancel
                </button>

                <button
                  onClick={saveJob}
                  disabled={saving}
                  className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)] disabled:opacity-60"
                >
                  {saving ? "Saving..." : mode === "create" ? "Create Job" : "Update Job"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}