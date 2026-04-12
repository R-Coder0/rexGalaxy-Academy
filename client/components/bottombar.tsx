"use client";

import React, { useState, FormEvent } from "react";

const BottomStickyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    branch: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // yaha apna submit logic laga dena (API call / WhatsApp / etc.)
    console.log(formData);
  };

  return (
    <div className="hidden md:block fixed inset-x-0 bottom-0 z-50">
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
            className="w-full md:w-auto bg-orange-500 text-white font-semibold text-sm px-6 py-2 hover:bg-[#ffd633] transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BottomStickyForm;
