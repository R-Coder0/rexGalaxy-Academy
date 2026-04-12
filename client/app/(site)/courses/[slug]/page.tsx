import { courses } from "@/data/courseData";   // ✅ UPDATED IMPORT
import { notFound } from "next/navigation";

import CourseHero from "@/components/course/courseHero";
import CourseDescription from "@/components/course/CourseDescription";
import CourseEnquiryForm from "@/components/course/CourseEnquiryForm";
import RelatedCourses from "@/components/course/RelatedCourses";
import CourseExpertise from "@/components/course/CourseExpertise";
import InfoBar from "@/components/course/Infobar";
import CourseTabs from "@/components/course/CourseTabs";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const course = courses.find((c) => c.slug === slug);
  if (!course) return notFound();

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <CourseHero course={course} />

      {/* STATIC EXPERTISE + META */}
      <CourseExpertise />

      {/* MAIN CONTENT + SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-12">
          <CourseDescription course={course} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-1">

          {/* SINGLE STICKY CONTAINER */}
          <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col gap-6">

            {/* FIXED FORM */}
            <div className="shrink-0">
              <CourseEnquiryForm courseName={course.title} />
            </div>

            {/* SCROLLABLE RELATED COURSES */}
            <div className="flex-1 overflow-y-auto pr-2">
              <RelatedCourses
                currentSlug={course.slug}
                category={course.category}
              />
            </div>

          </div>

        </div>

      </div>

      <InfoBar />

      <div className="bg-gray-50">
        <CourseTabs courseSlug={params.slug} />
      </div>

    </div>
  );
}