import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/course-detail/CourseDetailPage";
import { resolveCoursePageBySlug } from "@/lib/course-detail";

export default async function CourseCategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const data = await resolveCoursePageBySlug(params.categorySlug);

  if (!data) return notFound();

  return <CourseDetailPage data={data} />;
}
