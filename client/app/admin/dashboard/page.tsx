/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, FileText, MessageSquare, Star } from "lucide-react";

type Stats = {
  activeJobs: number;
  applications: number;
  enquiries: number;
  feedback: number;
};

type ActivityItem = {
  type: "job" | "application" | "enquiry" | "feedback";
  title: string;
  meta: string;
  createdAt: string;
};

type DashboardResponse = {
  message: string;
  data: {
    stats: Stats;
    latest: ActivityItem[];
  };
};

export default function AdminDashboardPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    applications: 0,
    enquiries: 0,
    feedback: 0,
  });

  const [latest, setLatest] = useState<ActivityItem[]>([]);

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setErr(null);

    try {
      if (!API) {
        setErr("NEXT_PUBLIC_API_BASE_URL missing.");
        setLoading(false);
        return;
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

      if (!token) {
        setErr("Admin token missing. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/admin/dashboard`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json: DashboardResponse | null = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(json?.message || "Failed to load dashboard.");
        setLoading(false);
        return;
      }

      setStats(json?.data?.stats ?? stats);
      setLatest(Array.isArray(json?.data?.latest) ? json!.data.latest : []);
    } catch {
      setErr("Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge badge-brand" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
              Overview
            </span>
            <h2
              className="mt-3 text-2xl"
              style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}
            >
              Dashboard
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Quick access to job management and latest submissions.
            </p>

            {loading && (
              <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
                Loading dashboard...
              </p>
            )}
            {err && (
              <p
                className="mt-2 text-sm font-semibold"
                style={{ color: "rgba(239,68,68,0.90)" }}
              >
                {err}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href="/admin/jobs"
              className="btn btn-primary btn-md"
            >
              Manage Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Jobs"    value={loading ? "—" : String(stats.activeJobs)}   hint="Currently live roles" />
        <KpiCard title="Applications"   value={loading ? "—" : String(stats.applications)} hint="Total job applications" />
        <KpiCard title="Enquiries"      value={loading ? "—" : String(stats.enquiries)}    hint="Website enquiries" />
        <KpiCard title="Feedback"       value={loading ? "—" : String(stats.feedback)}     hint="Customer feedback" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 lg:grid-cols-2">
        <QuickCard title="Jobs"         desc="Create, update, enable/disable job postings."         href="/admin/jobs"         icon={<Briefcase  className="h-5 w-5" style={{ color: "var(--brand)" }} />} />
        <QuickCard title="Applications" desc="View job applicants and download attachments."         href="/admin/application"  icon={<FileText   className="h-5 w-5" style={{ color: "var(--ai-cyan)" }} />} />
        <QuickCard title="Enquiries"    desc="Track website enquiry form submissions."               href="/admin/enquiries"    icon={<MessageSquare className="h-5 w-5" style={{ color: "var(--ai-purple)" }} />} />
        <QuickCard title="Feedback"     desc="See feedback messages and ratings."                   href="/admin/feedback"     icon={<Star       className="h-5 w-5" style={{ color: "var(--brand)" }} />} />
      </div>

      {/* Latest Activity */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-lg"
            style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}
          >
            Latest Activity
          </h3>
          <button
            type="button"
            onClick={fetchDashboard}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: "12px", color: "var(--text-dim)" }}
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <ActivityRow title="Loading..." meta="Fetching latest submissions from API." />
          ) : latest.length === 0 ? (
            <ActivityRow title="No recent activity" meta="Once submissions arrive, they will appear here." />
          ) : (
            latest.slice(0, 6).map((a, idx) => (
              <ActivityRow
                key={idx}
                title={a.title}
                meta={`${a.meta} • ${fmtDate(a.createdAt)}`}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function KpiCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {title}
      </p>
      <p
        className="mt-2 text-3xl"
        style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
        {hint}
      </p>
    </div>
  );
}

function QuickCard({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl p-6 transition-all duration-150 hover:-translate-y-0.5"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        boxShadow: "var(--shadow-sm)",
        display: "block",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,0,0.35)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow-brand)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Icon pill */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-soft)", border: "1px solid rgba(255,107,0,0.18)" }}
          >
            {icon}
          </div>
          <div>
            <p
              className="text-base"
              style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              {title}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              {desc}
            </p>
          </div>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 transition-all duration-150 group-hover:translate-x-0.5"
          style={{ color: "var(--text-dim)" }}
        />
      </div>
    </Link>
  );
}

function ActivityRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
        {title}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
        {meta}
      </p>
    </div>
  );
}