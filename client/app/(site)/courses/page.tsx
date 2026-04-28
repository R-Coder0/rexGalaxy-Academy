/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, CalendarClock, Layers3, Sparkles } from "lucide-react";
import { getAllCourseDetails, getPublicAssetUrl } from "@/lib/course-detail";

function getShortDescription(value: string) {
  const text = value.trim();
  return text.length > 135 ? `${text.slice(0, 135).trim()}...` : text;
}

export default async function CoursesPage() {
  const courses = await getAllCourseDetails();

  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-14 text-white md:py-20">
      <div className="mx-auto max-w-[1500px]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,0,0.18),rgba(34,211,238,0.10),rgba(255,255,255,0.04))] px-6 py-10 md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_32%)]" />

          <div className="relative max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
              <Sparkles className="h-3.5 w-3.5" />
              All Courses
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Explore every course in one place.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
              Browse RexGalaxy Academy programs and open any course to view full
              details, curriculum, duration, and counselling options.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => {
              const imageUrl = getPublicAssetUrl(course.featureImageUrl);
              const categoryLabel = course.subcategoryId?.title
                ? `${course.categoryId?.title || "Course"} / ${course.subcategoryId.title}`
                : course.categoryId?.title || "Course";

              return (
                <article
                  key={course._id}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.06]"
                >
                  <div className="relative h-48 overflow-hidden bg-black/30">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.20),rgba(255,255,255,0.04))]">
                        <img
                          src="/logo.png"
                          alt="RexGalaxy Academy"
                          className="h-20 w-auto object-contain opacity-90"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                      <Layers3 className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
                      <span className="truncate">{categoryLabel}</span>
                    </div>

                    <h2 className="text-xl font-semibold leading-snug text-white">
                      {course.title}
                    </h2>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/62">
                      {getShortDescription(course.description)}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-white/70">
                      <CalendarClock className="h-4 w-4 text-[var(--ai-cyan)]" />
                      <span>{course.duration}</span>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-white/70 sm:col-span-2 xl:col-span-3">
              Courses are not available right now. Please check again shortly.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
