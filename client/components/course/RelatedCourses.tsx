import Link from "next/link";
import { courses } from "@/data/courseData";   // ✅ updated import

export default function RelatedCourses({
  currentSlug,
  category
}: {
  currentSlug: string;
  category: string;
}) {

  const related = courses.filter(
    c => c.category === category && c.slug !== currentSlug
  );

  if (!related.length) return null;

  return (
    <section className="bg-zinc-900 border border-orange-500/20 rounded-xl p-6">
      <h3 className="bg-orange-500 p-2 rounded-md text-lg font-semibold mb-4 text-white border-b border-orange-500/20 pb-2">
        Other Related Courses
      </h3>

      <div className="space-y-3">
        {related.map(course => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="
              block rounded-md border border-orange-500/10
              p-4 transition
              hover:border-orange-500
              hover:bg-black
            "
          >
            <p className="font-medium text-white">
              {course.title}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {course.shortDescription}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}