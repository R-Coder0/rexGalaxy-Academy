"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Phone,
  Mail,
  BookOpen,
  MapPin,
  Calendar,
  X,
  Trash2,
  Ticket,
} from "lucide-react";

type RegistrationStatus = "new" | "contacted" | "enrolled" | "rejected";

type Registration = {
  _id: string;
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  status: RegistrationStatus;
  createdAt: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const statusOptions: RegistrationStatus[] = [
  "new",
  "contacted",
  "enrolled",
  "rejected",
];

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

function getStatusColors(status: RegistrationStatus) {
  switch (status) {
    case "enrolled":
      return {
        background: "rgba(16,185,129,0.10)",
        border: "1px solid rgba(16,185,129,0.25)",
        color: "#6ee7b7",
      };
    case "contacted":
      return {
        background: "rgba(59,130,246,0.10)",
        border: "1px solid rgba(59,130,246,0.25)",
        color: "#93c5fd",
      };
    case "rejected":
      return {
        background: "rgba(239,68,68,0.10)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: "#fca5a5",
      };
    default:
      return {
        background: "rgba(255,107,0,0.10)",
        border: "1px solid rgba(255,107,0,0.22)",
        color: "#fdba74",
      };
  }
}

export default function AdminRegistrationPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RegistrationStatus>("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/registrations`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Failed to load registrations.");
        setLoading(false);
        return;
      }

      const list = Array.isArray(data?.data) ? data.data : [];
      setItems(list);
    } catch {
      setError("Server not reachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: RegistrationStatus) => {
    try {
      setSavingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/registrations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.message || "Failed to update status.");
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      setSelected((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
    } catch {
      alert("Server not reachable. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/registrations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.message || "Failed to delete registration.");
        return;
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
      setSelected((prev) => (prev?._id === id ? null : prev));
    } catch {
      alert("Server not reachable. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = [
        item.registrationCode,
        item.fullName,
        item.email,
        item.phone,
        item.course,
        item.city,
        item.country,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, q, statusFilter]);

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
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className="badge badge-brand"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              Admin
            </span>
            <h1
              className="mt-3 text-2xl"
              style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}
            >
              Registrations
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Manage online registration submissions and update their status.
            </p>
          </div>

          <button onClick={fetchRegistrations} className="btn btn-outline btn-md">
            Refresh
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px]">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ ...surface2, transition: "border-color 160ms ease, box-shadow 160ms ease" }}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={-1}
          >
            <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-dim)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by code, name, email, phone, course..."
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text)" }}
            />
          </div>

          <div
            className="rounded-xl px-3 py-2.5"
            style={{ ...surface2, transition: "border-color 160ms ease, box-shadow 160ms ease" }}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={-1}
          >
            <label
              className="block text-[11px] font-semibold uppercase"
              style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
            >
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | RegistrationStatus)
              }
              className="mt-1 w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text)", colorScheme: "dark" }}
            >
              <option value="all">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl" style={cardStyle}>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Showing: <span style={{ color: "var(--brand)" }}>{filtered.length}</span>
            <span style={{ color: "var(--text-dim)" }}> / {items.length}</span>
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Latest first
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading registrations...
          </div>
        ) : error ? (
          <div
            className="p-6 text-sm font-semibold"
            style={{ color: "rgba(239,68,68,0.90)" }}
          >
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
            No registrations found.
          </div>
        ) : (
          <div>
            {filtered.map((item, idx) => {
              const statusStyle = getStatusColors(item.status);

              return (
                <button
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className="w-full px-6 py-4 text-left transition-all duration-150"
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    background: "transparent",
                  }}
                  onMouseEnter={(ev) => {
                    (ev.currentTarget as HTMLElement).style.background = "var(--brand-soft)";
                  }}
                  onMouseLeave={(ev) => {
                    (ev.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span
                          className="inline-flex items-center gap-2 text-sm font-bold"
                          style={{ color: "var(--text)" }}
                        >
                          <User className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {item.fullName}
                        </span>
                        <span
                          className="inline-flex items-center gap-2 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Ticket className="h-4 w-4" style={{ color: "var(--brand)" }} />
                          {item.registrationCode}
                        </span>
                        <span
                          className="inline-flex items-center gap-2 text-xs"
                          style={statusStyle}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <span
                          className="inline-flex items-center gap-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Mail className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {item.email}
                        </span>
                        <span
                          className="inline-flex items-center gap-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Phone className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {item.phone}
                        </span>
                        <span
                          className="inline-flex items-center gap-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <BookOpen className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                          {item.course}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={item.status}
                        onClick={(ev) => ev.stopPropagation()}
                        onChange={(ev) =>
                          updateStatus(item._id, ev.target.value as RegistrationStatus)
                        }
                        disabled={savingId === item._id}
                        className="rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                        style={{
                          ...surface3,
                          color: "var(--text)",
                          minWidth: "130px",
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <span
                        className="inline-flex items-center gap-2 text-xs"
                        style={{ color: "var(--text-dim)" }}
                      >
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.createdAt)}
                      </span>

                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          deleteRegistration(item._id);
                        }}
                        disabled={deletingId === item._id}
                        className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-60"
                        style={{
                          border: "1px solid rgba(239,68,68,0.25)",
                          color: "rgba(239,68,68,0.80)",
                        }}
                        onMouseEnter={(ev) => {
                          (ev.currentTarget as HTMLElement).style.background =
                            "rgba(239,68,68,0.10)";
                        }}
                        onMouseLeave={(ev) => {
                          (ev.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                        aria-label="Delete registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] p-4 sm:p-6">
          <button
            aria-label="Close"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.70)" }}
            onClick={() => setSelected(null)}
          />

          <div
            className="absolute left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow)",
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-1" style={{ background: "var(--brand)" }} />

            <div
              className="flex items-start justify-between gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <span
                  className="badge badge-brand"
                  style={{ fontSize: "11px", letterSpacing: "0.18em" }}
                >
                  Registration Detail
                </span>
                <h3
                  className="mt-3 text-lg"
                  style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}
                >
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

            <div className="custom-scrollbar max-h-[calc(90vh-120px)] overflow-y-auto px-6 pb-6">
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailCard label="Registration Code" value={selected.registrationCode} />
                <DetailCard label="Status" value={selected.status} />
                <DetailCard label="Email" value={selected.email} />
                <DetailCard label="Phone" value={selected.phone} />
                <DetailCard label="Course" value={selected.course} />
                <DetailCard
                  label="Location"
                  value={`${selected.city}, ${selected.country} - ${selected.zipcode}`}
                />
              </div>

              <div className="mt-4 rounded-xl p-4" style={surface3}>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Address
                </p>
                <p
                  className="mt-2 whitespace-pre-wrap text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {selected.address}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: "var(--brand)" }} />
                  <span className="text-sm" style={{ color: "var(--text-dim)" }}>
                    {selected.city}, {selected.country}
                  </span>
                </div>

                <div className="flex gap-2">
                  <select
                    value={selected.status}
                    onChange={(ev) =>
                      updateStatus(selected._id, ev.target.value as RegistrationStatus)
                    }
                    disabled={savingId === selected._id}
                    className="rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ ...surface3, color: "var(--text)" }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteRegistration(selected._id)}
                    disabled={deletingId === selected._id}
                    className="btn btn-sm disabled:opacity-60"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.22)",
                      color: "rgba(239,68,68,0.88)",
                    }}
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
        </div>
      )}
    </>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>
        {value}
      </p>
    </div>
  );
}
