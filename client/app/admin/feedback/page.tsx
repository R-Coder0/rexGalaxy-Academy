"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  User,
  MessageSquare,
  Calendar,
  X,
  Trash2,
} from "lucide-react";

type Feedback = {
  _id: string;
  fullName: string;
  email: string;
  organization: string;
  message: string;
  createdAt: string;
};

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
  boxShadow: "var(--shadow-sm)",
};

const surface3: React.CSSProperties = {
  background: "var(--surface-3)",
  border: "1px solid var(--border)",
};

export default function AdminFeedbackPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((f) =>
      `${f.fullName} ${f.email} ${f.organization} ${f.message}`.toLowerCase().includes(query)
    );
  }, [items, q]);

  const fetchFeedback = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) { setError("Not logged in."); setLoading(false); return; }
      const res = await fetch(`${API}/admin/feedback`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setError(data?.message || "Failed to load feedback."); setLoading(false); return; }
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setItems(list);
    } catch { setError("Server not reachable. Please try again."); }
    finally { setLoading(false); }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) { alert("Not logged in."); return; }
      const res = await fetch(`${API}/admin/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { alert(data?.message || "Failed to delete feedback."); return; }
      setItems((prev) => prev.filter((x) => x._id !== id));
      setSelected((prev) => (prev?._id === id ? null : prev));
    } catch { alert("Server not reachable. Please try again."); }
    finally { setDeletingId(null); }
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge badge-brand" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
              Admin
            </span>
            <h1
              className="mt-3 text-2xl"
              style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}
            >
              Feedback
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              View and manage feedback submitted from the website.
            </p>
          </div>

          <button onClick={fetchFeedback} className="btn btn-outline btn-md">
            Refresh
          </button>
        </div>

        {/* Search */}
        <div
          className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-strong)",
            transition: "border-color 160ms ease, box-shadow 160ms ease",
          }}
          onFocus={onFocus} onBlur={onBlur} tabIndex={-1}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, organization or message..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
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
            Total:{" "}
            <span style={{ color: "var(--brand)" }}>{filtered.length}</span>
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>Latest first</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading feedback...
          </div>
        ) : error ? (
          <div className="p-6 text-sm font-semibold" style={{ color: "rgba(239,68,68,0.90)" }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
            No feedback found.
          </div>
        ) : (
          <div>
            {filtered.map((f, idx) => (
              <button
                key={f._id}
                onClick={() => setSelected(f)}
                className="w-full text-left px-6 py-4 transition-all duration-150"
                style={{
                  background: "transparent",
                  borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "var(--brand-soft)"; }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    {/* Name + email row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        className="inline-flex items-center gap-2 text-sm font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        <User className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                        {f.fullName}
                      </span>
                      <span
                        className="hidden sm:inline text-xs"
                        style={{ color: "var(--text-dim)" }}
                      >•</span>
                      <span
                        className="inline-flex items-center gap-2 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Mail className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                        {f.email}
                      </span>
                    </div>

                    {/* Organization */}
                    <div
                      className="mt-2 flex items-center gap-2 text-sm font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" style={{ color: "var(--brand)" }} />
                      <span className="truncate">{f.organization}</span>
                    </div>

                    {/* Message preview */}
                    <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--text-dim)" }}>
                      {f.message}
                    </p>
                  </div>

                  {/* Date + delete */}
                  <div
                    className="shrink-0 flex items-center gap-2 text-xs"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <Calendar className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                    <span>{formatDate(f.createdAt)}</span>

                    <button
                      type="button"
                      onClick={(ev) => { ev.stopPropagation(); deleteFeedback(f._id); }}
                      disabled={deletingId === f._id}
                      className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-60"
                      style={{ border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.80)" }}
                      onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.10)"; }}
                      onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
                      aria-label="Delete feedback"
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
        <div className="fixed inset-0 z-[100] p-4 sm:p-6">
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
            role="dialog"
            aria-modal="true"
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
                  Feedback Detail
                </span>
                <h3
                  className="mt-3 text-lg"
                  style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}
                >
                  {selected.organization}
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
              {/* Name + email card */}
              <div className="mt-5 rounded-xl p-4" style={surface3}>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  {selected.fullName}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
                  {selected.email}
                </p>
              </div>

              {/* Message card */}
              <div className="mt-4 rounded-xl p-4" style={surface3}>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Message
                </p>
                <p
                  className="mt-2 whitespace-pre-wrap text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {selected.message}
                </p>
              </div>

              {/* Modal actions */}
              <div className="mt-5 flex justify-end gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => deleteFeedback(selected._id)}
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

                <button
                  onClick={() => setSelected(null)}
                  className="btn btn-primary btn-sm"
                >
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