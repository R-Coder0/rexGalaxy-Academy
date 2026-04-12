/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    title: "Best Generative AI Course in Noida",
    text: "I enrolled in the Generative AI course at Rex Galaxy Academy, Noida. The prompt engineering modules and real-world AI projects were extremely practical. Within 3 months, I was able to build AI automation workflows confidently.",
    name: "Aman Gupta",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200",
  },
  {
    id: 2,
    title: "Practical Machine Learning Training",
    text: "Rex Galaxy Academy provides hands-on machine learning training in Noida. We worked on real datasets, model evaluation, and performance optimization. This helped me crack my Data Analyst interview easily.",
    name: "Shreya Singh",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328b9b4a?w=200",
  },
  {
    id: 3,
    title: "Job-Oriented Data Science Course",
    text: "The Data Science course in Noida is completely job-focused. From Python to advanced analytics and AI tools, everything is explained clearly. Resume and interview preparation support made a big difference.",
    name: "Rohit Sharma",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1600180758890-6e8b1f4e79d4?w=200",
  },
  {
    id: 4,
    title: "Best AI Institute for Beginners",
    text: "I had no coding background, but Rex Galaxy Academy in Noida made AI learning simple and structured. The step-by-step guidance and doubt support helped me transition into the tech domain smoothly.",
    name: "Neha Verma",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200",
  },
  {
    id: 5,
    title: "Prompt Engineering & LLM Training",
    text: "The Generative AI and LLM training at Rex Galaxy Academy, Noida is very practical. I learned advanced prompting frameworks and AI workflow building that I now use in my marketing job.",
    name: "Karan Malhotra",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200",
  },
  {
    id: 6,
    title: "Strong Placement Support in Noida",
    text: "The placement assistance and mock interview sessions at Rex Galaxy Academy are highly professional. The AI certification and portfolio projects helped me secure my first job in Data Analytics.",
    name: "Pooja Mishra",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  },
  {
    id: 7,
    title: "Advanced Python & AI Projects",
    text: "The Advanced Python and Machine Learning modules are industry-relevant. Real-time AI projects and practical assignments make Rex Galaxy Academy one of the best AI training institutes in Noida.",
    name: "Vikas Yadav",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200",
  },
  {
    id: 8,
    title: "Career Growth with Data Analytics",
    text: "I joined Rex Galaxy Academy’s Data Analytics course in Noida while working full-time. The flexible schedule and practical dashboard projects helped me upgrade my career within months.",
    name: "Simran Kaur",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200",
  },
  {
    id: 9,
    title: "Complete AI Learning Ecosystem",
    text: "From Machine Learning to Generative AI and MLOps basics, Rex Galaxy Academy provides a complete AI learning ecosystem in Noida. The structured roadmap is perfect for serious learners.",
    name: "Aditya Jain",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
  },
  {
    id: 10,
    title: "Best Data Science Institute in Noida",
    text: "If you are looking for a practical and job-oriented Data Science institute in Noida, Rex Galaxy Academy is the right choice. The mentorship and real-world projects are outstanding.",
    name: "Megha Kapoor",
    location: "Noida",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p === testimonials.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent((p) => (p === 0 ? testimonials.length - 1 : p - 1));

  const active = useMemo(() => testimonials[current], [current]);

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-3">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100"
              className="w-6 h-6 rounded-full border-2 border-black"
              alt="user1"
            />
            <img
              src="https://images.unsplash.com/photo-1603415526960-f7e0328b9b4a?w=100"
              className="w-6 h-6 rounded-full border-2 border-black"
              alt="user2"
            />
            <img
              src="https://images.unsplash.com/photo-1600180758890-6e8b1f4e79d4?w=100"
              className="w-6 h-6 rounded-full border-2 border-black"
              alt="user3"
            />
          </div>
          <span className="bg-orange-600 text-white text-sm font-medium px-4 py-1 rounded-full">
            Testimonials
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          Don’t take our word for it
        </h2>

        {/* Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full">
          {/* Floating Images */}
          <div className="relative flex-1 flex justify-center items-center">
            {/* Desktop collage */}
            <div className="hidden md:flex relative w-[400px] h-[400px] justify-center items-center">
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400"
                alt="Student 1"
                className="absolute w-52 h-52 rounded-full object-cover border-4 border-orange-500 shadow-lg left-0 top-5"
              />
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
                alt="Student 2"
                className="absolute w-48 h-48 rounded-full object-cover border-4 border-orange-500 shadow-lg right-0 bottom-8"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                alt="Student 3"
                className="absolute w-28 h-28 rounded-full object-cover border-4 border-orange-500 shadow-md top-[61%] -translate-y-1/2 left-[-23px] -translate-x-[40%]"
              />
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
                alt="Student 4"
                className="absolute w-20 h-20 rounded-full object-cover border-4 border-orange-500 shadow-sm bottom-0 left-10"
              />
            </div>

            {/* Mobile simplified stack */}
            <div className="flex md:hidden gap-3">
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200"
                alt="student-1"
                className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
                alt="student-2"
                className="w-16 h-16 rounded-full object-cover border-4 border-orange-500 shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                alt="student-3"
                className="w-12 h-12 rounded-full object-cover border-4 border-orange-500 shadow-sm self-center"
              />
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="relative flex-1 max-w-lg w-full">
            {/* Desktop nav left */}
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 bg-orange-600 text-black w-10 h-10 rounded-full items-center justify-center hover:bg-orange-500 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Card container height increased + stable */}
            <div className="relative h-[340px] md:h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#0e0e0e] rounded-3xl shadow-[0_0_20px_rgba(255,110,0,0.3)] border border-gray-700 overflow-hidden"
                >
                  <div className="h-full flex flex-col p-6 md:p-8 text-left">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
                      {active.title}
                    </h3>

                    {/* Text (scrollable) */}
                    <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {active.text}
                      </p>
                    </div>

                    {/* Footer (always visible) */}
                    <div className="mt-6 pt-4 border-t border-gray-700/60 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={active.image}
                          alt={active.name}
                          className="w-10 h-10 rounded-full object-cover border border-orange-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {active.name}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {active.location}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 text-orange-400 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} fill="#fb923c" stroke="none" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop nav right */}
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 bg-orange-600 text-black w-10 h-10 rounded-full items-center justify-center hover:bg-orange-500 transition"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Mobile nav under card */}
            <div className="mt-4 flex md:hidden items-center justify-center gap-4">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="bg-orange-600 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 items-center">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`w-2 h-2 rounded-full ${
                      idx === current ? "bg-orange-500" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next testimonial"
                className="bg-orange-600 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}