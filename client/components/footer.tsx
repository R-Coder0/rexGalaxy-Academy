/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  MessageCircle,
} from "lucide-react";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_EMAIL_LINK,
  SITE_LOCATION_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_LINK,
  SITE_WHATSAPP_LINK,
} from "@/lib/site-contact";

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Courses", href: "/courses" },
  { name: "Career Guidance", href: "/career-guidance" },
  { name: "Placement", href: "/placement" },
  { name: "Contact Us", href: "/contact-us" },
];

const supportLinks = [
  { name: "Online Registration", href: "/online-registration" },
  { name: "Talk to Counsellor", href: "/contact-us" },
  { name: "Explore Courses", href: "/courses" },
  { name: "Placement Support", href: "/placement" },
  { name: "Career Help", href: "/career-guidance" },
  { name: "Visit Office", href: "/contact-us" },
];

const popularCourses = [
  "Python",
  "Java",
  "Data Science",
  "Machine Learning",
  "Generative AI",
  "Power BI",
  "Business Analyst",
  "Cyber Security",
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 border-b border-neutral-800 pb-10 md:grid-cols-4 md:gap-12 md:pb-12 lg:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-start gap-3">
              <div>
                <img
                  src="/logo.png"
                  alt="Rex Galaxy Academy Logo"
                  className="h-20 w-auto rounded-lg object-contain shadow-lg"
                />
                <p className="mt-2 max-w-sm text-sm text-gray-400">
                  Practical, industry-aligned training with real mentorship,
                  projects, and career support from our {SITE_LOCATION_NAME.toLowerCase()}.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE_PHONE_LINK}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <Phone size={16} />
                Call
              </a>
              <a
                href={SITE_EMAIL_LINK}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <Mail size={16} />
                Email
              </a>
              <a
                href={SITE_WHATSAPP_LINK}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>

            <address className="mt-6 space-y-3 border-l-2 border-orange-500 pl-4 text-sm not-italic text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{SITE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a className="transition hover:text-white" href={SITE_PHONE_LINK}>
                  {SITE_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a className="transition hover:text-white" href={SITE_EMAIL_LINK}>
                  {SITE_EMAIL}
                </a>
              </div>
            </address>
          </div>

          <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-3 lg:col-span-3 md:gap-12">
            <div>
              <h4 className="mb-4 text-md font-bold text-orange-500">Company</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-md font-bold text-orange-500">Support</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-md font-bold text-orange-500">Popular Courses</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {popularCourses.map((course) => (
                  <li key={course}>
                    <Link href="/courses" className="transition hover:text-white">
                      {course}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 md:pt-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
              Visit Us
            </p>
            <h4 className="mt-2 text-xl font-extrabold text-white">
              Learn from our {SITE_LOCATION_NAME}
            </h4>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
              Visit our training center for counselling, classroom sessions, course
              guidance, and enrollment support. You can also connect with us by call,
              WhatsApp, or email anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 md:flex-row">
          <div className="text-center text-sm text-gray-500 md:text-left">
            © {new Date().getFullYear()} Rex Galaxy Academy. All rights reserved.
          </div>

          <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition duration-300 hover:bg-orange-700"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
