/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

type Program = {
  title: string;
  icon: string;
  href?: string;          // ✅ optional per program
  isExternal?: boolean;   // ✅ if true -> opens new tab
  tag?: string;           // ✅ optional small badge e.g. "Gen AI"
};

export default function TopPrograms() {
  const programs: Program[] = [
    { title: "MERN Stack + Gen AI", icon: "/icons/mern.png", href: "/programs/mern-genai", tag: "Gen AI" },
    { title: "Cyber Security + Gen AI", icon: "/icons/cyber.avif", href: "/programs/cyber-genai", tag: "Gen AI" },
    { title: "Java Expert", icon: "/icons/java.svg", href: "/programs/java-expert" },
    { title: "Advanced Digital Marketing", icon: "/icons/digital-marketing.svg", href: "/programs/digital-marketing" },
    { title: "UI & UX Design", icon: "/icons/ui-ux.svg", href: "/programs/ui-ux" },
    { title: ".NET Development", icon: "/icons/dotnet.svg", href: "/programs/dotnet" },
    { title: "Java Full Stack Developer + Gen AI", icon: "/icons/javafull.png", href: "/programs/java-fullstack-genai", tag: "Gen AI" },
    { title: "Data Science Professional Training", icon: "/icons/datascience.webp", href: "/programs/data-science" },
    { title: "Python Training Course", icon: "/icons/python.png", href: "/programs/python" },
    { title: "Business Analytics", icon: "/icons/analytics.svg", href: "/programs/business-analytics" },
    { title: "AWS Professional Training", icon: "/icons/Amazon.png", href: "/programs/aws" },
    { title: "Software Testing Course", icon: "/icons/tester.svg", href: "/programs/software-testing" },
    { title: "Data Analytics Using Python", icon: "/icons/dataanalytics.png", href: "/programs/data-analytics-python" },
    { title: "Generative AI", icon: "/icons/gen-ai.png", href: "/programs/generative-ai", tag: "Trending" },
    { title: "Power BI", icon: "/icons/powerbi.png", href: "/programs/power-bi" },
    { title: "AutoCAD", icon: "/icons/autocad.png", href: "/programs/autocad" },
  ];

  return (
    <section className="bg-[var(--bg)] py-16 sm:py-20 px-6 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-white/55">
            Career-focused learning paths
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Explore Top Programs
          </h2>

          <div className="mt-5 h-[2px] w-28 bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent mx-auto" />

          <p className="mt-5 text-sm sm:text-base text-white/65">
            Choose from high-demand programs designed for real projects, mentorship, and job-ready outcomes.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {programs.map((program, index) => {
            const CardInner = (
              <div
                className="group relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur
                           p-4 flex items-center gap-4
                           hover:border-white/18 hover:bg-white/7 transition-all duration-300"
              >
                {/* Accent glow on hover */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-35 transition-opacity"
                     style={{ background: "rgba(255,107,0,0.55)" }}
                />

                {/* Icon */}
                <div className="shrink-0 w-14 h-14 flex items-center justify-center overflow-hidden">
                  <img
                    src={program.icon}
                    alt={program.title}
                    className="w-14 h-14 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>

                {/* Title + optional tag */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-[15px] font-medium text-white/85 group-hover:text-white transition-colors leading-snug">
                      {program.title}
                    </h3>

                    
                  </div>

                  <p className="mt-1 text-xs text-white/50">
                    View program details
                  </p>
                </div>
              </div>
            );

            // ✅ Link optional (if href not present -> render a non-link card)
            if (!program.href) {
              return (
                <div key={index} className="cursor-default">
                  {CardInner}
                </div>
              );
            }

            // ✅ External link support
            if (program.isExternal) {
              return (
                <a
                  key={index}
                  href={program.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
                >
                  {CardInner}
                </a>
              );
            }

            // ✅ Internal Next link
            return (
              <Link
                key={index}
                href={program.href}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}