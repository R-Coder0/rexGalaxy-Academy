export type CourseMenuChild = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
};

export type CourseMenuCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  children: CourseMenuChild[];
};

export type CourseDetailBlock = {
  title: string;
  content: string;
  order: number;
};

export type CourseDetailModule = {
  moduleNumber: number;
  title: string;
  content: string;
};

export type CourseDetailRecord = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  brochureUrl?: string;
  duration: string;
  aboutCourse?: CourseDetailBlock[];
  modules?: CourseDetailModule[];
  conclusionTitle?: string;
  conclusionContent?: string;
  isActive: boolean;
  categoryId?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  subcategoryId?: {
    _id: string;
    title: string;
    slug: string;
    categoryId?: string;
  } | null;
  updatedAt?: string;
};

export type ResolvedCoursePageData = {
  detail: CourseDetailRecord;
  menu: CourseMenuCategory[];
  currentCategory: CourseMenuCategory | null;
  currentSubcategory: CourseMenuChild | null;
  relatedCategories: CourseMenuCategory[];
  siblingSubcategories: CourseMenuChild[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

function buildPublicUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCourseMenu() {
  const response = await fetch(`${API_BASE}/course-menu/menu`, {
    cache: "no-store",
  });
  const result = await safeJson<{ success?: boolean; data?: CourseMenuCategory[] }>(
    response
  );

  if (!response.ok || !result?.success || !Array.isArray(result.data)) {
    return [];
  }

  return result.data;
}

async function getCourseDetailBySlug(slug: string) {
  const response = await fetch(`${API_BASE}/course-details/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const result = await safeJson<{ success?: boolean; data?: CourseDetailRecord }>(
    response
  );

  if (!result?.success || !result.data) return null;

  return {
    ...result.data,
    aboutCourse: Array.isArray(result.data.aboutCourse) ? result.data.aboutCourse : [],
    modules: Array.isArray(result.data.modules) ? result.data.modules : [],
  };
}

async function getCourseDetailsByQuery(query: string) {
  const response = await fetch(`${API_BASE}/course-details?${query}`, {
    cache: "no-store",
  });
  const result = await safeJson<{ success?: boolean; data?: CourseDetailRecord[] }>(
    response
  );

  if (!response.ok || !result?.success || !Array.isArray(result.data)) {
    return [];
  }

  return result.data;
}

function mapRelations(
  menu: CourseMenuCategory[],
  detail: CourseDetailRecord,
  matchedCategorySlug?: string,
  matchedSubSlug?: string
) {
  const categorySlug = detail.categoryId?.slug || matchedCategorySlug || "";
  const subSlug = detail.subcategoryId?.slug || matchedSubSlug || "";

  const currentCategory =
    menu.find((category) => category.slug === categorySlug) || null;
  const currentSubcategory =
    currentCategory?.children.find((child) => child.slug === subSlug) || null;

  return {
    currentCategory,
    currentSubcategory,
    relatedCategories: menu.filter((category) => category.slug !== currentCategory?.slug),
    siblingSubcategories: currentCategory
      ? currentCategory.children.filter((child) => child.slug !== currentSubcategory?.slug)
      : [],
  };
}

export async function resolveCoursePageBySlug(
  slug: string
): Promise<ResolvedCoursePageData | null> {
  const menu = await getCourseMenu();

  const directDetail = await getCourseDetailBySlug(slug);
  if (directDetail) {
    return {
      detail: directDetail,
      menu,
      ...mapRelations(menu, directDetail),
    };
  }

  const category = menu.find((item) => item.slug === slug);
  if (!category) return null;

  const details = await getCourseDetailsByQuery(`categoryId=${category._id}`);
  const summary = details.find((item) => !item.subcategoryId) || details[0];
  if (!summary) return null;

  const detail = await getCourseDetailBySlug(summary.slug);
  if (!detail) return null;

  return {
    detail,
    menu,
    ...mapRelations(menu, detail, category.slug),
  };
}

export async function resolveCoursePageByCategoryAndSubcategory(
  categorySlug: string,
  subSlug: string
): Promise<ResolvedCoursePageData | null> {
  const menu = await getCourseMenu();
  const category = menu.find((item) => item.slug === categorySlug);
  const subcategory = category?.children.find((item) => item.slug === subSlug);

  if (!category || !subcategory) return null;

  const details = await getCourseDetailsByQuery(
    `categoryId=${category._id}&subcategoryId=${subcategory._id}`
  );
  const summary = details[0];
  if (!summary) return null;

  const detail = await getCourseDetailBySlug(summary.slug);
  if (!detail) return null;

  return {
    detail,
    menu,
    ...mapRelations(menu, detail, category.slug, subcategory.slug),
  };
}

export function getPublicAssetUrl(path?: string) {
  return buildPublicUrl(path);
}
