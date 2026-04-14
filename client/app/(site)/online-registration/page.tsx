/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CourseCategory = {
  _id: string;
  title: string;
  slug: string;
  children?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
};

type RegistrationForm = {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  subCourse: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
};

type FieldErrors = Partial<Record<keyof RegistrationForm, string>>;

const initialForm: RegistrationForm = {
  fullName: "",
  email: "",
  phone: "",
  course: "",
  subCourse: "",
  address: "",
  city: "",
  country: "",
  zipcode: "",
};

export default function OnlineRegistrationPage() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [courseOptions, setCourseOptions] = useState<CourseCategory[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const selectedCourse = courseOptions.find((item) => item.title === form.course);
  const subCourseOptions = selectedCourse?.children ?? [];
  const shouldShowSubCourse = subCourseOptions.length > 0;

  useEffect(() => {
    const fetchCourseOptions = async () => {
      if (!API_BASE_URL) {
        setCoursesLoading(false);
        return;
      }

      try {
        setCoursesLoading(true);
        const response = await fetch(`${API_BASE_URL}/course-menu/menu`, {
          cache: "no-store",
        });
        const result = await response.json().catch(() => null);

        if (response.ok && result?.success && Array.isArray(result.data)) {
          setCourseOptions(
            result.data.map((item: CourseCategory) => ({
              _id: item._id,
              title: item.title,
              slug: item.slug,
              children: Array.isArray(item.children) ? item.children : [],
            }))
          );
        } else {
          setCourseOptions([]);
        }
      } catch {
        setCourseOptions([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourseOptions();
  }, [API_BASE_URL]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "course" ? { subCourse: "" } : {}),
    }));

    if (fieldErrors[name as keyof RegistrationForm]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (submitMessage) setSubmitMessage("");
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const errors: FieldErrors = {};

    if (!form.fullName.trim()) errors.fullName = "Full name is required.";

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!form.course.trim()) errors.course = "Please select a course.";
    if (shouldShowSubCourse && !form.subCourse.trim()) {
      errors.subCourse = "Please select a subcategory.";
    }
    if (!form.address.trim()) errors.address = "Address is required.";
    if (!form.city.trim()) errors.city = "City is required.";
    if (!form.country.trim()) errors.country = "Country is required.";
    if (!form.zipcode.trim()) errors.zipcode = "Zip code is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitMessage("");
    setSubmitError("");
    setRegistrationCode("");

    if (!validateForm()) return;

    if (!API_BASE_URL) {
      setSubmitError(
        "API base URL is missing. Please set NEXT_PUBLIC_API_BASE_URL in your environment."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          course: shouldShowSubCourse && form.subCourse.trim()
            ? `${form.course.trim()} - ${form.subCourse.trim()}`
            : form.course.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          zipcode: form.zipcode.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to submit registration. Please try again."
        );
      }

      setSubmitMessage("Registration submitted successfully. Our team will contact you shortly.");
      setRegistrationCode(result?.data?.registrationCode || "");
      setForm(initialForm);
      setFieldErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field: keyof RegistrationForm) =>
    fieldErrors[field] ? <p className="error mt-1.5">{fieldErrors[field]}</p> : null;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="mx-auto max-w-[1280px] px-5 py-12 md:py-16">
        <div
          className="overflow-hidden rounded-[var(--radius-lg)]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="grid lg:grid-cols-[340px_1fr]">
            <aside
              className="border-b px-6 py-8 lg:border-b-0 lg:border-r lg:px-8"
              style={{
                borderColor: "var(--border-strong)",
                background:
                  "linear-gradient(180deg, rgba(255,107,0,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <img
                    src="/logo.png"
                    alt="Rex Galaxy Academy"
                    className="h-20 w-auto object-contain"
                  />

                  <h1 className="mt-8 text-2xl font-semibold text-[var(--text)]">
                    Online Registration
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">
                    Register online today and take the first step towards your
                    course admission.
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-[var(--radius)] px-4 py-3 text-sm"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Fill your details carefully for faster processing.
                  </div>
                  <div
                    className="rounded-[var(--radius)] px-4 py-3 text-sm"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Our team will contact you after successful submission.
                  </div>
                </div>
              </div>
            </aside>

            <div className="px-6 py-8 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold text-[var(--text)]">
                  Registration Form
                </h2>
                <p className="mt-2 text-sm text-[var(--text-dim)]">
                  Please fill all required fields below.
                </p>

                <div
                  className="mt-6 rounded-[var(--radius-lg)] p-5 md:p-6"
                  style={{
                    border: "1px solid var(--border-strong)",
                    background: "var(--surface-2)",
                  }}
                >
                  {submitMessage && registrationCode ? (
                    <div className="py-4">
                      <div
                        className="rounded-[var(--radius-lg)] p-5"
                        style={{
                          border: "1px solid rgba(16,185,129,0.28)",
                          background: "rgba(16,185,129,0.08)",
                        }}
                      >
                        <h3 className="text-xl font-semibold text-[var(--text)]">
                          Thank You
                        </h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                          Your registration has been submitted successfully. Please save
                          your registration code for future reference.
                        </p>

                        <div
                          className="mt-5 rounded-[var(--radius)] px-4 py-4"
                          style={{
                            border: "1px solid rgba(255,107,0,0.24)",
                            background: "rgba(255,107,0,0.08)",
                          }}
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
                            Registration Code
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-[0.08em] text-[var(--brand)]">
                            {registrationCode}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            className="btn btn-outline btn-md"
                            onClick={() => {
                              setSubmitMessage("");
                              setSubmitError("");
                              setRegistrationCode("");
                            }}
                          >
                            New Registration
                          </button>
                          <Link href="/contact-us" className="btn btn-ghost btn-md">
                            Contact Support
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="field md:col-span-2">
                          <label className="label" htmlFor="fullName">
                            Name
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter Your Name"
                            className="input"
                          />
                          {renderError("fullName")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="email">
                            Email Address
                          </label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter Email Address"
                            className="input"
                          />
                          {renderError("email")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="phone">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone Number"
                            className="input"
                          />
                          {renderError("phone")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="course">
                            Course
                          </label>
                          <select
                            id="course"
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            className="select"
                            disabled={coursesLoading}
                          >
                            <option value="">
                              {coursesLoading ? "Loading Courses..." : "Select Course"}
                            </option>
                            {courseOptions.map((courseItem) => (
                              <option key={courseItem._id} value={courseItem.title}>
                                {courseItem.title}
                              </option>
                            ))}
                          </select>
                          {renderError("course")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="subCourse">
                            Sub Category
                          </label>
                          <select
                            id="subCourse"
                            name="subCourse"
                            value={form.subCourse}
                            onChange={handleChange}
                            className="select"
                            disabled={!shouldShowSubCourse}
                          >
                            <option value="">
                              {shouldShowSubCourse
                                ? "Select Sub Category"
                                : "No subcategories available"}
                            </option>
                            {subCourseOptions.map((subItem) => (
                              <option key={subItem._id} value={subItem.title}>
                                {subItem.title}
                              </option>
                            ))}
                          </select>
                          {renderError("subCourse")}
                        </div>

                        <div className="field md:col-span-2">
                          <label className="label" htmlFor="address">
                            Address
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter Address"
                            rows={3}
                            className="textarea"
                          />
                          {renderError("address")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="city">
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Enter City Name"
                            className="input"
                          />
                          {renderError("city")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="country">
                            Country
                          </label>
                          <input
                            id="country"
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Enter Country Name"
                            className="input"
                          />
                          {renderError("country")}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="zipcode">
                            Zipcode
                          </label>
                          <input
                            id="zipcode"
                            type="text"
                            name="zipcode"
                            value={form.zipcode}
                            onChange={handleChange}
                            placeholder="Enter ZIP Code"
                            className="input"
                          />
                          {renderError("zipcode")}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-md"
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>

                        <Link href="/contact-us" className="btn btn-ghost btn-md">
                          Need Help?
                        </Link>
                      </div>

                      {submitError ? (
                        <div
                          className="mt-4 rounded-[var(--radius)] px-4 py-3 text-sm"
                          style={{
                            border: "1px solid rgba(239,68,68,0.28)",
                            background: "rgba(239,68,68,0.10)",
                            color: "#fca5a5",
                          }}
                        >
                          {submitError}
                        </div>
                      ) : null}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
