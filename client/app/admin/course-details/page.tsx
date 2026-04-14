/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  FilePlus2,
  Layers3,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import "quill/dist/quill.snow.css";

type CategoryOption = {
  _id: string;
  title: string;
  slug: string;
};

type SubcategoryOption = {
  _id: string;
  title: string;
  slug: string;
  categoryId:
    | string
    | {
        _id: string;
        title: string;
        slug: string;
      };
};

type ContentBlock = {
  title: string;
  content: string;
};

type CourseDetailForm = {
  title: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  categoryId: string;
  subcategoryId: string;
  brochureUrl: string;
  duration: string;
  conclusionTitle: string;
  conclusionContent: string;
  isActive: boolean;
  aboutCourse: ContentBlock[];
  modules: ContentBlock[];
};

type BrochureState = {
  file: File | null;
  existingUrl: string;
};

type CourseDetailItem = {
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
  conclusionTitle?: string;
  conclusionContent?: string;
  isActive: boolean;
  categoryId?: {
    _id: string;
    title: string;
    slug: string;
  };
  subcategoryId?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  aboutCourse: Array<{
    title: string;
    content: string;
    order?: number;
  }>;
  modules: Array<{
    moduleNumber?: number;
    title: string;
    content: string;
  }>;
  updatedAt: string;
};

type FormErrors = Partial<
  Record<
    keyof Omit<CourseDetailForm, "aboutCourse" | "modules" | "isActive">,
    string
  >
> & {
  aboutCourse?: string;
  modules?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_ORIGIN = API?.replace(/\/api\/?$/, "") || "";

const emptyBlock = (): ContentBlock => ({
  title: "",
  content: "",
});

const initialForm: CourseDetailForm = {
  title: "",
  slug: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  categoryId: "",
  subcategoryId: "",
  brochureUrl: "",
  duration: "",
  conclusionTitle: "",
  conclusionContent: "",
  isActive: true,
  aboutCourse: [emptyBlock()],
  modules: [emptyBlock()],
};

const cardStyle: CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
  boxShadow: "var(--shadow-sm)",
};

const fieldSurface: CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--border-strong)",
};

function toFormState(item: CourseDetailItem): CourseDetailForm {
  return {
    title: item.title || "",
    slug: item.slug || "",
    description: item.description || "",
    metaTitle: item.metaTitle || "",
    metaDescription: item.metaDescription || "",
    metaKeywords: Array.isArray(item.metaKeywords)
      ? item.metaKeywords.join(", ")
      : "",
    canonicalUrl: item.canonicalUrl || "",
    categoryId: item.categoryId?._id || "",
    subcategoryId: item.subcategoryId?._id || "",
    brochureUrl: item.brochureUrl || "",
    duration: item.duration || "",
    conclusionTitle: item.conclusionTitle || "",
    conclusionContent: item.conclusionContent || "",
    isActive: item.isActive ?? true,
    aboutCourse:
      item.aboutCourse?.map((block) => ({
        title: block.title || "",
        content: block.content || "",
      })) || [emptyBlock()],
    modules:
      item.modules?.map((module) => ({
        title: module.title || "",
        content: module.content || "",
      })) || [emptyBlock()],
  };
}

function makeSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminCourseDetailsPage() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [items, setItems] = useState<CourseDetailItem[]>([]);
  const [form, setForm] = useState<CourseDetailForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [brochure, setBrochure] = useState<BrochureState>({
    file: null,
    existingUrl: "",
  });

  const filteredSubcategories = useMemo(() => {
    if (!form.categoryId) return [];
    return subcategories.filter((item) => {
      const categoryId =
        typeof item.categoryId === "string" ? item.categoryId : item.categoryId?._id;
      return String(categoryId) === String(form.categoryId);
    });
  }, [form.categoryId, subcategories]);

  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const haystack = [
        item.title,
        item.slug,
        item.categoryId?.title,
        item.subcategoryId?.title,
        item.duration,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, q]);

  const fetchMeta = async () => {
    setMetaLoading(true);
    try {
      const [categoryRes, subcategoryRes] = await Promise.all([
        fetch(`${API}/course-menu/admin/categories`),
        fetch(`${API}/course-menu/admin/subcategories`),
      ]);

      const categoryData = await categoryRes.json().catch(() => null);
      const subcategoryData = await subcategoryRes.json().catch(() => null);

      setCategories(Array.isArray(categoryData?.data) ? categoryData.data : []);
      setSubcategories(
        Array.isArray(subcategoryData?.data) ? subcategoryData.data : []
      );
    } catch {
      setCategories([]);
      setSubcategories([]);
    } finally {
      setMetaLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/course-details/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message || "Failed to load course details.");
        setLoading(false);
        return;
      }

      setItems(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Server not reachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditingId(null);
    setBrochure({ file: null, existingUrl: "" });
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.categoryId) nextErrors.categoryId = "Category is required";
    if (!form.duration.trim()) nextErrors.duration = "Duration is required";

    const aboutValid = form.aboutCourse.some(
      (block) => block.title.trim() && block.content.trim()
    );
    if (!aboutValid) nextErrors.aboutCourse = "Add at least one valid about course block";

    const modulesValid = form.modules.some(
      (block) => block.title.trim() && block.content.trim()
    );
    if (!modulesValid) nextErrors.modules = "Add at least one valid module";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append("title", form.title.trim());
    payload.append("slug", makeSlug(form.slug || form.title));
    payload.append("description", form.description.trim());
    payload.append("metaTitle", form.metaTitle.trim());
    payload.append("metaDescription", form.metaDescription.trim());
    payload.append("metaKeywords", form.metaKeywords);
    payload.append("canonicalUrl", form.canonicalUrl.trim());
    payload.append("categoryId", form.categoryId);
    payload.append("subcategoryId", form.subcategoryId);
    payload.append("brochureUrl", brochure.existingUrl || "");
    payload.append("duration", form.duration.trim());
    payload.append("conclusionTitle", form.conclusionTitle.trim());
    payload.append("conclusionContent", form.conclusionContent.trim());
    payload.append("isActive", String(form.isActive));
    payload.append(
      "aboutCourse",
      JSON.stringify(
        form.aboutCourse
          .filter((block) => block.title.trim() && block.content.trim())
          .map((block, index) => ({
            title: block.title.trim(),
            content: block.content.trim(),
            order: index,
          }))
      )
    );
    payload.append(
      "modules",
      JSON.stringify(
        form.modules
          .filter((block) => block.title.trim() && block.content.trim())
          .map((block) => ({
            title: block.title.trim(),
            content: block.content.trim(),
          }))
      )
    );

    if (brochure.file) {
      payload.append("brochure", brochure.file);
    }

    return payload;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not logged in.");
        return;
      }

      const isEditing = Boolean(editingId);
      const res = await fetch(
        isEditing
          ? `${API}/course-details/admin/${editingId}`
          : `${API}/course-details/admin`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: buildPayload(),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save course detail.");
      }

      setMessage(
        isEditing
          ? "Course detail updated successfully."
          : "Course detail created successfully."
      );
      resetForm();
      fetchItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save course detail."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course detail?")) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const res = await fetch(`${API}/course-details/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        alert(data?.message || "Failed to delete course detail.");
        return;
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
      if (editingId === id) resetForm();
    } catch {
      alert("Server not reachable. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item: CourseDetailItem) => {
    setEditingId(item._id);
    setForm(toFormState(item));
    setBrochure({ file: null, existingUrl: item.brochureUrl || "" });
    setErrors({});
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
      ...(name === "title" && !editingId && !prev.slug
        ? { slug: makeSlug(value) }
        : {}),
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBrochureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBrochure((prev) => ({
      ...prev,
      file,
    }));
  };

  const updateBlock = (
    section: "aboutCourse" | "modules",
    index: number,
    key: keyof ContentBlock,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].map((block, blockIndex) =>
        blockIndex === index ? { ...block, [key]: value } : block
      ),
    }));
  };

  const addBlock = (section: "aboutCourse" | "modules") => {
    setForm((prev) => ({
      ...prev,
      [section]: [...prev[section], emptyBlock()],
    }));
  };

  const removeBlock = (section: "aboutCourse" | "modules", index: number) => {
    setForm((prev) => ({
      ...prev,
      [section]:
        prev[section].length > 1
          ? prev[section].filter((_, blockIndex) => blockIndex !== index)
          : [emptyBlock()],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className="badge badge-brand"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              Admin
            </span>
            <h1
              className="mt-3 text-2xl"
              style={{
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.03em",
              }}
            >
              Course Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              Create SEO-ready course detail pages with structured about, modules and conclusion content.
            </p>
          </div>

          <button onClick={fetchItems} className="btn btn-outline btn-md">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl" style={cardStyle}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
            >
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                {editingId ? "Edit Course Detail" : "Create Course Detail"}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                Use the editor toolbar to format content without writing HTML code.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFieldChange}
              error={errors.title}
              placeholder="Full Stack Java Course"
            />

            <Field
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={handleFieldChange}
              placeholder="full-stack-java-course"
            />

            <TextAreaField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              error={errors.description}
              placeholder="Short summary for course details page."
              rows={4}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Meta Title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleFieldChange}
                placeholder="Meta title"
              />
              <Field
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={handleFieldChange}
                error={errors.duration}
                placeholder="4-6 Months"
              />
            </div>

            <TextAreaField
              label="Meta Description"
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleFieldChange}
              placeholder="Meta description"
              rows={3}
            />

            <Field
              label="Meta Keywords"
              name="metaKeywords"
              value={form.metaKeywords}
              onChange={handleFieldChange}
              placeholder="keyword one, keyword two, keyword three"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleFieldChange}
                error={errors.categoryId}
                options={categories.map((item) => ({
                  value: item._id,
                  label: item.title,
                }))}
                disabled={metaLoading}
              />

              <SelectField
                label="Sub Category"
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleFieldChange}
                options={filteredSubcategories.map((item) => ({
                  value: item._id,
                  label: item.title,
                }))}
                disabled={metaLoading || !form.categoryId}
                optional
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Canonical URL"
                name="canonicalUrl"
                value={form.canonicalUrl}
                onChange={handleFieldChange}
                placeholder="https://example.com/courses/slug"
              />
              <div>
                <label
                  className="mb-2 block text-[11px] font-semibold uppercase"
                  style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
                >
                  Upload Brochure
                </label>
                <div
                  className="rounded-xl px-4 py-3"
                  style={fieldSurface}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    onChange={handleBrochureChange}
                    className="w-full text-sm"
                    style={{ color: "var(--text)" }}
                  />
                  {brochure.file ? (
                    <p className="mt-2 text-xs" style={{ color: "var(--brand)" }}>
                      Selected: {brochure.file.name}
                    </p>
                  ) : brochure.existingUrl ? (
                    <a
                      href={`${API_ORIGIN}${brochure.existingUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs underline"
                      style={{ color: "var(--brand)" }}
                    >
                      View current brochure
                    </a>
                  ) : (
                    <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      Upload brochure file directly.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <SectionEditor
              title="About Course"
              subtitle="Add as many title/content sections as needed."
              icon={<BookOpen className="h-4 w-4" />}
              blocks={form.aboutCourse}
              onAdd={() => addBlock("aboutCourse")}
              onRemove={(index) => removeBlock("aboutCourse", index)}
              onChange={(index, key, value) =>
                updateBlock("aboutCourse", index, key, value)
              }
              error={errors.aboutCourse}
              labelPrefix="About"
            />

            <SectionEditor
              title="Course Modules"
              subtitle="Module numbering is automatic in backend."
              icon={<Layers3 className="h-4 w-4" />}
              blocks={form.modules}
              onAdd={() => addBlock("modules")}
              onRemove={(index) => removeBlock("modules", index)}
              onChange={(index, key, value) =>
                updateBlock("modules", index, key, value)
              }
              error={errors.modules}
              labelPrefix="Module"
            />

            <div className="rounded-2xl p-4" style={fieldSurface}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Conclusion
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    Optional ending section for course detail page.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Field
                  label="Conclusion Title"
                  name="conclusionTitle"
                  value={form.conclusionTitle}
                  onChange={handleFieldChange}
                  placeholder="Why Choose This Course?"
                />
                <RichTextEditor
                  label="Conclusion Content"
                  value={form.conclusionContent}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, conclusionContent: value }))
                  }
                  placeholder="Write final summary content here..."
                />
              </div>
            </div>

            <label
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={fieldSurface}
            >
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleFieldChange}
              />
              <span style={{ color: "var(--text)" }}>Active and visible on public side</span>
            </label>

            {message ? (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "#6ee7b7",
                }}
              >
                {message}
              </div>
            ) : null}

            {error ? (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="btn btn-primary btn-md">
                {editingId ? (
                  <>
                    <Save className="h-4 w-4" />
                    {submitting ? "Updating..." : "Update Detail"}
                  </>
                ) : (
                  <>
                    <FilePlus2 className="h-4 w-4" />
                    {submitting ? "Creating..." : "Create Detail"}
                  </>
                )}
              </button>

              <button type="button" onClick={resetForm} className="btn btn-outline btn-md">
                Reset
              </button>
            </div>
          </form>
        </div>

        <div
          className="space-y-6 border-t p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  Saved Course Details
                </h2>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  Search, edit or delete course detail pages from here.
                </p>
              </div>

              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={fieldSurface}
              >
                <Search className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by title, slug, category..."
                  className="w-full min-w-[240px] bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
              </div>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Showing: <span style={{ color: "var(--brand)" }}>{filteredItems.length}</span>
                <span style={{ color: "var(--text-dim)" }}> / {items.length}</span>
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Latest updated first
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                Loading course details...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-6 text-sm" style={{ color: "var(--text-dim)" }}>
                No course details found.
              </div>
            ) : (
              <div>
                {filteredItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="px-6 py-5"
                    style={{
                      borderBottom:
                        index < filteredItems.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                            {item.title}
                          </h3>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: item.isActive
                                ? "rgba(16,185,129,0.10)"
                                : "rgba(239,68,68,0.10)",
                              border: item.isActive
                                ? "1px solid rgba(16,185,129,0.22)"
                                : "1px solid rgba(239,68,68,0.22)",
                              color: item.isActive ? "#6ee7b7" : "#fca5a5",
                            }}
                          >
                            {item.isActive ? "active" : "inactive"}
                          </span>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: "var(--brand-soft)",
                              border: "1px solid rgba(255,107,0,0.22)",
                              color: "var(--brand)",
                            }}
                          >
                            {item.slug}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-dim)" }}>
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                          <span style={{ color: "var(--text-muted)" }}>
                            Category: <strong style={{ color: "var(--text)" }}>{item.categoryId?.title || "-"}</strong>
                          </span>
                          <span style={{ color: "var(--text-muted)" }}>
                            Subcategory: <strong style={{ color: "var(--text)" }}>{item.subcategoryId?.title || "-"}</strong>
                          </span>
                          <span style={{ color: "var(--text-muted)" }}>
                            Duration: <strong style={{ color: "var(--text)" }}>{item.duration}</strong>
                          </span>
                          <span style={{ color: "var(--text-muted)" }}>
                            Modules: <strong style={{ color: "var(--text)" }}>{item.modules?.length || 0}</strong>
                          </span>
                          <span style={{ color: "var(--text-muted)" }}>
                            Updated: <strong style={{ color: "var(--text)" }}>{formatDate(item.updatedAt)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="btn btn-outline btn-sm"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="btn btn-sm disabled:opacity-60"
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.22)",
                            color: "rgba(239,68,68,0.88)",
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: "var(--surface-2)",
          border: `1px solid ${
            error ? "rgba(239,68,68,0.35)" : "var(--border-strong)"
          }`,
          color: "var(--text)",
        }}
      />
      {error ? (
        <p className="mt-2 text-xs" style={{ color: "#fca5a5" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </label>
      <textarea
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: "var(--surface-2)",
          border: `1px solid ${
            error ? "rgba(239,68,68,0.35)" : "var(--border-strong)"
          }`,
          color: "var(--text)",
          resize: "vertical",
        }}
      />
      {error ? (
        <p className="mt-2 text-xs" style={{ color: "#fca5a5" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  error,
  options,
  optional,
  ...props
}: {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  optional?: boolean;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: "var(--surface-2)",
          border: `1px solid ${
            error ? "rgba(239,68,68,0.35)" : "var(--border-strong)"
          }`,
          color: "var(--text)",
        }}
      >
        <option value="">
          {optional ? "Select if needed" : "Select option"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-2 text-xs" style={{ color: "#fca5a5" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionEditor({
  title,
  subtitle,
  icon,
  blocks,
  onAdd,
  onRemove,
  onChange,
  error,
  labelPrefix,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  blocks: ContentBlock[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, key: keyof ContentBlock, value: string) => void;
  error?: string;
  labelPrefix: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {title}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              {subtitle}
            </p>
          </div>
        </div>

        <button type="button" onClick={onAdd} className="btn btn-outline btn-sm">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={`${labelPrefix}-${index}`}
            className="rounded-xl p-4"
            style={{
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {labelPrefix} {index + 1}
              </p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="btn btn-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  color: "rgba(239,68,68,0.88)",
                }}
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <Field
                label={`${labelPrefix} Title`}
                value={block.title}
                onChange={(e) => onChange(index, "title", e.target.value)}
                placeholder={`Enter ${labelPrefix.toLowerCase()} title`}
              />
              <RichTextEditor
                label={`${labelPrefix} Content (HTML Allowed)`}
                value={block.content}
                onChange={(value) => onChange(index, "content", value)}
                placeholder={`Write ${labelPrefix.toLowerCase()} content here...`}
              />
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-3 text-xs" style={{ color: "#fca5a5" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const syncingRef = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!hostRef.current || quillRef.current) return;

      const { default: Quill } = await import("quill");
      if (!mounted || !hostRef.current) return;

      const toolbar = document.createElement("div");
      const editor = document.createElement("div");
      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(toolbar);
      hostRef.current.appendChild(editor);

      const quill = new Quill(editor, {
        theme: "snow",
        placeholder: placeholder || "",
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });

      quill.clipboard.dangerouslyPasteHTML(value || "");
      quill.on("text-change", () => {
        if (syncingRef.current) return;
        onChangeRef.current(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }

    init();

    return () => {
      mounted = false;
      quillRef.current = null;
    };
  }, [placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const nextValue = value || "";
    const currentValue = quill.root.innerHTML;

    if (currentValue === nextValue) return;

    syncingRef.current = true;
    quill.clipboard.dangerouslyPasteHTML(nextValue);
    syncingRef.current = false;
  }, [value]);

  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--text-dim)" }}
      >
        {label}
      </label>

      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
        }}
        ref={hostRef}
      />

      <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
        Tip: use the toolbar to add headings, bullet points, numbering, links and inline formatting.
      </p>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid var(--border);
          background: var(--surface-3);
        }

        .ql-container.ql-snow {
          border: 0;
          min-height: 180px;
          font-size: 14px;
          color: var(--text);
        }

        .ql-editor {
          min-height: 180px;
          color: var(--text);
        }

        .ql-snow .ql-stroke {
          stroke: rgba(255, 255, 255, 0.78);
        }

        .ql-snow .ql-fill {
          fill: rgba(255, 255, 255, 0.78);
        }

        .ql-snow .ql-picker {
          color: var(--text);
        }

        .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.35);
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
