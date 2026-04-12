/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { ArrowUpRight, BadgeCheck, Award, GraduationCap } from "lucide-react";
import GlobalEnquiryForm from "@/components/forms/GlobalEnquiryForm";

export default function ContactCtaSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="bg-[var(--bg)] py-12 border-t border-white/5">
        <div className="mx-auto max-w-[1500px] px-6">
          <div className="relative overflow-hidden rounded-3xl">

            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.92),rgba(255,107,0,0.22),rgba(34,211,238,0.16))]" />

            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full" viewBox="0 0 1200 420">
                <path d="M0,240 L160,120 L320,220 L480,90 L650,200 L820,80 L980,160 L1200,60 L1200,420 L0,420 Z" fill="rgba(255,255,255,0.05)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-10 px-8 py-10 md:flex-row md:items-center md:justify-between">

              {/* LEFT */}
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1 text-xs text-white/75">
                  ADMISSIONS • COUNSELING • COURSE GUIDANCE
                </div>

                <h2 className="text-3xl font-semibold text-white md:text-[44px]">
                  Start Your Learning Journey with{" "}
                  <span className="text-white">RexGalaxy Academy</span>
                </h2>

                <p className="mt-4 text-sm text-white/70">
                  Get a free counseling call to choose the right program.
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <FeatureItem icon={<BadgeCheck className="h-4 w-4" />} text="Industry curriculum" />
                  <FeatureItem icon={<Award className="h-4 w-4" />} text="Certificates" />
                  <FeatureItem icon={<GraduationCap className="h-4 w-4" />} text="Mentor support" />
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-center gap-5 md:items-end">
                <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-white/5 p-3">
                  <img src="/logo.png" alt="RexGalaxy" />
                </div>

                {/* BUTTON → POPUP OPEN */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-hover)]"
                >
                  Book Free Counseling
                  <ArrowUpRight className="h-5 w-5" />
                </button>

                <p className="text-xs text-white/55">
                  Get syllabus + roadmap instantly.
                </p>
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/12" />
          </div>
        </div>
      </section>

      {/* ✅ GLOBAL ENQUIRY POPUP */}
      {isOpen && (
        <GlobalEnquiryForm
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Book Free Counseling"
          subtitle="Fill your details and our expert will call you shortly."
          submitLabel="Book Now"
          source="cta-counseling"
        />
      )}
    </>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--ai-cyan)]">{icon}</span>
      <span className="text-sm text-white/85">{text}</span>
    </div>
  );
}