"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  GraduationCap,
  Headphones,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import GlobalEnquiryForm from "@/components/forms/GlobalEnquiryForm";
import CourseEnquiryForm from "@/components/course/CourseEnquiryForm";
import CourseSlider from "@/section/Courses";
import TestimonialSection from "@/section/Testimonial";
import {
  getPublicAssetUrl,
  type ResolvedCoursePageData,
} from "@/lib/course-detail";

type Props = {
  data: ResolvedCoursePageData;
};

const reviewPoints = [
  "Trusted by learners across Noida and NCR",
  "Practical training with portfolio-ready delivery",
  "Structured support for interviews and career transition",
];

const trustStrip = [
  {
    icon: ShieldCheck,
    title: "Trusted Learning",
    text: "Industry-oriented training backed by guided mentorship.",
  },
  {
    icon: CalendarClock,
    title: "Upcoming Batches",
    text: "Flexible schedules for students, freshers, and working professionals.",
  },
  {
    icon: Users,
    title: "Mentor Support",
    text: "Regular doubt handling and learning guidance throughout the course.",
  },
  {
    icon: GraduationCap,
    title: "Career Focus",
    text: "Projects, interview readiness, and placement-oriented preparation.",
  },
];

const staticHighlights = [
  {
    title: "Who Should Join",
    text: "Beginners, graduates, working professionals, and career switchers who want structured learning with practical execution.",
  },
  {
    title: "Training Approach",
    text: "Concept clarity, guided practice, assignments, live examples, and project-based implementation in every phase of the course.",
  },
  {
    title: "Support Beyond Classes",
    text: "Session recordings, mentor assistance, interview preparation, and admission guidance to help you stay consistent.",
  },
];

export default function CourseDetailPage({ data }: Props) {
  const { detail, currentCategory, currentSubcategory } = data;
  const aboutCourse = Array.isArray(detail.aboutCourse) ? detail.aboutCourse : [];
  const modules = Array.isArray(detail.modules) ? detail.modules : [];

  const [popupMode, setPopupMode] = useState<"download" | "callback" | null>(null);

  const courseName = useMemo(() => {
    if (currentSubcategory?.title) return currentSubcategory.title;
    if (currentCategory?.title) return currentCategory.title;
    return detail.title;
  }, [currentCategory?.title, currentSubcategory?.title, detail.title]);

  const brochureUrl = getPublicAssetUrl(detail.brochureUrl);

  const handleBrochureDownload = () => {
    if (!brochureUrl) return;

    const link = document.createElement("a");
    link.href = brochureUrl;
    link.setAttribute("download", `${detail.slug || "curriculum"}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPopupMode(null);
  };

  const categorySubcategories = Array.isArray(currentCategory?.children)
    ? currentCategory.children
    : [];
  const shouldShowRelatedSubcategories = categorySubcategories.length > 0;

  return (
    <>
      <main className="bg-[var(--bg)] text-white">
        <section className="relative overflow-hidden border-b border-white/10 bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.22),transparent_32%),radial-gradient(circle_at_right,rgba(56,189,248,0.18),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:36px_36px]" />
          </div>

          <div className="relative mx-auto grid max-w-[1500px] gap-8 px-6 py-16 lg:grid-cols-[minmax(0,1.2fr)_390px] lg:items-center lg:py-20">
            <div className="max-w-4xl">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <span className="mx-2 text-white/28">/</span>
                {currentCategory ? (
                  <>
                    <Link
                      href={`/courses/${currentCategory.slug}`}
                      className="transition hover:text-white"
                    >
                      {currentCategory.title}
                    </Link>
                    {currentSubcategory ? (
                      <>
                        <span className="mx-2 text-white/28">/</span>
                        <span className="text-white/75">{currentSubcategory.title}</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  <span className="text-white/75">{detail.title}</span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/12 px-4 py-1.5 text-sm font-medium text-[var(--brand)]">
                  <div className="flex items-center gap-0.5 text-[var(--brand)]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span>4.8 learner satisfaction</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-1.5 text-sm text-white/72">
                  <Users className="h-4 w-4 text-[var(--ai-cyan)]" />
                  2,500+ enrolments guided
                </div>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl lg:text-6xl">
                {detail.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
                {detail.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {reviewPoints.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[var(--brand)]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setPopupMode("download")}
                  className="btn btn-primary btn-lg rounded-none"
                >
                  <Download className="h-4 w-4" />
                  Download Curriculum
                </button>

                <button
                  type="button"
                  onClick={() => setPopupMode("callback")}
                  className="btn btn-outline btn-lg rounded-none"
                >
                  <PhoneCall className="h-4 w-4" />
                  Get Quick Call
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
              <div className="rounded-[28px] border border-white/10 bg-[var(--surface-2)]/88 p-6 text-center backdrop-blur">
                <div className="mx-auto flex h-[104px] w-[104px] items-center justify-center rounded-full border border-[var(--brand)]/20 bg-zinc-200 px-3 py-3 shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
                  <Image
                    src="/logo.png"
                    alt="RexGalaxy Academy"
                    width={192}
                    height={72}
                    className="h-16 w-auto object-contain"
                    priority
                  />
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-white">
                  RexGalaxy Academy
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/62">
                  Structured training, practical implementation, and career-focused
                  learning support for serious learners.
                </p>

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
                    <CalendarClock className="mt-0.5 h-5 w-5 text-[var(--brand)]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        Course Duration
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/84">
                        {detail.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-[var(--ai-cyan)]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        Category
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/84">
                        {currentSubcategory
                          ? `${currentCategory?.title} / ${currentSubcategory.title}`
                          : currentCategory?.title || courseName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
                    <BookOpen className="mt-0.5 h-5 w-5 text-[var(--brand)]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        Training Focus
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/84">
                        Practical learning, guided modules, projects, and interview
                        readiness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="space-y-8">
              <article className="rounded-[28px] border border-white/10 bg-[var(--surface-2)]/70 p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)]/14 text-[var(--brand)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      About Course
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">
                      What You Will Learn
                    </h2>
                  </div>
                </div>

                <div className="space-y-5">
                  {aboutCourse.length > 0 ? aboutCourse.map((block, index) => (
                    <div
                      key={`${block.title}-${index}`}
                      className="rounded-[22px] border border-white/8 bg-black/18 p-5"
                    >
                      <h3 className="text-xl font-semibold text-white">
                        {block.title}
                      </h3>
                      <div
                        className="course-rich mt-3 text-white/72"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    </div>
                  )) : (
                    <div className="rounded-[22px] border border-white/8 bg-black/18 p-5 text-sm text-white/60">
                      Detailed course overview will appear here once the content is added from the admin panel.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[28px] border border-white/10 bg-[var(--surface-2)]/70 p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ai-cyan)]/14 text-[var(--ai-cyan)]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Modules
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">
                      Detailed Course Curriculum
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.length > 0 ? modules.map((module) => (
                    <div
                      key={`${module.moduleNumber}-${module.title}`}
                      className="rounded-[24px] border border-white/8 bg-black/18 p-5"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-[var(--brand)]/22 bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                          Module {module.moduleNumber}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {module.title}
                        </h3>
                      </div>

                      <div
                        className="course-rich mt-4 text-white/72"
                        dangerouslySetInnerHTML={{ __html: module.content }}
                      />
                    </div>
                  )) : (
                    <div className="rounded-[24px] border border-white/8 bg-black/18 p-5 text-sm text-white/60">
                      Course module details will appear here once they are published from the admin panel.
                    </div>
                  )}
                </div>
              </article>

              {(detail.conclusionTitle || detail.conclusionContent) && (
                <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,255,255,0.04))] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                    Conclusion
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {detail.conclusionTitle || "Why This Course Stands Out"}
                  </h2>
                  <div
                    className="course-rich mt-4 text-white/75"
                    dangerouslySetInnerHTML={{
                      __html:
                        detail.conclusionContent ||
                        "<p>This program is designed to build confidence, practical skills, and career direction through structured learning.</p>",
                    }}
                  />
                </article>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <CourseEnquiryForm courseName={courseName} />

              {shouldShowRelatedSubcategories ? (
                <div className="rounded-[28px] border border-white/10 bg-[var(--surface-2)]/70 p-6 shadow-[var(--shadow-sm)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Related
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                      Explore Sub Categories
                    </h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    {categorySubcategories.map((item) => {
                      const href = `/courses/${currentCategory?.slug}/${item.slug}`;
                      const isActive = currentSubcategory?.slug === item.slug;

                      return (
                        <Link
                          key={item._id}
                          href={href}
                          className={`flex items-center justify-between gap-3 rounded-[20px] border px-4 py-3 transition ${
                            isActive
                              ? "border-[var(--brand)]/35 bg-[var(--brand)]/10"
                              : "border-white/8 bg-black/20 hover:border-[var(--brand)]/35 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">
                              Sub Category
                            </p>
                            <p className="mt-1 text-sm font-medium text-white/84">
                              {item.title}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/40" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="border-y border-white/8 bg-black px-6 py-8">
          <div className="mx-auto grid max-w-[1500px] gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustStrip.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4"
                >
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)]/12 text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/60">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-[1500px] rounded-[32px] border border-white/10 bg-[var(--surface-2)]/70 p-6 shadow-[var(--shadow-sm)] sm:p-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                Learning Support
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                A Clear Path From Enquiry To Learning
              </h2>
              <p className="mt-4 text-base leading-8 text-white/64">
                Every course detail page follows a simple path: understand the course,
                speak with our team, access the curriculum, and plan your batch with
                clarity.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {staticHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-black/18 p-5"
                >
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[26px] border border-[var(--brand)]/18 bg-[linear-gradient(135deg,rgba(255,107,0,0.14),rgba(255,255,255,0.03))] px-6 py-6">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
                  Need Help Choosing The Right Batch?
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Speak with our counsellor and get clarity on curriculum, timing,
                  and admission support.
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPopupMode("callback")}
                className="btn btn-primary btn-lg rounded-none"
              >
                <Headphones className="h-4 w-4" />
                Talk To Counsellor
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <CourseSlider />
        <TestimonialSection />
      </main>

      {popupMode === "download" ? (
        <GlobalEnquiryForm
          isOpen
          onClose={() => setPopupMode(null)}
          title="Download Curriculum"
          subtitle={
            brochureUrl
              ? `Fill the form and get the curriculum for ${detail.title}.`
              : `Fill the form and our team will share the curriculum for ${detail.title}.`
          }
          submitLabel={brochureUrl ? "Submit & Download" : "Submit Enquiry"}
          source={`course-curriculum-${detail.slug}`}
          initialCourse={detail.title}
          onSuccess={brochureUrl ? handleBrochureDownload : () => setPopupMode(null)}
        />
      ) : null}

      {popupMode === "callback" ? (
        <GlobalEnquiryForm
          isOpen
          onClose={() => setPopupMode(null)}
          title="Get Quick Call"
          subtitle={`Share your details and our team will guide you for ${detail.title}.`}
          submitLabel="Request Callback"
          source={`course-quick-call-${detail.slug}`}
          initialCourse={detail.title}
          onSuccess={() => setPopupMode(null)}
        />
      ) : null}

      <style jsx global>{`
        .course-rich {
          line-height: 1.9;
        }

        .course-rich p,
        .course-rich li {
          color: rgba(255, 255, 255, 0.72);
        }

        .course-rich p + p {
          margin-top: 12px;
        }

        .course-rich ul,
        .course-rich ol {
          margin: 14px 0 0;
          padding-left: 20px;
        }

        .course-rich li + li {
          margin-top: 8px;
        }

        .course-rich strong {
          color: rgba(255, 255, 255, 0.96);
          font-weight: 600;
        }

        .course-rich h1,
        .course-rich h2,
        .course-rich h3,
        .course-rich h4 {
          margin-top: 16px;
          color: #fff;
          font-weight: 600;
        }

        .course-rich a {
          color: var(--brand);
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
