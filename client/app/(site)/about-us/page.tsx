import Link from "next/link";
import {
  SITE_ADDRESS,
  SITE_LOCATION_NAME,
} from "@/lib/site-contact";

const stats = [
  { label: "Years of Excellence", value: "20+" },
  { label: "Students Trained", value: "50,000+" },
  { label: "Industry Trainers", value: "200+" },
  { label: "Hiring Partners", value: "1,000+" },
];

const highlights = [
  {
    title: "Job-Oriented Training",
    desc: "Structured programs designed to match real industry requirements, interview needs, and live project work.",
  },
  {
    title: "Hands-on Projects",
    desc: "Work on real-world assignments, capstone projects, and guided lab practice to build a strong portfolio.",
  },
  {
    title: "Expert Mentors",
    desc: "Learn from trainers with years of industry experience and practical problem-solving approach.",
  },
  {
    title: "Placement Support",
    desc: "Resume building, mock interviews, aptitude training and guidance until you get your first break.",
  },
];

const timeline = [
  {
    year: "2000",
    title: "The Beginning",
    desc: "Started with a mission to provide quality IT training and bridge the skills gap.",
  },
  {
    year: "2008",
    title: "Expansion Across Locations",
    desc: "Scaled training programs with improved labs, trainers and student support systems.",
  },
  {
    year: "2016",
    title: "Industry-Focused Curriculum",
    desc: "Programs aligned with modern tech stacks, enterprise tools and job roles.",
  },
  {
    year: "2024",
    title: "Projects + Placement Model",
    desc: "Stronger focus on portfolio-building, career guidance and placement preparation.",
  },
];

const team = [
  {
    name: "Training Head",
    role: "Curriculum & Delivery",
    desc: "Ensures syllabus relevance and high-quality teaching outcomes across batches.",
  },
  {
    name: "Career Mentor",
    role: "Interview & Placement Guidance",
    desc: "Focuses on resume, mock interviews, and personalized career roadmap.",
  },
  {
    name: "Lab Instructor",
    role: "Practical Sessions",
    desc: "Supports hands-on learning, labs, assignments and project troubleshooting.",
  },
];

const branches = [{ city: SITE_LOCATION_NAME, address: SITE_ADDRESS }];

const faqs = [
  {
    q: "Do you provide placement assistance?",
    a: "Yes. We provide placement support including resume building, mock interviews, aptitude and HR preparation.",
  },
  {
    q: "Is the training beginner-friendly?",
    a: "Yes. Many programs start from fundamentals and gradually progress to advanced projects and real tools.",
  },
  {
    q: "Do you provide certificates?",
    a: "Yes. Certificates are provided after completing the program and assessments (as per course guidelines).",
  },
  {
    q: "How do I choose the right course?",
    a: "You can book a free counselling call to understand roles, roadmap, course duration and career outcomes.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Glow */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[340px] bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-transparent blur-2xl" />

      {/* HERO */}
      <section className="relative mx-auto max-w-[1500px]  px-5 pt-14 pb-12 md:pt-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              About Our Institute
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Industry-Ready IT Training with{" "}
              <span className="text-orange-500">Real Projects</span> & Career Support
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
              We help students and professionals learn modern technologies through hands-on practice,
              trainer-led guidance, and structured career preparation.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/15 transition hover:opacity-90"
              >
                Explore Courses
              </Link>
              <Link
                href="/contact-us"
                className="rounded-xl border border-orange-500/40 bg-transparent px-5 py-3 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10"
              >
                Talk to Counsellor
              </Link>
              <Link
                href="/courses"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Download Brochure
              </Link>
            </div>
          </div>

          {/* Hero Card */}
          <div className="w-full max-w-md rounded-2xl border border-orange-500/20 bg-white/5 p-5 shadow-xl shadow-black/30">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm font-semibold text-orange-400">Why students choose us</p>
              <ul className="mt-3 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Live batches + doubt sessions + lab practice
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Resume + interview + placement preparation
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Projects based learning with mentor support
                </li>
              </ul>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/60">Avg. Batch Size</p>
                <p className="mt-1 text-lg font-bold text-orange-500">20–30</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/60">Mode</p>
                <p className="mt-1 text-lg font-bold text-orange-500">Online/Offline</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-[1500px]  px-5 pb-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-2xl font-bold text-orange-500 md:text-3xl">{item.value}</p>
              <p className="mt-1 text-sm text-white/60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY + MISSION */}
      <section className="mx-auto max-w-[1500px]  px-5 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">
              Our <span className="text-orange-500">Story</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              We started with one goal: make learners skilled enough for real jobs, not just certificates.
              Over the years, we evolved into a training model that emphasizes practical learning, real-world
              projects, and career support.
            </p>
            <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="text-sm text-white/80">
                 Focus on practical tools, assignments, and interview preparation.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">
              Our <span className="text-orange-500">Mission</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              To help students & working professionals build strong skills, confidence, and career outcomes
              through structured learning and mentorship.
            </p>

            <h3 className="mt-6 text-sm font-semibold text-orange-400">What makes us different</h3>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/75">
                📌 Updated curriculum with modern tech stacks
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/75">
                📌 Projects + mentoring + regular assessments
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/75">
                📌 Job interview focus from Day 1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-[1500px]  px-5 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Why Choose <span className="text-orange-500">Us</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Not just training — a complete skill + career transformation journey.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-500/30"
            >
              <h3 className="text-lg font-semibold text-white">{h.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{h.desc}</p>
              <div className="mt-4 h-[2px] w-16 rounded-full bg-orange-500" />
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-[1500px]  px-5 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Our <span className="text-orange-500">Journey</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Milestones that shaped our training and placement ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {timeline.map((t) => (
            <div
              key={t.year}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="shrink-0">
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
                  {t.year}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/70">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-[1500px]  px-5 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Leadership & <span className="text-orange-500">Mentors</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Our team focuses on quality training and measurable career outcomes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-orange-500/20 ring-1 ring-orange-500/30" />
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-orange-400">{m.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRANCHES */}
      <section className="mx-auto max-w-[1500px]  px-5 py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Our <span className="text-orange-500">Branches</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Visit our office for counselling, guidance, and admissions support.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="w-fit rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Get Call Back
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {branches.map((b) => (
            <div
              key={b.city}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{b.city}</h3>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                  Active
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">{b.address}</p>
              <div className="mt-4 h-[1px] w-full bg-white/10" />
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact-us"
                  className="text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  Contact →
                </Link>
                <Link
                  href="/courses"
                  className="text-sm font-semibold text-white/70 hover:text-white"
                >
                  View Courses →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-[1500px]  px-5 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Quick answers before you enroll.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{f.q}</span>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400 group-open:bg-orange-500 group-open:text-black">
                  {/** fake icon */}
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1500px]  px-5 pb-16">
        <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 via-white/5 to-transparent p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Ready to start your <span className="text-orange-500">IT Career</span>?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Choose a course, join a batch, build projects, and prepare for interviews with our mentors.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/15 transition hover:opacity-90"
              >
                Explore Courses
              </Link>
              <Link
                href="/contact-us"
                className="rounded-xl border border-orange-500/40 bg-transparent px-6 py-3 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10"
              >
                Book Free Counselling
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Rex Galaxy Academy. All rights reserved.
        </p>
      </section>
    </main>
  );
}
