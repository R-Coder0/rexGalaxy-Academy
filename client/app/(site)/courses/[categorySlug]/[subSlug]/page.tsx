/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/course-detail/CourseDetailPage";
import { resolveCoursePageByCategoryAndSubcategory } from "@/lib/course-detail";

export default async function CourseSubcategoryPage({
  params,
}: any) {
  const data = await resolveCoursePageByCategoryAndSubcategory(
    params.categorySlug,
    params.subSlug
  );

  if (!data) return notFound();

  return <CourseDetailPage data={data} />;
}