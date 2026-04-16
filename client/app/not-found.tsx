import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-12">
          <p className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
            404 Page
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Something exciting is coming soon.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
            The page you tried to open is not available right now. We are probably
            updating it or launching it soon.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Back to Home
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              Explore Courses
            </Link>
            <Link
              href="/contact-us"
              className="rounded-xl border border-orange-500/35 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/15"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
