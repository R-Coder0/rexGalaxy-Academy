"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  name: string;
  url?: string;
  children?: MenuItem[];
};

// Utility function to convert menu name to URL slug
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

const Navbar = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Hover delay refs & helpers ---
  const dropdownCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subDropdownCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDropdownCloseTimeout = () => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }
  };

  const clearSubDropdownCloseTimeout = () => {
    if (subDropdownCloseTimeout.current) {
      clearTimeout(subDropdownCloseTimeout.current);
      subDropdownCloseTimeout.current = null;
    }
  };

  const openDropdown = (name: string) => {
    clearDropdownCloseTimeout();
    setActiveDropdown(name);
  };

  const scheduleCloseDropdown = () => {
    clearDropdownCloseTimeout();
    dropdownCloseTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }, 150);
  };

  const openSubDropdown = (name: string) => {
    clearSubDropdownCloseTimeout();
    setActiveSubDropdown(name);
  };

  const scheduleCloseSubDropdown = () => {
    clearSubDropdownCloseTimeout();
    subDropdownCloseTimeout.current = setTimeout(() => {
      setActiveSubDropdown(null);
    }, 150);
  };

  // Handle navigation
  const handleNavigation = (item: MenuItem, parentSlug?: string) => {
    // If item has custom URL, use it
    if (item.url) {
      router.push(item.url);
      setMobileMenuOpen(false);
      return;
    }

    // Generate slug from item name
    const slug = createSlug(item.name);
    
    // Build path: if there's a parent slug, append child slug
    const path = parentSlug ? `/${parentSlug}-${slug}` : `/${slug}`;
    
    // Navigate to the generated path
    router.push(path);
    setMobileMenuOpen(false);
    
    // Close dropdowns
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await fetch("/menu.json");
        const data: MenuItem[] = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to load menu.json", error);
      }
    };

    loadMenu();

    return () => {
      clearDropdownCloseTimeout();
      clearSubDropdownCloseTimeout();
    };
  }, []);

  return (
    <nav
      className="relative text-[var(--rex-text)] border-b border-[var(--rex-border)] z-50 bg-[var(--rex-bg)]"
      style={{ cursor: "default" }}
    >
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="circuit-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20,20 L80,20 M80,20 L80,80 M80,80 L20,80 M20,80 L20,20"
                stroke="var(--rex-accent-light)"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
              <circle cx="20" cy="20" r="3" fill="var(--rex-accent)" opacity="0.5" />
              <circle cx="80" cy="20" r="3" fill="var(--rex-accent)" opacity="0.5" />
              <circle cx="80" cy="80" r="3" fill="var(--rex-accent)" opacity="0.5" />
              <circle cx="20" cy="80" r="3" fill="var(--rex-accent)" opacity="0.5" />
              <path
                d="M50,20 L50,40 M50,60 L50,80 M30,50 L70,50"
                stroke="var(--rex-accent)"
                strokeWidth="1"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Navbar Content */}
      <div className="max-w-[1500px]  mx-auto relative z-10">
        <div className="flex items-center justify-between py-3 px-6">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
          
<div className="flex flex-col leading-tight">
  <img
    src="/logo.png"   // public folder ke andar image rakho
    alt="RexGalaxy Academy Logo"
    className="h-[80px] w-auto object-contain"
  />
</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center">
            <ul className="flex space-x-1">
              {menuItems.map((item, idx) => {
                const hasDropdown = !!item.children && item.children.length > 0;

                return (
                  <li
                    key={`${item.name}-${idx}`}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasDropdown) {
                        openDropdown(item.name);
                      } else {
                        setActiveDropdown(null);
                        setActiveSubDropdown(null);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hasDropdown) {
                        scheduleCloseDropdown();
                      }
                    }}
                  >
                    <button
                      onClick={() => !hasDropdown && handleNavigation(item)}
                      className="px-4 py-2 text-sm font-medium hover:text-[var(--rex-accent-light)] hover:bg-[color-mix(in_srgb,var(--rex-accent)_15%,transparent)] rounded-md transition-all duration-200 flex items-center cursor-pointer"
                    >
                      {item.name}
                      {hasDropdown && (
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Dropdown (level 1) */}
                    {hasDropdown && activeDropdown === item.name && (
                      <div className="absolute left-0 top-full bg-[var(--rex-bg)] border border-[var(--rex-border)] shadow-xl z-20 rounded-md w-auto min-w-max">
                        <ul className="py-2 mt-1">
                          {item.children!.map((dropdownItem, dIdx) => {
                            const hasSubDropdown =
                              !!dropdownItem.children &&
                              dropdownItem.children.length > 0;
                            const parentSlug = createSlug(item.name);

                            return (
                              <li
                                key={`${dropdownItem.name}-${dIdx}`}
                                className="relative"
                                onMouseEnter={() => {
                                  if (hasSubDropdown) {
                                    openSubDropdown(dropdownItem.name);
                                  } else {
                                    setActiveSubDropdown(null);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (hasSubDropdown) {
                                    scheduleCloseSubDropdown();
                                  }
                                }}
                              >
                                <button
                                  onClick={() => !hasSubDropdown && handleNavigation(dropdownItem, parentSlug)}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--rex-subtext)] hover:text-[var(--rex-accent-light)] hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] transition-colors cursor-pointer rounded-sm flex items-center justify-between"
                                >
                                  {dropdownItem.name}
                                  {hasSubDropdown && (
                                    <svg
                                      className="w-4 h-4 ml-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  )}
                                </button>

                                {/* Sub Dropdown (level 2) */}
                                {hasSubDropdown &&
                                  activeSubDropdown === dropdownItem.name && (
                                    <div className="absolute left-full top-0 w-56 bg-[var(--rex-bg)] border border-[var(--rex-border)] shadow-lg z-30 rounded-md">
                                      <ul className="py-2">
                                        {dropdownItem.children!.map(
                                          (subItem, sIdx) => {
                                            const subParentSlug = `${parentSlug}/${createSlug(dropdownItem.name)}`;
                                            
                                            return (
                                              <li
                                                key={`${subItem.name}-${sIdx}`}
                                              >
                                                <button
                                                  onClick={() => handleNavigation(subItem, subParentSlug)}
                                                  className="w-full text-left block px-4 py-2 text-sm text-[var(--rex-subtext)] hover:text-[var(--rex-accent-light)] hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] transition-colors cursor-pointer rounded-sm"
                                                >
                                                  {subItem.name}
                                                </button>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[var(--rex-surface)] border-t border-[var(--rex-border)]">
            <ul className="py-2">
              {menuItems.map((item, idx) => {
                const hasDropdown = !!item.children && item.children.length > 0;

                return (
                  <li
                    key={`${item.name}-m-${idx}`}
                    className="border-b border-[var(--rex-border)] last:border-b-0"
                  >
                    <button
                      className="w-full px-6 py-3 text-left flex items-center justify-between hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] transition-colors cursor-pointer"
                      onClick={() => {
                        if (hasDropdown) {
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          );
                        } else {
                          handleNavigation(item);
                        }
                      }}
                    >
                      {item.name}
                      {hasDropdown && (
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {hasDropdown && activeDropdown === item.name && (
                      <div className="bg-[var(--rex-bg)]">
                        <ul className="py-2">
                          {item.children!.map((dropdownItem, dIdx) => {
                            const hasSubDropdown =
                              !!dropdownItem.children &&
                              dropdownItem.children.length > 0;
                            const parentSlug = createSlug(item.name);

                            return (
                              <li key={`${dropdownItem.name}-m-${dIdx}`}>
                                <button
                                  className="w-full px-10 py-2 text-left hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] flex items-center justify-between cursor-pointer"
                                  onClick={() => {
                                    if (hasSubDropdown) {
                                      setActiveSubDropdown(
                                        activeSubDropdown === dropdownItem.name
                                          ? null
                                          : dropdownItem.name
                                      );
                                    } else {
                                      handleNavigation(dropdownItem, parentSlug);
                                    }
                                  }}
                                >
                                  {dropdownItem.name}
                                  {hasSubDropdown && (
                                    <svg
                                      className={`w-4 h-4 transform transition-transform ${
                                        activeSubDropdown === dropdownItem.name
                                          ? "rotate-90"
                                          : ""
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7-7"
                                      />
                                    </svg>
                                  )}
                                </button>

                                {/* Mobile Sub Dropdown */}
                                {hasSubDropdown &&
                                  activeSubDropdown === dropdownItem.name && (
                                    <div className="bg-[var(--rex-surface)]">
                                      <ul className="py-2">
                                        {dropdownItem.children!.map(
                                          (subItem, sIdx) => {
                                            const subParentSlug = `${parentSlug}/${createSlug(dropdownItem.name)}`;
                                            
                                            return (
                                              <li
                                                key={`${subItem.name}-m-${sIdx}`}
                                              >
                                                <button
                                                  onClick={() => handleNavigation(subItem, subParentSlug)}
                                                  className="w-full text-left block px-14 py-2 text-sm text-[var(--rex-subtext)] hover:text-[var(--rex-accent-light)] hover:bg-[color-mix(in_srgb,var(--rex-accent)_10%,transparent)] cursor-pointer"
                                                >
                                                  {subItem.name}
                                                </button>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;