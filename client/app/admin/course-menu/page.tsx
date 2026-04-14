"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Loader2,
  RefreshCw,
} from "lucide-react";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Subcategory = {
  _id: string;
  categoryId:
    | string
    | {
        _id: string;
        title: string;
        slug: string;
      };
  title: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type MenuForm = {
  parentCategoryId: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: string;
  isActive: boolean;
};

const initialForm: MenuForm = {
  parentCategoryId: "",
  title: "",
  slug: "",
  description: "",
  icon: "",
  order: "0",
  isActive: true,
};

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getCategoryId(value: Subcategory["categoryId"]) {
  return typeof value === "string" ? value : value?._id || "";
}

export default function AdminCourseMenuPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [form, setForm] = useState<MenuForm>(initialForm);
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: "category" | "subcategory";
  } | null>(null);

  const isSubcategoryMode = Boolean(form.parentCategoryId);
  const isEditing = Boolean(editingItem);

  const groupedSubcategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      children: subcategories
        .filter((sub) => getCategoryId(sub.categoryId) === category._id)
        .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    }));
  }, [categories, subcategories]);

  async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result?.success) {
      throw new Error(result?.message || "Request failed");
    }

    return result as T;
  }

  async function fetchAll(showRefresh = false) {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const [catRes, subRes] = await Promise.all([
        request<ApiResponse<Category[]>>(`${API_BASE}/course-menu/admin/categories`),
        request<ApiResponse<Subcategory[]>>(`${API_BASE}/course-menu/admin/subcategories`),
      ]);

      setCategories(
        [...catRes.data].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      );
      setSubcategories(subRes.data);
    } catch (error) {
      setPageMessage(error instanceof Error ? error.message : "Failed to load data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setPageMessage("");

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    try {
      setSaving(true);

      const commonPayload = {
        title: form.title.trim(),
        slug: makeSlug(form.slug || form.title),
        description: form.description.trim(),
        order: Number(form.order || 0),
        isActive: form.isActive,
      };

      if (isSubcategoryMode) {
        const payload = {
          ...commonPayload,
          categoryId: form.parentCategoryId,
        };

        if (editingItem?.type === "subcategory") {
          await request<ApiResponse<Subcategory>>(
            `${API_BASE}/course-menu/admin/subcategories/${editingItem.id}`,
            {
              method: "PATCH",
              body: JSON.stringify(payload),
            }
          );
          setPageMessage("Subcategory updated successfully.");
        } else {
          await request<ApiResponse<Subcategory>>(
            `${API_BASE}/course-menu/admin/subcategories`,
            {
              method: "POST",
              body: JSON.stringify(payload),
            }
          );
          setPageMessage("Subcategory created successfully.");
        }
      } else {
        const payload = {
          ...commonPayload,
          icon: form.icon.trim(),
        };

        if (editingItem?.type === "category") {
          await request<ApiResponse<Category>>(
            `${API_BASE}/course-menu/admin/categories/${editingItem.id}`,
            {
              method: "PATCH",
              body: JSON.stringify(payload),
            }
          );
          setPageMessage("Category updated successfully.");
        } else {
          await request<ApiResponse<Category>>(
            `${API_BASE}/course-menu/admin/categories`,
            {
              method: "POST",
              body: JSON.stringify(payload),
            }
          );
          setPageMessage("Category created successfully.");
        }
      }

      resetForm();
      await fetchAll(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingItem(null);
    setFormError("");
  }

  function startEditCategory(item: Category) {
    setEditingItem({
      id: item._id,
      type: "category",
    });

    setForm({
      parentCategoryId: "",
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      icon: item.icon || "",
      order: String(item.order ?? 0),
      isActive: item.isActive,
    });

    setFormError("");
    setPageMessage("");
  }

  function startEditSubcategory(item: Subcategory) {
    setEditingItem({
      id: item._id,
      type: "subcategory",
    });

    setForm({
      parentCategoryId: getCategoryId(item.categoryId),
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      icon: "",
      order: String(item.order ?? 0),
      isActive: item.isActive,
    });

    setFormError("");
    setPageMessage("");
  }

  async function handleDeleteCategory(id: string) {
    const ok = window.confirm(
      "Delete this category? Make sure it has no subcategories."
    );
    if (!ok) return;

    try {
      setPageMessage("");
      await request<ApiResponse<{ id: string }>>(
        `${API_BASE}/course-menu/admin/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      setPageMessage("Category deleted successfully.");
      await fetchAll(true);
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Failed to delete category."
      );
    }
  }

  async function handleDeleteSubcategory(id: string) {
    const ok = window.confirm("Delete this subcategory?");
    if (!ok) return;

    try {
      setPageMessage("");
      await request<ApiResponse<{ id: string }>>(
        `${API_BASE}/course-menu/admin/subcategories/${id}`,
        {
          method: "DELETE",
        }
      );
      setPageMessage("Subcategory deleted successfully.");
      await fetchAll(true);
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Failed to delete subcategory."
      );
    }
  }

  const formTitle = isEditing
    ? isSubcategoryMode
      ? "Edit Subcategory"
      : "Edit Category"
    : isSubcategoryMode
    ? "Create Subcategory"
    : "Create Category";

  const formDescription = isSubcategoryMode
    ? "Parent category select karoge to item subcategory ke roop me create hoga."
    : "Parent category blank chhodoge to ye main category create hogi.";

  const submitLabel = isEditing
    ? isSubcategoryMode
      ? "Update Subcategory"
      : "Update Category"
    : isSubcategoryMode
    ? "Create Subcategory"
    : "Create Category";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="border-b border-white/5 px-6 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                <FolderTree className="h-4 w-4 text-[var(--ai-cyan)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Admin · Course Menu
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                Manage Categories & Subcategories
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/65">
                Ek hi form se main category aur subcategory dono create karo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchAll(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{formTitle}</h2>
                  <p className="mt-1 text-sm text-white/55">{formDescription}</p>
                </div>

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-[var(--brand)]">
                  {isEditing ? (
                    <Pencil className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="field">
                  <label className="label">Parent Category</label>
                  <select
                    className="select"
                    value={form.parentCategoryId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        parentCategoryId: e.target.value,
                        icon: e.target.value ? "" : prev.icon,
                      }))
                    }
                  >
                    <option value="">No parent (Create as Main Category)</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="label">
                    {isSubcategoryMode ? "Subcategory Title" : "Category Title"}
                  </label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder={
                      isSubcategoryMode
                        ? "e.g. Java"
                        : "e.g. Software Development"
                    }
                  />
                </div>

                <div className="field">
                  <label className="label">Slug</label>
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="auto-from-title"
                  />
                </div>

                <div className="field">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Optional short description"
                  />
                </div>

                <div className={`grid gap-4 ${isSubcategoryMode ? "grid-cols-1" : "sm:grid-cols-2"}`}>
                  {!isSubcategoryMode ? (
                    <div className="field">
                      <label className="label">Icon</label>
                      <input
                        className="input"
                        value={form.icon}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, icon: e.target.value }))
                        }
                        placeholder="code / cloud / shield"
                      />
                    </div>
                  ) : null}

                  <div className="field">
                    <label className="label">Order</label>
                    <input
                      type="number"
                      className="input"
                      value={form.order}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, order: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  {isSubcategoryMode ? "Active Subcategory" : "Active Category"}
                </label>

                {formError ? <p className="error">{formError}</p> : null}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary btn-md flex-1"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditing ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {submitLabel}
                  </button>

                  {isEditing ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-outline btn-md"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Menu Structure</h2>
                <p className="mt-1 text-sm text-white/55">
                  Live view of categories and nested subcategories.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                {categories.length} Categories · {subcategories.length} Subcategories
              </div>
            </div>

            {pageMessage ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                {pageMessage}
              </div>
            ) : null}

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
              </div>
            ) : groupedSubcategories.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center text-sm text-white/45">
                No categories created yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {groupedSubcategories.map((category) => (
                  <div
                    key={category._id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {category.title}
                          </h3>
                          <span className="badge badge-brand">
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="badge">Order: {category.order}</span>
                        </div>

                        <p className="mt-2 text-sm text-white/50">/{category.slug}</p>

                        {category.description ? (
                          <p className="mt-2 text-sm text-white/70">
                            {category.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEditCategory(category)}
                          className="btn btn-outline btn-sm"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category._id)}
                          className="btn btn-ghost btn-sm border border-red-500/20 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      {category.children.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-white/45">
                          No subcategories inside this category.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {category.children.map((sub) => (
                            <div
                              key={sub._id}
                              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-white">{sub.title}</p>
                                  <span className="badge badge-ai">
                                    {sub.isActive ? "Active" : "Inactive"}
                                  </span>
                                  <span className="badge">Order: {sub.order}</span>
                                </div>

                                <p className="mt-2 text-sm text-white/50">
                                  /{category.slug}/{sub.slug}
                                </p>

                                {sub.description ? (
                                  <p className="mt-2 text-sm text-white/70">
                                    {sub.description}
                                  </p>
                                ) : null}
                              </div>

                              <div className="flex shrink-0 gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditSubcategory(sub)}
                                  className="btn btn-outline btn-sm"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubcategory(sub._id)}
                                  className="btn btn-ghost btn-sm border border-red-500/20 text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}