/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import brain from "@/public/icons/brain.svg";
import award from "@/public/icons/award.svg";
import briefcase from "@/public/icons/briefcase.svg";
import users from "@/public/icons/users.svg";

interface Feature {
  iconSrc: any;
  title: string;
}

export default function FeatureStrip() {
  const features: Feature[] = [
    { iconSrc: brain, title: "Learn Essential Skills" },
    { iconSrc: award, title: "Earn Certifications & Degrees" },
    { iconSrc: briefcase, title: "Career-Ready Programs" },
    { iconSrc: users, title: "Master Multiple Domains" },
  ];

  return (
    <section className="border-t border-white/5 bg-[var(--surface)]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
          {features.map((item, index) => (
            <div key={index} className="group flex items-center gap-4">
              <div
                className="flex items-center justify-center transition-all duration-300
                           group-hover:border-[var(--brand)]
                           group-hover:bg-[var(--brand-soft)]"
              >
<img
  src={item.iconSrc.src || item.iconSrc}
  alt=""
  width={44}
  height={44}
  className="opacity-90 group-hover:opacity-100 transition-opacity"
/>
              </div>

              <div className="pt-1">
                <h3 className="text-sm sm:text-base font-medium text-white/80 leading-snug tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}