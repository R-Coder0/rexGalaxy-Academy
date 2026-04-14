/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

type CourseSubItem = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
};

type CourseCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  children: CourseSubItem[];
};

const staticNavItems = [
  { label: "Home", href: "/" },
  { label: "Placement", href: "/placement" },
  { label: "Online Registration", href: "/online-registration" },
  { label: "About", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Career Guidance", href: "/career-guidance" },
  { label: "ContactUs", href: "/contact-us" },
];

export default function Navbar() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const [mobileOpen, setMobileOpen] = useState(false);

  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);

  const [courseMenu, setCourseMenu] = useState<CourseCategory[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeDesktopCategory, setActiveDesktopCategory] = useState<string | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const fetchCourseMenu = async () => {
    try {
      setLoadingCourses(true);
      const res = await fetch(`${API_BASE}/course-menu/menu`, {
        cache: "no-store",
      });
      const result = await res.json();

      if (res.ok && result?.success && Array.isArray(result.data)) {
        setCourseMenu(result.data);
      } else {
        setCourseMenu([]);
      }
    } catch {
      setCourseMenu([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourseMenu();
    return () => clearCloseTimer();
  }, []);

  const navbarItemClass =
    "inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition-colors duration-200 hover:bg-white/6 hover:text-white";

  const dropdownPanelClass =
    "absolute top-full z-50 mt-3 min-w-[260px] overflow-visible border border-white/10 bg-[rgba(10,18,30,0.96)] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(6,14,24,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="RexGalaxy Academy"
            className="h-[74px] w-auto object-contain"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={navbarItemClass}>
            Home
          </Link>

          {/* Courses */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearCloseTimer();
              setCoursesOpen(true);
            }}
            onMouseLeave={() => {
              clearCloseTimer();
              closeTimer.current = setTimeout(() => {
                setCoursesOpen(false);
                setActiveDesktopCategory(null);
              }, 120);
            }}
          >
            <button type="button" className={navbarItemClass}>
              Courses
              <ChevronDown
                className={`h-4 w-4 transition-transform ${coursesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {coursesOpen && (
              <div className={`left-1/2 -translate-x-1/2 ${dropdownPanelClass}`}>
                {loadingCourses ? (
                  <div className="px-4 py-3 text-sm text-white/55">Loading...</div>
                ) : courseMenu.length > 0 ? (
                  <div>
                    {courseMenu.map((category, index) => {
                      const hasChildren = category.children && category.children.length > 0;
                      const isActive = activeDesktopCategory === category._id;

                      return (
                        <div
                          key={category._id}
                          className="relative"
                          onMouseEnter={() => {
                            if (hasChildren) {
                              setActiveDesktopCategory(category._id);
                            } else {
                              setActiveDesktopCategory(null);
                            }
                          }}
                        >
                          <Link
                            href={`/courses/${category.slug}`}
                            className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition ${isActive
                                ? "bg-white/8 text-white"
                                : "text-white/78 hover:bg-white/6 hover:text-white"
                              }`}
                          >
                            <span>{category.title}</span>
                            {hasChildren ? (
                              <ChevronRight className="h-4 w-4 opacity-70" />
                            ) : null}
                          </Link>

                          {index < courseMenu.length - 1 ? (
                            <div className="mx-3 border-b border-dashed border-white/15" />
                          ) : null}

                          {hasChildren && isActive && (
                            <div className="absolute left-full top-0 ml-2 min-w-[260px] border border-white/10 bg-[rgba(10,18,30,0.98)] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                              {category.children.map((child, childIndex) => (
                                <div key={child._id}>
                                  <Link
                                    href={`/courses/${category.slug}/${child.slug}`}
                                    className="block px-3 py-2.5 text-sm text-white/76 transition hover:bg-white/6 hover:text-white"
                                  >
                                    {child.title}
                                  </Link>
                                  {childIndex < category.children.length - 1 ? (
                                    <div className="mx-3 border-b border-dashed border-white/15" />
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-white/55">No courses found.</div>
                )}
              </div>
            )}
          </div>

          {staticNavItems.slice(1).map((item) => (
            <Link key={item.label} href={item.href} className={navbarItemClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[rgba(8,16,28,0.98)] lg:hidden">
          <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/85"
              >
                Home
              </Link>

              {/* Mobile Courses */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileCoursesOpen((prev) => !prev);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white/88"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {mobileCoursesOpen && (
                  <div className="border-t border-white/10 px-3 py-3">
                    {loadingCourses ? (
                      <div className="px-2 py-2 text-sm text-white/55">Loading...</div>
                    ) : courseMenu.length > 0 ? (
                      <div className="space-y-2">
                        {courseMenu.map((category) => {
                          const hasChildren = category.children && category.children.length > 0;
                          const isOpen = activeMobileCategory === category._id;

                          if (!hasChildren) {
                            return (
                              <Link
                                key={category._id}
                                href={`/courses/${category.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-md border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm font-medium text-white/80"
                              >
                                {category.title}
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={category._id}
                              className="overflow-hidden rounded-md border border-white/10 bg-white/[0.02]"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMobileCategory((prev) =>
                                    prev === category._id ? null : category._id
                                  )
                                }
                                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-white/85"
                              >
                                <span>{category.title}</span>
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                                />
                              </button>

                              {isOpen && (
                                <div className="border-t border-white/10 px-2.5 py-2.5">
                                  <div className="space-y-1">
                                    {category.children.map((child) => (
                                      <Link
                                        key={child._id}
                                        href={`/courses/${category.slug}/${child.slug}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-md px-2.5 py-2 text-sm text-white/74 transition hover:bg-white/5 hover:text-white"
                                      >
                                        {child.title}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-2 py-2 text-sm text-white/55">No courses found.</div>
                    )}
                  </div>
                )}
              </div>

              {staticNavItems.slice(1).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/85"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
