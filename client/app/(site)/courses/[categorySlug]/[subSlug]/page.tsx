import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/course-detail/CourseDetailPage";
import { resolveCoursePageByCategoryAndSubcategory } from "@/lib/course-detail";

export default async function CourseSubcategoryPage({
  params,
}: {
  params: { categorySlug: string; subSlug: string };
}) {
  const data = await resolveCoursePageByCategoryAndSubcategory(
    params.categorySlug,
    params.subSlug
  );

  if (!data) return notFound();

  return <CourseDetailPage data={data} />;
}
