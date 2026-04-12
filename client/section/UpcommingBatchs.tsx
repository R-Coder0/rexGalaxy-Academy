/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, PhoneCall, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

type Batch = {
  title: string;
  date: string;
  img: string;
  href?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function UpcomingBatches() {
  const batches: Batch[] = [
    { title: "AWS", date: "22-11-2025", img: "/tech/AWS.svg", href: "/batches/aws" },
    { title: ".NET FULL STACK", date: "22-11-2025", img: "/icons/dotnet.svg", href: "/batches/dotnet-fullstack" },
    { title: "CYBER SECURITY", date: "22-11-2025", img: "/icons/cs.svg", href: "/batches/cyber-security" },
    { title: "JAVA EXPERT", date: "22-11-2025", img: "/tech/Java.svg", href: "/batches/java-expert" },
    { title: "PYTHON", date: "24-11-2025", img: "/tech/Python.svg", href: "/batches/python" },
  ];

  // ✅ Use integer slidesPerView to avoid mobile maxIndex bug
  const [spv, setSpv] = useState<number>(1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;

      // ✅ Mobile: full 1 card (no peek) — fixes your screenshot issue
      if (w < 640) return 1;

      // Tablets
      if (w < 1024) return 2;

      // Desktop
      if (w < 1280) return 3;

      // Large screens
      return 4;
    };

    const onResize = () => setSpv(calc());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [index, setIndex] = useState(0);

  // ✅ maxIndex now consistent for all screens
  const maxIndex = useMemo(() => {
    return Math.max(0, batches.length - spv);
  }, [batches.length, spv]);

  // Keep index valid when spv changes (resize)
  useEffect(() => {
    setIndex((cur) => clamp(cur, 0, maxIndex));
  }, [maxIndex]);

  const pages = useMemo(() => {
    return Array.from({ length: maxIndex + 1 }, (_, i) => i);
  }, [maxIndex]);

  const goTo = (i: number) => setIndex(clamp(i, 0, maxIndex));
  const next = () => setIndex((cur) => clamp(cur + 1, 0, maxIndex));
  const prev = () => setIndex((cur) => clamp(cur - 1, 0, maxIndex));

  // autoplay
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIndex((cur) => (cur >= maxIndex ? 0 : cur + 1));
    }, 3200);
    return () => window.clearInterval(t);
  }, [paused, maxIndex]);

  // drag / swipe
  const drag = useRef({ active: false, startX: 0, lastX: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.lastX = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.lastX = e.clientX;
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;

    const delta = drag.current.lastX - drag.current.startX;
    const threshold = 45;

    if (Math.abs(delta) < threshold) return;
    if (delta < 0) next();
    else prev();
  };

  // translate track
  const gapPx = 18;

  const itemBasis = useMemo(() => {
    return `calc((100% - ${(spv - 1) * gapPx}px) / ${spv})`;
  }, [spv]);

  return (
    <section className="py-16 sm:py-20 bg-[var(--bg)] px-6 border-t border-white/5">
      {/* Heading */}
      <div className="max-w-[1500px] mx-auto mb-10 sm:mb-12">
        <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[var(--ai-cyan)]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/75">
                Limited seats · New batches opening
              </span>
            </div>

            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">Upcoming Batches</h2>

            <div className="mt-4 h-[2px] w-40 bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />

            <p className="mt-4 text-sm sm:text-base text-white/65 max-w-2xl">
              Pick your program and reserve your callback. We’ll share batch details, syllabus, and fee structure.
            </p>
          </div>

          <button
            className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-white/85 transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            onClick={() => alert("Open all batches")}
          >
            View All Batches
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-[1500px] mx-auto">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Controls */}
          <div className="absolute -top-14 right-0 flex items-center gap-2">
            <button
              onClick={prev}
              disabled={index === 0}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-white/90 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={index === maxIndex}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-white/90 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Viewport */}
          <div
            className="overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div
              className="flex will-change-transform transition-transform duration-500 ease-out"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${index} * (${itemBasis} + ${gapPx}px)))`,
              }}
            >
              {batches.map((batch, i) => (
                <div key={i} className="shrink-0" style={{ flexBasis: itemBasis }}>
                  <div
                    className="group relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur
                               hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity"
                      style={{ background: "rgba(255,107,0,0.55)" }}
                    />

                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                      <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                        Batch Open
                      </span>
                      <span className="text-xs font-semibold text-[var(--brand)]">
                        Seats Filling Fast
                      </span>
                    </div>

                    <div className="px-5 pt-6">
                      <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/20 flex items-center justify-center overflow-hidden">
                        <img
                          src={batch.img}
                          alt={batch.title}
                          className="w-10 h-10 object-contain opacity-95"
                          loading="lazy"
                        />
                      </div>

                      <h3 className="mt-4 text-base sm:text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                        {batch.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-white/65">
                        <CalendarDays className="h-4 w-4 text-[var(--ai-cyan)]" />
                        <span>
                          Starting: <span className="text-white/85 font-medium">{batch.date}</span>
                        </span>
                      </div>
                    </div>

                    <div className="px-5 pb-6 pt-5">
                      <button
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl
                                   bg-[var(--brand)] hover:bg-[var(--brand-hover)]
                                   text-black font-semibold py-3 transition
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        onClick={() => alert(`Callback requested for ${batch.title}`)}
                      >
                        <PhoneCall className="h-4.5 w-4.5" />
                        Request a Call Back
                      </button>

                      <p className="mt-3 text-xs text-white/45">Get syllabus + duration + fees on call.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  p === index ? "w-8 bg-[var(--ai-cyan)]" : "w-2.5 bg-white/25 hover:bg-white/40",
                ].join(" ")}
                aria-label={`Go to slide ${p + 1}`}
              />
            ))}
          </div>

          <div className="mt-2 text-center text-xs text-white/35 lg:hidden">Swipe to explore →</div>
        </div>
      </div>
    </section>
  );
}