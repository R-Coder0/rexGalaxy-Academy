import Link from "next/link";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { getCourseMenu } from "@/lib/course-detail";

export default async function CoursesPage() {
  const courseMenu = await getCourseMenu();

  return (
    <main className="min-h-screen bg-black px-5 py-14 text-white md:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(255,255,255,0.04))] p-8 md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Explore Programs
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Find the right course for your next move.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
            Browse all available categories and sub-courses from Rex Galaxy Academy.
            Open any course to view curriculum, details, counselling options, and brochure access.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courseMenu.length > 0 ? (
            courseMenu.map((category) => (
              <article
                key={category._id}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/55">
                      <Layers3 className="h-3.5 w-3.5" />
                      Category
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      {category.description || "Explore structured programs, practical modules, and guided learning paths in this category."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {category.children.length > 0 ? (
                    category.children.map((child) => (
                      <Link
                        key={child._id}
                        href={`/courses/${category.slug}/${child.slug}`}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/75 transition hover:border-orange-500/30 hover:text-white"
                      >
                        {child.title}
                      </Link>
                    ))
                  ) : (
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/55">
                      Course details coming soon
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    View Category
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-white/70">
              Course menu is not available right now. Please check again shortly.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
