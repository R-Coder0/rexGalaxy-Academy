import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/course-detail/CourseDetailPage";
import { resolveCoursePageByCategoryAndSubcategory } from "@/lib/course-detail";

export default async function CourseSubcategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subSlug: string }>;
}) {
  const { categorySlug, subSlug } = await params;
  const data = await resolveCoursePageByCategoryAndSubcategory(
    categorySlug,
    subSlug
  );

  if (!data) return notFound();

  return <CourseDetailPage data={data} />;
}
