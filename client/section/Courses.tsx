/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock3,
  BadgeCheck,
  Download,
} from "lucide-react";
import GlobalEnquiryForm from "../components/forms/GlobalEnquiryForm";

type Course = {
  title: string;
  duration: string;
  eligibility: string;
  reviews: string;
  img: string;
  brochure: string;
};

const courses: Course[] = [
  {
    title: "MICROSOFT AZURE CLOUD",
    duration: "4–6 Months",
    eligibility: "Any Graduate",
    reviews: "12163",
    img: "/tech/Azure.svg",
    brochure: "/brochures/microsoft-azure-cloud.pdf",
  },
  {
    title: "POWER BI",
    duration: "3 Months",
    eligibility: "Any Graduate",
    reviews: "10193",
    img: "/icons/powerbi.png",
    brochure: "/brochures/power-bi.pdf",
  },
  {
    title: "ADVANCE DIGITAL MARKETING",
    duration: "4–6 Months",
    eligibility: "Any Graduate",
    reviews: "9629",
    img: "/icons/dm.svg",
    brochure: "/brochures/advance-digital-marketing.pdf",
  },
  {
    title: "BUSINESS ANALYST",
    duration: "4–6 Months",
    eligibility: "Any Graduate",
    reviews: "8761",
    img: "/icons/ba.svg",
    brochure: "/brochures/business-analyst.pdf",
  },
  {
    title: "AWS TRAINING",
    duration: "4–6 Months",
    eligibility: "Any Graduate",
    reviews: "9354",
    img: "/tech/AWS.svg",
    brochure: "/brochures/aws-training.pdf",
  },
  {
    title: "AUTOCAD",
    duration: "3–4 Months",
    eligibility: "Any Graduate",
    reviews: "4981",
    img: "/icons/autocad.png",
    brochure: "/brochures/autocad.pdf",
  },
  {
    title: "CYBER SECURITY",
    duration: "5–6 Months",
    eligibility: "Any Graduate",
    reviews: "8427",
    img: "/icons/cs.svg",
    brochure: "/brochures/cyber-security.pdf",
  },
  {
    title: "JAVA",
    duration: "4–6 Months",
    eligibility: "Any Graduate",
    reviews: "9138",
    img: "/tech/Java.svg",
    brochure: "/brochures/java.pdf",
  },
  {
    title: "PL SQL",
    duration: "2–3 Months",
    eligibility: "Any Graduate",
    reviews: "6572",
    img: "/tech/plsql.svg",
    brochure: "/brochures/pl-sql.pdf",
  },
  {
    title: "PYTHON",
    duration: "4 Months",
    eligibility: "Any Graduate",
    reviews: "11892",
    img: "/tech/Python.svg",
    brochure: "/brochures/python.pdf",
  },
  {
    title: "PYTHON DATA ANALYST",
    duration: "5–6 Months",
    eligibility: "Any Graduate",
    reviews: "10344",
    img: "/icons/da.png",
    brochure: "/brochures/python-data-analyst.pdf",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function CourseCarousel() {
  const [spv, setSpv] = useState<number>(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const drag = useRef({ active: false, startX: 0, lastX: 0 });

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 4;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    };

    const onResize = () => setSpv(calc());
    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = useMemo(() => {
    return Math.max(0, courses.length - spv);
  }, [spv]);

  useEffect(() => {
    setIndex((cur) => clamp(cur, 0, maxIndex));
  }, [maxIndex]);

  const pages = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, i) => i),
    [maxIndex]
  );

  const goTo = (i: number) => setIndex(clamp(i, 0, maxIndex));
  const next = () => setIndex((cur) => clamp(cur + 1, 0, maxIndex));
  const prev = () => setIndex((cur) => clamp(cur - 1, 0, maxIndex));

  useEffect(() => {
    if (paused || isEnquiryOpen) return;

    const t = window.setInterval(() => {
      setIndex((cur) => (cur >= maxIndex ? 0 : cur + 1));
    }, 3200);

    return () => window.clearInterval(t);
  }, [paused, maxIndex, isEnquiryOpen]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const gapPx = 18;
  const itemBasis = useMemo(() => {
    return `calc((100% - ${(spv - 1) * gapPx}px) / ${spv})`;
  }, [spv]);

  const handleOpenBrochurePopup = (course: Course) => {
    setSelectedCourse(course);
    setIsEnquiryOpen(true);
  };

  const handleClosePopup = () => {
    setIsEnquiryOpen(false);
    setSelectedCourse(null);
  };

  const handleBrochureDownload = () => {
    if (!selectedCourse?.brochure) return;

    const fileName = `${selectedCourse.title
      .toLowerCase()
      .replace(/\s+/g, "-")}.pdf`;

    const link = document.createElement("a");
    link.href = selectedCourse.brochure;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleClosePopup();
  };

  const handleViewAllCourses = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="py-16 sm:py-20 bg-[var(--bg)] px-6 border-t border-white/5"
      >
        <div className="max-w-[1500px] mx-auto mb-10 sm:mb-12">
          <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[var(--ai-cyan)]" />
                <span className="text-xs font-semibold tracking-widest uppercase text-white/75">
                  Career-focused · Job-ready learning
                </span>
              </div>

              <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">
                Upcoming Courses
              </h2>

              <div className="mt-4 h-[2px] w-40 bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />

              <p className="mt-4 text-sm sm:text-base text-white/65 max-w-2xl">
                Explore our premium selection of industry-leading courses
                designed to elevate your career.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-white/85 transition
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={handleViewAllCourses}
            >
              View All Courses
            </button>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="absolute -top-14 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-white/90 transition
                          disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={next}
                disabled={index === maxIndex}
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-white/90 transition
                          disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div
              className="overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div
                className="flex will-change-transform transition-transform duration-500 ease-out"
                style={{
                  gap: `${gapPx}px`,
                  transform: `translateX(calc(-${index} * (${itemBasis} + ${gapPx}px)))`,
                }}
              >
                {courses.map((c, i) => (
                  <div key={i} className="shrink-0" style={{ flexBasis: itemBasis }}>
                    <article
                      className="group relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur
                                hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                    >
                      <div
                        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity"
                        style={{ background: "rgba(255,107,0,0.55)" }}
                      />

                      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                          Course Open
                        </span>
                        <span className="text-xs font-semibold text-[var(--brand)]">
                          ⭐ {c.reviews}
                        </span>
                      </div>

                      <div className="px-5 pt-6">
                        <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/20 flex items-center justify-center overflow-hidden">
                          <img
                            src={c.img}
                            alt={c.title}
                            className="w-10 h-10 object-contain opacity-95"
                            loading="lazy"
                          />
                        </div>

                        <h3 className="mt-4 text-base sm:text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                          {c.title}
                        </h3>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-[var(--ai-cyan)]" />
                            <div className="leading-tight">
                              <div className="text-xs text-white/55 font-medium">
                                Duration
                              </div>
                              <div className="text-white/85 font-semibold">
                                {c.duration}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-[var(--ai-cyan)]" />
                            <div className="leading-tight">
                              <div className="text-xs text-white/55 font-medium">
                                Eligibility
                              </div>
                              <div className="text-white/85 font-semibold">
                                {c.eligibility}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 pb-6 pt-5">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onPointerUp={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBrochurePopup(c);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl
                                    bg-[var(--brand)] hover:bg-[var(--brand-hover)]
                                    text-black font-semibold py-3 transition
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <Download className="h-4.5 w-4.5" />
                          Download Brochure
                        </button>

                        <p className="mt-3 text-xs text-white/45">
                          Syllabus + duration + fees details inside.
                        </p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goTo(p)}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    p === index
                      ? "w-8 bg-[var(--ai-cyan)]"
                      : "w-2.5 bg-white/25 hover:bg-white/40",
                  ].join(" ")}
                  aria-label={`Go to slide ${p + 1}`}
                />
              ))}
            </div>

            <div className="mt-2 text-center text-xs text-white/35 lg:hidden">
              Swipe to explore →
            </div>
          </div>
        </div>
      </section>

      {isEnquiryOpen && selectedCourse ? (
        <GlobalEnquiryForm
          isOpen={isEnquiryOpen}
          onClose={handleClosePopup}
          initialCourse={selectedCourse.title}
          title="Download Course Brochure"
          subtitle={`Fill this form to access the brochure for ${selectedCourse.title}.`}
          submitLabel="Submit & Download"
          source={`brochure-download-${selectedCourse.title
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          courseOptions={courses.map((course) => course.title)}
          onSuccess={handleBrochureDownload}
        />
      ) : null}
    </>
  );
}