/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Calendar,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

type ApiApplication = {
  _id: string;
  jobId?: string;
  jobTitle: string;
  fullName: string;
  phone: string;
  email: string;
  experience?: string;
  location?: string;
  noticePeriod?: string;
  message?: string;
  resumeUrl: string;
  resumeName: string;
  resumeMime: string;
  resumeSize: number;
  createdAt: string;
};

type ApiListResponse = {
  message: string;
  data: ApiApplication[];
  meta: { page: number; limit: number; total: number };
};

function formatDateTime(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return "-";
  const sizes = ["B", "KB", "MB", "GB"];
  let i = 0, v = bytes;
  while (v >= 1024 && i < sizes.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  const headers = Object.keys(rows[0] || {});
  const escape = (val: any) => {
    const s = String(val ?? "");
    const t = s.replace(/"/g, '""');
    if (/[",\n]/.test(t)) return `"${t}"`;
    return t;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function normalizeApiBase(api?: string) {
  if (!api) return null;
  return api.endsWith("/") ? api.slice(0, -1) : api;
}

function buildUploadsBaseFromApi(api: string) {
  return api.replace(/\/api$/, "");
}

/* ── Shared input wrapper style ── */
const inputWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 12,
  border: "1px solid var(--border-strong)",
  background: "rgba(255,255,255,0.03)",
  padding: "10px 12px",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
};

export default function AdminApplicationsPage() {
  const API = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);
  const UPLOADS_BASE = API ? buildUploadsBaseFromApi(API) : "";

  const [items, setItems] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [jobId, setJobId] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchList = async (p = page) => {
    setLoading(true); setErr(null);
    try {
      if (!API) { setErr("NEXT_PUBLIC_API_BASE_URL missing."); setLoading(false); return; }
      const params = new URLSearchParams();
      params.set("page", String(p)); params.set("limit", String(limit));
      if (q.trim()) params.set("q", q.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (jobId.trim()) params.set("jobId", jobId.trim());
      const res = await fetch(`${API}/careers/admin?${params.toString()}`, { cache: "no-store" });
      const data: ApiListResponse | null = await res.json().catch(() => null);
      if (!res.ok) { setErr((data as any)?.message || "Failed to load applications."); setLoading(false); return; }
      setItems(Array.isArray(data?.data) ? data!.data : []);
      setTotal(data?.meta?.total ?? 0);
    } catch { setErr("Server not reachable."); } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(page); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  const applyFilters = () => { setPage(1); fetchList(1); };
  const clearFilters = () => { setQ(""); setFrom(""); setTo(""); setJobId(""); setPage(1); setTimeout(() => fetchList(1), 0); };

  const exportCSV = async () => {
    if (!API) return alert("NEXT_PUBLIC_API_BASE_URL missing.");
    const params = new URLSearchParams();
    params.set("page", "1"); params.set("limit", "200");
    if (q.trim()) params.set("q", q.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (jobId.trim()) params.set("jobId", jobId.trim());
    const res = await fetch(`${API}/applications/admin?${params.toString()}`, { cache: "no-store" });
    const data: ApiListResponse | null = await res.json().catch(() => null);
    if (!res.ok) return alert((data as any)?.message || "Export failed.");
    const rows = (data?.data || []).map((a) => ({
      Date: a.createdAt, JobTitle: a.jobTitle, FullName: a.fullName,
      Phone: a.phone, Email: a.email, Experience: a.experience || "",
      Location: a.location || "", NoticePeriod: a.noticePeriod || "",
      Message: a.message || "", ResumeName: a.resumeName || "",
      ResumeUrl: a.resumeUrl ? `${UPLOADS_BASE}${a.resumeUrl}` : "",
    }));
    downloadCSV(`applications_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  const deleteApplication = async (id: string) => {
    if (!API) return alert("NEXT_PUBLIC_API_BASE_URL missing.");
    if (!window.confirm("Delete this application? This action cannot be undone.")) return;
    setDeletingId(id); setErr(null);
    try {
      const res = await fetch(`${API}/careers/admin/${id}`, { method: "DELETE", cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setErr((data as any)?.message || "Failed to delete application."); return; }
      setItems((prev) => prev.filter((x) => x._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      setTimeout(() => { setItems((prev) => { if (prev.length === 0 && page > 1) setPage((p) => Math.max(1, p - 1)); return prev; }); }, 0);
    } catch { setErr("Server not reachable."); } finally { setDeletingId(null); }
  };

  /* ── Focus ring helpers ── */
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = "rgba(255,107,0,0.55)";
    el.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.18)";
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = "var(--border-strong)";
    el.style.boxShadow = "none";
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge badge-brand" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
              Applications
            </span>
            <h1 className="mt-3 text-2xl" style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
              Job Applications
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Filter by date and export to CSV (Excel).
            </p>
          </div>

          <button onClick={exportCSV} className="btn btn-outline btn-md">
            <Download className="h-4 w-4" style={{ color: "var(--brand)" }} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="grid gap-4 lg:grid-cols-4">

          {/* Search */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            <label className="label">Search (name / email / phone / job title)</label>
            <div style={inputWrap} onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
              <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
            </div>
          </div>

          {/* From date */}
          <div className="flex flex-col gap-1">
            <label className="label">From date</label>
            <div style={inputWrap} onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
              <Calendar className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
              <input
                type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text)", colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1">
            <label className="label">To date</label>
            <div style={inputWrap} onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
              <Calendar className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
              <input
                type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text)", colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* Job ID */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            <label className="label">JobId (optional)</label>
            <input
              value={jobId} onChange={(e) => setJobId(e.target.value)}
              placeholder="Paste jobId to filter"
              className="input text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>

          {/* Action buttons */}
          <div className="lg:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
            <button onClick={applyFilters} className="btn btn-primary btn-md">
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn btn-outline btn-md">
              Clear
            </button>
          </div>
        </div>

        {err && (
          <div
            className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "rgba(239,68,68,0.90)" }}
          >
            {err}
          </div>
        )}
      </div>

      {/* ── List ── */}
      <div
        className="rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-sm)" }}
      >
        {/* List header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Applications</p>
          <span className="badge" style={{ fontSize: "11px" }}>Total: {total}</span>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              No applications found for selected filters.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((a) => {
                const resumeLink = a.resumeUrl ? `${UPLOADS_BASE}${a.resumeUrl}` : "#";
                return (
                  <div
                    key={a._id}
                    className="rounded-2xl p-5"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)" }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          {a.fullName}
                        </p>
                        <p className="mt-1 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                          {a.jobTitle}
                        </p>

                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2" style={{ color: "var(--text-muted)" }}>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Email:</span> {a.email}</div>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Phone:</span> {a.phone}</div>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Experience:</span> {a.experience || "-"}</div>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Location:</span> {a.location || "-"}</div>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Notice:</span> {a.noticePeriod || "-"}</div>
                          <div><span className="font-semibold" style={{ color: "var(--text-dim)" }}>Date:</span> {formatDateTime(a.createdAt)}</div>
                        </div>

                        {a.message && (
                          <div
                            className="mt-3 rounded-xl px-4 py-3"
                            style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
                          >
                            <p className="text-xs font-semibold uppercase" style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}>
                              Message
                            </p>
                            <p className="mt-2 text-sm whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
                              {a.message}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 sm:items-end shrink-0">
                        <a
                          href={resumeLink} target="_blank" rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ textDecoration: "none" }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Resume
                        </a>

                        <a
                          href={resumeLink} download
                          className="btn btn-outline btn-sm"
                          style={{ textDecoration: "none" }}
                        >
                          <Download className="h-4 w-4" style={{ color: "var(--brand)" }} />
                          Download
                        </a>

                        <button
                          onClick={() => deleteApplication(a._id)}
                          disabled={deletingId === a._id}
                          className="btn btn-sm"
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.22)",
                            color: "rgba(239,68,68,0.88)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.16)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === a._id ? "Deleting..." : "Delete"}
                        </button>

                        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                          {a.resumeName} • {formatBytes(a.resumeSize)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        <div
          className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn btn-outline btn-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn btn-outline btn-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}