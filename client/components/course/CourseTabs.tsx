/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { courses } from "@/data/courseData";   // ✅ new source

const tabs = [
  "About",
  "Eligibility",
  "Enrollment options",
  "Certificate",
  "FAQs"
];

export default function CourseTabs({
  courseSlug
}: {
  courseSlug: string;
}) {

  // ✅ Find course from merged data
  const course = courses.find(c => c.slug === courseSlug);
  const content = course?.content;

  const [active, setActive] = useState("About");

  if (!content) {
    return <p className="text-red-500">Course data not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* TABS */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-6 py-3 rounded-md font-medium transition
              ${
                active === tab
                  ? "bg-orange-500 text-white"
                  : "bg-orange-50 text-black hover:bg-orange-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="border rounded-xl p-8 bg-white text-gray-800">

        {active === "About" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {content.about.title}
            </h2>
            <ul className="space-y-3">
              {content.about.points.map((item, i) => (
                <li key={i}>
                  <strong className="text-orange-500">
                    {item.title}:
                  </strong>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          </>
        )}

        {active === "Eligibility" && (
          <ul className="space-y-4">
            {content.eligibility.map((item, i) => (
              <li key={i}>
                <strong className="text-orange-500">
                  {item.title}:
                </strong>{" "}
                {item.description}
              </li>
            ))}
          </ul>
        )}

        {active === "Enrollment options" && (
          <ul className="space-y-4">
            {content.enrollment.map((item, i) => (
              <li key={i}>
                <strong className="text-orange-500">
                  {item.title}:
                </strong>{" "}
                {item.description}
              </li>
            ))}
          </ul>
        )}

        {active === "Certificate" && (
          <div className="text-center space-y-6">
            <img
              src={content.certificate.image}
              alt="Certificate"
              className="mx-auto max-w-xl rounded-lg border"
            />
            <p>{content.certificate.text}</p>
          </div>
        )}

        {active === "FAQs" && (
          <div className="space-y-6">
            {content.faqs.map((faq, i) => (
              <div key={i}>
                <p className="font-semibold text-orange-500">
                  Q: {faq.q}
                </p>
                <p>A: {faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}