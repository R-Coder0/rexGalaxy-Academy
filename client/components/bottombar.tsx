"use client";

import React, { useState, FormEvent } from "react";

const BottomStickyForm: React.FC = () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    branch: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (submitError) setSubmitError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setSubmitError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!API_BASE_URL) {
      setSubmitError("API base URL is missing. Please set NEXT_PUBLIC_API_BASE_URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSuccessMessage("");

      const payload = new FormData();
      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.phone.trim());
      payload.append(
        "company",
        formData.course.trim() || "Bottom Sticky Form"
      );
      payload.append(
        "message",
        [
          "Enquiry received from fixed bottom form.",
          formData.course.trim() ? `Interested Course: ${formData.course.trim()}` : "",
          formData.branch.trim() ? `Preferred Branch: ${formData.branch.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      );

      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to submit enquiry. Please try again."
        );
      }

      setSuccessMessage("Enquiry submitted successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        course: "",
        branch: "",
      });
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 hidden md:block">
      {/* Top dark strip (optional, like your screenshot) */}
      <div className="h-4" />

      {/* Main bar */}
      <div className="bg-orange-900 py-3 px-4 md:px-10">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[1500px]  flex flex-col gap-2 md:flex-row md:items-center md:gap-3"
        >
          {/* Full Name */}
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full md:flex-1 bg-white text-sm px-3 py-2 outline-none border border-white/70 focus:border-yellow-400 placeholder:text-gray-500"
          />

          {/* Email */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            className="w-full md:flex-1 bg-white text-sm px-3 py-2 outline-none border border-white/70 focus:border-yellow-400 placeholder:text-gray-500"
          />

          {/* Phone */}
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            className="w-full md:flex-1 bg-white text-sm px-3 py-2 outline-none border border-white/70 focus:border-yellow-400 placeholder:text-gray-500"
          />

          {/* Course */}
          <input
            name="course"
            value={formData.course}
            onChange={handleChange}
            type="text"
            placeholder="Python Full Stack Developer Course"
            className="w-full md:flex-1 bg-[#e2ebf7] text-sm px-3 py-2 outline-none border border-white/70 focus:border-yellow-400 placeholder:text-gray-600"
          />

          {/* Branch (select example) */}
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full md:flex-1 bg-white text-sm px-3 py-2 outline-none border border-white/70 focus:border-yellow-400 text-gray-700"
          >
            <option value="">Select a Branch</option>
            <option value="noida">Noida</option>
            <option value="gurgaon">Gurgaon</option>
            <option value="delhi">Delhi</option>
          </select>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-orange-500 text-white font-semibold text-sm px-6 py-2 hover:bg-[#ffd633] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {submitError ? (
          <p className="mx-auto mt-2 max-w-[1500px] text-sm text-red-200">
            {submitError}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mx-auto mt-2 max-w-[1500px] text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default BottomStickyForm;
