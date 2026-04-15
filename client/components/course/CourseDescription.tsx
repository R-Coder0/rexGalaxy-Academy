"use client";

import { useState } from "react";

type LegacyCourseDescriptionData = {
  title: string;
  fullDescription: string;
  objectives: string[];
};

export default function CourseDescription({
  course,
}: {
  course: LegacyCourseDescriptionData;
}) {
  const [expanded, setExpanded] = useState(false);

  const descriptionToShow = expanded
    ? course.fullDescription
    : course.fullDescription.slice(0, 1500) + "...";

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        Overview of {course.title}
      </h2>

      <div
        className="text-gray-400 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: descriptionToShow }}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-orange-500 font-medium"
      >
        {expanded ? "Read less" : "Read more"}
      </button>

      <h3 className="text-xl font-semibold mt-8 mb-4">
        Course Objectives
      </h3>

      <ul className="space-y-2">
        {course.objectives.map((obj: string, i: number) => (
          <li key={i} className="flex gap-2">
            <span className="text-orange-500">✔</span>
            {obj}
          </li>
        ))}
      </ul>
    </section>
  );
}
