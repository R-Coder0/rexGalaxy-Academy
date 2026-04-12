"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch {
      setError("Something went wrong. Please check your server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.18),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left content */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)] backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Admin Portal
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white xl:text-5xl">
              Manage courses, enquiries, careers and student activity from one place.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
              Welcome to the Rex Galaxy Academy admin panel. This secure dashboard
              helps your team manage training programs, applications, website
              enquiries, and career-related updates with a clean and efficient workflow.
            </p>

            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <BookOpen className="h-5 w-5 text-[var(--brand)]" />
                <p className="mt-3 text-sm font-semibold text-white">Courses</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Update program details and training content.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <Briefcase className="h-5 w-5 text-[var(--ai-cyan)]" />
                <p className="mt-3 text-sm font-semibold text-white">Careers</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Manage openings, applications and guidance pages.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <Sparkles className="h-5 w-5 text-[var(--ai-purple)]" />
                <p className="mt-3 text-sm font-semibold text-white">Enquiries</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Track user interest and incoming leads easily.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur">
              <p className="text-sm font-semibold text-white">Authorized access only</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                This area is restricted to approved administrators. Please sign in
                with your official admin credentials to continue.
              </p>
            </div>
          </div>

          {/* Right login card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur md:p-7">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                  Secure Login
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Sign in to access the Rex Galaxy Academy admin dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Email Address
                  </label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-3 focus-within:border-[var(--brand)]/60 focus-within:ring-1 focus-within:ring-[var(--brand)]/40">
                    <Mail className="h-4 w-4 text-white/35" />
                    <input
                      type="email"
                      placeholder="admin@rexgalaxy.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Password
                  </label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-3 focus-within:border-[var(--brand)]/60 focus-within:ring-1 focus-within:ring-[var(--brand)]/40">
                    <Lock className="h-4 w-4 text-white/35" />
                    <input
                      type={show ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="rounded-lg p-1.5 text-white/55 transition hover:bg-white/5 hover:text-white"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-black shadow-[0_10px_28px_rgba(255,107,0,0.16)] transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In to Dashboard"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-center text-xs text-white/45">
                  Protected area for authorized administrators only.
                </p>
              </form>
            </div>

            <div className="mt-4 text-center text-xs text-white/40">
              Rex Galaxy Academy Admin Panel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}