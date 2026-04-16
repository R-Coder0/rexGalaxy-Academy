import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/course-detail/CourseDetailPage";
import { resolveCoursePageBySlug } from "@/lib/course-detail";

export default async function CourseCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const data = await resolveCoursePageBySlug(categorySlug);

  if (!data) return notFound();

  return <CourseDetailPage data={data} />;
}
