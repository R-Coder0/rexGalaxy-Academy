"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  LogOut,
  UserPlus,
  ScrollText,
  FileBadge2,
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Applications", href: "/admin/application", icon: FileText },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Registrations", href: "/admin/registration", icon: UserPlus },
  { name: "Offer Letters", href: "/admin/offer-letter", icon: ScrollText },
  { name: "Experience Letters", href: "/admin/experience-letter", icon: FileBadge2 },
  { name: "Course Details", href: "/admin/course-details", icon: FileText },
  { name: "Course Menu", href: "/admin/course-menu", icon: MessageSquare },
  { name: "Feedback", href: "/admin/feedback", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setChecking(false);
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin");
  };

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto max-w-screen-2xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── Sidebar ── */}
          <aside
            className="rounded-2xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Brand header */}
            <div
              className="p-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {/* "Admin Panel" badge */}
              <span
                className="badge badge-brand"
                style={{ fontSize: "11px", letterSpacing: "0.18em" }}
              >
                Admin Portal
              </span>

              <h1
                className="mt-3 text-lg"
                style={{
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                }}
              >
                RexGalaxy Admin
              </h1>

              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-dim)" }}
              >
                Manage jobs, applications and enquiries.
              </p>
            </div>

            {/* Nav links */}
            <nav className="p-3">
              <div className="space-y-1">
                {NAV.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150"
                      style={{
                        background: active
                          ? "var(--brand-soft)"
                          : "transparent",
                        color: active ? "var(--text)" : "var(--text-muted)",
                        border: active
                          ? "1px solid rgba(255, 107, 0, 0.22)"
                          : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background =
                            "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-muted)";
                        }
                      }}
                    >
                      <item.icon
                        className="h-4 w-4 shrink-0 transition-colors duration-150"
                        style={{
                          color: active
                            ? "var(--brand)"
                            : "var(--text-dim)",
                        }}
                      />
                      {item.name}

                      {/* Active indicator dot */}
                      {active && (
                        <span
                          className="ml-auto h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--brand)" }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(239, 68, 68, 0.10)";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(239, 68, 68, 0.90)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(239, 68, 68, 0.20)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-muted)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "transparent";
                  }}
                >
                  <LogOut
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--danger)" }}
                  />
                  Logout
                </button>
              </div>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
