"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  User,
  Phone,
  Mail,
  Building2,
  MessageSquare,
  Calendar,
  Paperclip,
  X,
  Download,
  Filter,
  Trash2,
} from "lucide-react";

type Attachment = {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
};

type Enquiry = {
  _id: string;
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
  attachment?: Attachment | null;
  createdAt: string;
};

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function bytesToSize(bytes: number) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes, i = 0;
  while (v >= 1024 && i < units.length - 1) { v = v / 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getFileUrl(apiBase: string | undefined, filePath: string) {
  if (!apiBase) return "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  const normalized = filePath.replace(/\\/g, "/");
  const idx = normalized.toLowerCase().lastIndexOf("uploads/");
  if (idx !== -1) return `${origin}/${normalized.slice(idx)}`;
  return `${origin}/${normalized}`;
}

function startOfDayISO(d: string) { return new Date(`${d}T00:00:00`).getTime(); }
function endOfDayISO(d: string) { return new Date(`${d}T23:59:59.999`).getTime(); }

/* ── Shared styles ── */
const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
  boxShadow: "var(--shadow-sm)",
};

const surface2: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--border-strong)",
};

const surface3: React.CSSProperties = {
  background: "var(--surface-3)",
  border: "1px solid var(--border)",
};

export default function AdminEnquiriesPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) { setError("Not logged in."); setLoading(false); return; }
      const res = await fetch(`${API}/admin/enquiries`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setError(data?.message || "Failed to load enquiries."); setLoading(false); return; }
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setItems(list);
    } catch { setError("Server not reachable. Please try again."); }
    finally { setLoading(false); }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) { alert("Not logged in."); return; }
      const res = await fetch(`${API}/admin/enquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { alert(data?.message || "Failed to delete enquiry."); return; }
      setItems((prev) => prev.filter((x) => x._id !== id));
      setSelected((prev) => (prev?._id === id ? null : prev));
    } catch { alert("Server not reachable. Please try again."); }
    finally { setDeletingId(null); }
  };

  useEffect(() => { fetchEnquiries(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const hasFrom = Boolean(fromDate), hasTo = Boolean(toDate);
    const fromMs = hasFrom ? startOfDayISO(fromDate) : null;
    const toMs = hasTo ? endOfDayISO(toDate) : null;
    return items.filter((e) => {
      if (query) {
        const hay = `${e.fullName} ${e.company || ""} ${e.phone} ${e.email || ""} ${e.message}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (hasFrom || hasTo) {
        const ms = new Date(e.createdAt).getTime();
        if (hasFrom && fromMs !== null && ms < fromMs) return false;
        if (hasTo && toMs !== null && ms > toMs) return false;
      }
      return true;
    });
  }, [items, q, fromDate, toDate]);

  const exportToExcel = () => {
    if (!filtered.length) { alert("No enquiries found for the selected filter."); return; }
    const rows = filtered.map((e, idx) => ({
      SNo: idx + 1, Date: formatDate(e.createdAt), FullName: e.fullName,
      Company: e.company || "", Phone: e.phone, Email: e.email || "",
      Message: e.message, HasAttachment: e.attachment ? "Yes" : "No",
      AttachmentName: e.attachment?.originalName || "",
      AttachmentUrl: e.attachment ? getFileUrl(API, e.attachment.path) : "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 6 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 24 }, { wch: 60 }, { wch: 14 }, { wch: 28 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
    XLSX.writeFile(wb, `enquiries_${fromDate || "all"}_to_${toDate || "all"}.xlsx`);
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
    <>
      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="badge badge-brand" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
              Admin
            </span>
            <h2 className="mt-3 text-2xl" style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
              Enquiries
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              View website enquiry submissions and download attachments.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button onClick={fetchEnquiries} className="btn btn-outline btn-md">
              Refresh
            </button>
            <button onClick={exportToExcel} className="btn btn-primary btn-md">
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Search */}
        <div
          className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ ...surface2, transition: "border-color 160ms ease, box-shadow 160ms ease" }}
          onFocus={onFocus} onBlur={onBlur} tabIndex={-1}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, company, phone, email or message..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        {/* Date filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div
            className="rounded-xl px-3 py-2.5"
            style={{ ...surface2, transition: "border-color 160ms ease, box-shadow 160ms ease" }}
            onFocus={onFocus} onBlur={onBlur} tabIndex={-1}
          >
            <label className="block text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}>
              From Date
            </label>
            <input
              type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text)", colorScheme: "dark" }}
            />
          </div>

          <div
            className="rounded-xl px-3 py-2.5"
            style={{ ...surface2, transition: "border-color 160ms ease, box-shadow 160ms ease" }}
            onFocus={onFocus} onBlur={onBlur} tabIndex={-1}
          >
            <label className="block text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}>
              To Date
            </label>
            <input
              type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text)", colorScheme: "dark" }}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => { setFromDate(""); setToDate(""); }}
              className="btn btn-outline btn-md w-full"
            >
              <Filter className="h-4 w-4" />
              Clear Date Filter
            </button>
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <div className="rounded-2xl" style={cardStyle}>
        {/* List header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Showing:{" "}
            <span style={{ color: "var(--brand)" }}>{filtered.length}</span>
            <span style={{ color: "var(--text-dim)" }}> / {items.length}</span>
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>Latest first</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>Loading enquiries...</div>
        ) : error ? (
          <div className="p-6 text-sm font-semibold" style={{ color: "rgba(239,68,68,0.90)" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>No enquiries found.</div>
        ) : (
          <div style={{ borderTop: "none" }}>
            {filtered.map((e, idx) => (
              <button
                key={e._id}
                onClick={() => setSelected(e)}
                className="w-full text-left px-6 py-4 transition-all duration-150"
                style={{
                  borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  background: "transparent",
                }}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "var(--brand-soft)"; }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--text)" }}>
                        <User className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                        {e.fullName}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Phone className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                        {e.phone}
                      </span>
                      {e.email && (
                        <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Mail className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {e.email}
                        </span>
                      )}
                      {e.company && (
                        <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Building2 className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {e.company}
                        </span>
                      )}
                      {e.attachment && (
                        <span className="badge badge-brand text-xs">
                          <Paperclip className="h-3 w-3" />
                          Attachment
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--brand)" }} />
                      <p className="line-clamp-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        {e.message}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                    <Calendar className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                    <span>{formatDate(e.createdAt)}</span>

                    <button
                      type="button"
                      onClick={(ev) => { ev.stopPropagation(); deleteEnquiry(e._id); }}
                      disabled={deletingId === e._id}
                      className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-60"
                      style={{ border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.80)" }}
                      onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.10)"; }}
                      onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
                      aria-label="Delete enquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 p-4 sm:p-6">
          {/* Backdrop */}
          <button
            aria-label="Close"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.70)" }}
            onClick={() => setSelected(null)}
          />

          {/* Modal card */}
          <div
            className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl max-h-[90vh]"
            style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow)" }}
            role="dialog" aria-modal="true"
          >
            {/* Top accent bar */}
            <div className="h-1" style={{ background: "var(--brand)" }} />

            {/* Modal header */}
            <div
              className="flex items-start justify-between gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <span className="badge badge-brand" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
                  Enquiry Detail
                </span>
                <h3 className="mt-3 text-lg" style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
                  {selected.fullName}
                </h3>
                <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="btn btn-icon"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body (scrollable) */}
            <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Phone", value: selected.phone },
                  { label: "Email", value: selected.email || "—" },
                  { label: "Company", value: selected.company || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-4" style={surface3}>
                    <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}>
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>{value}</p>
                  </div>
                ))}

                <div className="rounded-xl p-4" style={surface3}>
                  <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}>
                    Attachment
                  </p>
                  {selected.attachment ? (
                    <a
                      href={getFileUrl(API, selected.attachment.path)}
                      target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                      style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid rgba(255,107,0,0.22)", textDecoration: "none" }}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      <Paperclip className="h-4 w-4" />
                      {selected.attachment.originalName}
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                        ({bytesToSize(selected.attachment.size)})
                      </span>
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>—</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mt-4 rounded-xl p-4" style={surface3}>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Requirement / Message
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {selected.message}
                </p>
              </div>

              {/* Modal actions */}
              <div className="mt-5 flex justify-end gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => deleteEnquiry(selected._id)}
                  disabled={deletingId === selected._id}
                  className="btn btn-sm disabled:opacity-60"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.22)",
                    color: "rgba(239,68,68,0.88)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.16)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>

                <button onClick={() => setSelected(null)} className="btn btn-primary btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}