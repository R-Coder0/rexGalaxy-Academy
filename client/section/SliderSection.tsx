"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Zap,
  PlayCircle,
} from "lucide-react";

type Stat = { number: number; label: string };

interface HeroProps {
  backgroundImage?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  stats?: Stat[];
  primaryText?: string;
  onPrimary?: () => void;
  secondaryText?: string;
  onSecondary?: () => void;
}

function formatNumber(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(num);
}

export default function HeroSection({
  backgroundImage = "/herobg.png",
  subtitle = "INDIA'S #1 FREE LEARNING PLATFORM",
  title = "Build job-ready skills with an AI-first learning experience",
  description = "Learn cutting-edge technologies from industry experts. Zero registration fees, free skill certification, and lifetime access to all courses.",
  stats = [
    { number: 50000, label: "Active Students" },
    { number: 200, label: "Free Courses" },
    { number: 5000, label: "Certified Graduates" },
  ],
  primaryText = "Join RexGalaxy Academy",
  onPrimary = () => alert("Join Now"),
  secondaryText = "Browse Courses",
  onSecondary,
}: HeroProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [counters, setCounters] = useState<number[]>(() => stats.map(() => 0));
  const targets = useMemo(() => stats.map((s) => s.number), [stats]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setStarted(true),
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let raf = 0;
    const start = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCounters(targets.map((target) => Math.round(target * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, targets]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[var(--bg)]">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.18),transparent_85%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-10 py-16 sm:py-24 min-h-[90vh] flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[var(--ai-cyan)]" />
              <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                {subtitle}
              </span>
            </div>

            <h1 className="mt-6 text-[36px] sm:text-[48px] lg:text-[58px] xl:text-[64px] leading-tight font-semibold text-white">
              Build job-ready skills with an{" "}
              <span className="text-[var(--brand)]">AI-first</span> learning experience
            </h1>

            <p className="mt-5 text-white/70 max-w-xl">
              {description}
            </p>

            {/* Feature Pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                <GraduationCap className="h-4 w-4 text-[var(--ai-cyan)]" />
                Free Certification
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4 text-[var(--ai-cyan)]" />
                Zero Registration Fees
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                <Zap className="h-4 w-4 text-[var(--ai-cyan)]" />
                Lifetime Access
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPrimary}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-7 py-4 font-semibold text-black hover:bg-[var(--brand-hover)] transition"
              >
                {primaryText}
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={onSecondary}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white hover:bg-white/10 transition"
              >
                <PlayCircle className="h-5 w-5 text-[var(--ai-cyan)]" />
                {secondaryText}
              </button>
            </div>
          </div>

          {/* RIGHT: Stats */}
          <div className="grid gap-5 max-w-md ml-0 md:ml-auto">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-6 py-5"
              >
                <div className="text-4xl font-semibold text-white">
                  {formatNumber(counters[idx])}
                  <span className="text-[var(--brand)]">+</span>
                </div>
                <div className="mt-2 text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}