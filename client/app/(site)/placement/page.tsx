"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type Placement = {
  name: string;
  role: string;
  company: string;
  package: string;
  image: string;
};

const placements: Placement[] = [
  {
    name: "Himanshu Tiwari",
    role: "Data Analyst",
    company: "RexGalaxy Technology",
    package: "6 LPA",
    image: "/images/hhhh.jpeg",
  },
  {
    name: "Risabh Singh",
    role: "MERN Stack Developer",
    company: "Infosys",
    package: "8 LPA",
    image: "/images/rrr.jpeg",
  },
  {
    name: "Riya Singh",
    role: "Software Engineer",
    company: "TCS",
    package: "7 LPA",
    image: "/images/ggg.jpeg",
  },
];

export default function PlacementPage() {
  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-[1500px]  mx-auto">

        {/* ===== TEXT SECTION ===== */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Building Careers, Not Just Certificates
          </h3>
          <p className="text-gray-400 mt-5 leading-relaxed">
            At <span className="text-orange-400 font-medium">RexGalaxy Academy</span>,
            we focus on real-world skills, hands-on projects, and interview-ready
            preparation. Our placement-driven approach ensures students confidently
            step into high-paying tech roles across top companies.
          </p>
        </div>

        {/* ===== COUNTER SECTION ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: "500+", label: "Students Placed" },
            { value: "45 LPA", label: "Highest Package" },
            { value: "120+", label: "Hiring Partners" },
            { value: "92%", label: "Placement Success Rate" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#0b0b0b] border border-orange-500/20 rounded-2xl p-8 text-center hover:border-orange-500 transition"
            >
              <h4 className="text-4xl font-bold text-orange-500">
                {item.value}
              </h4>
              <p className="text-gray-400 mt-2 text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* ===== SLIDER SECTION ===== */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
        >
          {placements.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-[#0b0b0b] border border-orange-500/20 rounded-3xl p-10 grid md:grid-cols-2 gap-10 items-center shadow-[0_0_40px_rgba(255,115,0,0.15)]">
                
                {/* LEFT IMAGE */}
                <div className="flex justify-center">
                  <div className="relative w-[260px] h-[340px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-xl"
                    />
               {/*   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-orange-500 text-orange-400 px-6 py-2 rounded-full font-semibold">
                      {item.package} Package
                    </div>  */}
                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div>
                  <h2 className="text-4xl font-bold text-orange-500">
                    {item.name}
                  </h2>

                  <p className="text-xl text-cyan-400 mt-2">
                    {item.role}
                  </p>

                  <p className="text-gray-400 mt-4 leading-relaxed">
                    Placed as <span className="text-white">{item.role}</span> at{" "}
                    <span className="text-orange-400">{item.company}</span> with a{" "}
                    <span className="text-orange-400">{item.package}</span> package.
                    Proudly trained at{" "}
                    <span className="text-white">RexGalaxy Academy</span>.
                  </p>

                  <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-black px-8 py-3 rounded-full font-semibold transition">
                    Get in touch
                  </button>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
