/* eslint-disable @next/next/no-img-element */
"use client";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function ToolsOrbit() {
  const tools = [
    "/icons/icon1.svg",
    "/icons/icon2.svg",
    "/icons/icon3.svg",
    "/icons/icon4.svg",
    "/icons/icon5.svg",
    "/icons/icon6.svg",
    "/icons/icon7.svg",
    "/icons/icon8.svg",
    "/icons/icon10.svg",
  ];

  return (
    <section className="bg-neutral-950 py-24 px-6 overflow-hidden border-t border-orange-500/10">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-64">
        {/* LEFT — Animated Orbit */}
        <div className="relative w-[300px] h-[300px] lg:w-[440px] lg:h-[440px] flex justify-center items-center">
          {/* OUTER RING */}
          <div className="absolute w-full h-full border border-orange-500/15 rounded-full flex justify-center items-center animate-spin-slow-reverse">
            <img src={tools[0]} alt="" className="absolute -left-10 w-14 h-14 opacity-90" />
            <img src={tools[1]} alt="" className="absolute -right-10 w-14 h-14 opacity-90" />
            <img src={tools[2]} alt="" className="absolute -top-10 w-14 h-14 opacity-90" />
            <img src={tools[3]} alt="" className="absolute -bottom-10 w-14 h-14 opacity-90" />
          </div>

          {/* MIDDLE RING */}
          <div className="absolute w-[70%] h-[70%] border border-orange-500/15 rounded-full flex justify-center items-center animate-spin-slow">
            <img src={tools[4]} alt="" className="absolute -left-8 w-12 h-12 opacity-90" />
            <img src={tools[5]} alt="" className="absolute -right-8 w-12 h-12 opacity-90" />
            <img src={tools[6]} alt="" className="absolute -bottom-8 w-12 h-12 opacity-90" />
          </div>

          {/* INNER RING */}
          <div className="absolute w-[38%] h-[38%] border border-orange-500/15 rounded-full flex justify-center items-center animate-spin-slow-reverse">
            <img src={tools[7]} alt="" className="absolute -left-5 w-10 h-10 opacity-90" />
            <img src={tools[8]} alt="" className="absolute -right-5 w-10 h-10 opacity-90" />
          </div>

          {/* Center Circle */}
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full shadow-[0_0_20px_rgba(255,115,0,0.2)]"></div>
        </div>

        {/* RIGHT — Content */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-50 leading-tight">
            Master In-Demand Tools <br /> and Technologies
          </h2>

          <p className="text-orange-100/80 text-base leading-relaxed">
            At <span className="text-orange-400 font-semibold">RexGalaxy Academy</span>, we bridge the gap
            between beginner curiosity and expert capability. Whether you’re diving into web development,
            mastering Artificial Intelligence, or exploring digital marketing, our programs are built to
            transform your skills into professional power.
          </p>

          <p className="text-orange-100/70 text-sm leading-relaxed">
            From Python and React to cutting-edge Generative AI, Cloud, and Data Science tools — our
            ecosystem ensures you gain not only technical knowledge but also the practical insights that
            make you job-ready and future-proof in the fast-moving tech landscape.
          </p>

  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black font-semibold py-3.5 px-7 transition">
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-7 transition">
              View Curriculum
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
