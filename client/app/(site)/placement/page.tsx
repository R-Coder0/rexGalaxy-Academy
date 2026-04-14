"use client";

import Image from "next/image";
// import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import GlobalEnquiryForm from "@/components/forms/GlobalEnquiryForm";

type Placement = {
  name: string;
  role: string;
  company: string;
  package: string;
  image: string;
};

const placements: Placement[] = [
  {
    name: "Sonu Sharma",
    role: "Data Analyst",
    company: "Chandigarh University",
    package: "6 LPA",
    image: "/placed/soun_sharma.png",
  },
  {
    name: "Divya Chandel",
    role: "Data Analyst",
    company: "A2 Global",
    package: "8 LPA",
    image: "/placed/divya_chandel.png",
  },
  {
    name: "Riya Singh",
    role: "Cloud Engineer",
    company: "SoftwareOne",
    package: "8 LPA",
    image: "/placed/anuj_khatri.png",
  },
];

const stats = [
  { value: "500+", label: "Students Placed" },
  { value: "45 LPA", label: "Highest Package" },
  { value: "120+", label: "Hiring Partners" },
  { value: "92%", label: "Placement Success Rate" },
];

export default function PlacementPage() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-[var(--bg)] text-white">
        {/* <section className="relative overflow-hidden border-b border-white/8 bg-black">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>

          <div className="relative mx-auto max-w-[1500px] px-6 py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Career Outcomes
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                Placement Page
              </h1>

              <div className="mt-5 flex items-center gap-2 text-sm text-white/55">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 text-white/35" />
                <span className="text-white/80">Placement</span>
              </div>
            </div>
          </div>
        </section> */}

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1500px]">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">
                Building Careers, Not Just Certificates
              </h2>
              <p className="mt-5 leading-relaxed text-white/65">
                At <span className="font-medium text-[var(--brand)]">RexGalaxy Academy</span>,
                we focus on real-world skills, hands-on projects, and interview-ready preparation.
                Our placement-driven approach helps students move confidently into strong roles
                across leading companies.
              </p>
            </div>

            <div className="mb-18 grid grid-cols-2 gap-5 md:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition hover:border-[var(--brand)]/40 hover:bg-white/[0.05]"
                >
                  <h3 className="text-4xl font-bold text-[var(--brand)]">{item.value}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.label}</p>
                </div>
              ))}
            </div>

            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              loop
              autoplay={{ delay: 3500, disableOnInteraction: false }}
            >
              {placements.map((item) => (
                <SwiperSlide key={item.name}>
                  <div className="mx-auto grid max-w-[1280px] items-center justify-center gap-8 rounded-[28px] p-7 text-center shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:grid-cols-[380px_minmax(0,520px)] md:p-10 md:text-left">
                    <div className="flex justify-center">
                      <div className="relative h-[360px] w-[290px] overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="inline-flex items-center border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                        Successful Placement
                      </div>

                      <h3 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-lg font-medium text-[var(--ai-cyan)]">
                        {item.role}
                      </p>

                      <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
                        Placed as <span className="text-white">{item.role}</span> at{" "}
                        <span className="text-[var(--brand)]">{item.company}</span> with a{" "}
                        <span className="text-[var(--brand)]">{item.package}</span> package.
                        Proudly trained at <span className="text-white">RexGalaxy Academy</span>,
                        with strong support in projects, interview preparation, and career guidance.
                      </p>

                      <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                        <button
                          type="button"
                          onClick={() => setIsEnquiryOpen(true)}
                          className="inline-flex items-center gap-2 bg-[var(--brand)] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]"
                        >
                          Get In Touch
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section className="border-t border-white/8 px-6 py-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),rgba(255,107,0,0.14),rgba(0,0,0,0.3))] px-8 py-10 md:px-12 md:py-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(255,255,255,0.08),transparent_32%)]" />

              <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    Placement Support
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold text-white md:text-[42px]">
                    Want Placement Guidance For Your Career Path?
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                    Speak with our team to understand the right course, placement roadmap,
                    interview preparation support, and hiring opportunities aligned with your goals.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryOpen(true)}
                    className="inline-flex items-center gap-3 rounded-full bg-[var(--brand)] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]"
                  >
                    Book Placement Counselling
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-white/50">
                    Get a callback from our placement and admissions team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isEnquiryOpen ? (
        <GlobalEnquiryForm
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          title="Book Placement Counselling"
          subtitle="Share your details and our team will guide you on training and placement support."
          submitLabel="Request Callback"
          source="placement-page-cta"
          showCourseField={false}
        />
      ) : null}
    </>
  );
}
