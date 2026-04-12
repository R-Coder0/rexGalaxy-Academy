"use client";

import React, { useMemo, useRef, useState } from "react";

type Faq = { q: string; a: string };
type Tab = { key: string; label: string; faqs: Faq[] };

const TABS: Tab[] = [
  {
    key: "about",
    label: "About Rexgalaxy Academy",
    faqs: [
      {
        q: "What is Rexgalaxy Academy and what do you teach?",
        a: "Rexgalaxy Academy is an AI institute focused on practical, job-oriented AI courses including Generative AI, Machine Learning, Data Science, Python, and real-world AI project training. Our programs are designed to help learners build industry-ready skills with hands-on assignments, capstone projects, and guided mentoring.",
      },
      {
        q: "Why choose Rexgalaxy Academy as your AI training institute?",
        a: "Rexgalaxy Academy stands out as an AI training institute because we prioritize practical learning, portfolio-building projects, mentor support, and career guidance. Instead of theory-heavy lessons, we teach real workflows used in AI roles—prompting, model evaluation, data pipelines, and deployment basics—so your learning converts into measurable outcomes.",
      },
      {
        q: "Is Rexgalaxy Academy good for beginners with no coding background?",
        a: "Yes. Our beginner-friendly AI courses start from fundamentals like Python basics, data handling, and AI concepts. If you’re new to coding, we guide you step-by-step with structured practice, doubt support, and beginner projects. You’ll build confidence before moving into advanced topics like machine learning training and Generative AI applications.",
      },
      {
        q: "What learning formats do you offer—online or offline?",
        a: "Rexgalaxy Academy offers flexible learning formats including online instructor-led classes, hybrid options (where available), and structured recorded support depending on the program. This makes it easier for students, working professionals, and entrepreneurs to learn AI skills without disrupting their schedule.",
      },
      {
        q: "Do you provide AI certificates after course completion?",
        a: "Yes. After successful completion of your AI course (including project submissions and assessments), Rexgalaxy Academy provides a course completion certificate. This AI certification helps you showcase verified learning on LinkedIn, your resume, and job applications—especially for roles like AI intern, data analyst, ML trainee, and GenAI associate.",
      },
    ],
  },

  {
    key: "genai",
    label: "Generative AI Courses",
    faqs: [
      {
        q: "What will I learn in the Generative AI course at Rexgalaxy Academy?",
        a: "In our Generative AI course, you learn how modern GenAI tools work, how to write effective prompts, how to create workflows for content and automation, and how to use LLMs responsibly. You’ll also build practical projects like AI chat assistants, marketing content systems, proposal generators, and workflow automations—ideal for business and job use-cases.",
      },
      {
        q: "Is Prompt Engineering included in your Generative AI training?",
        a: "Yes. Prompt Engineering is a core module. You’ll learn prompt frameworks, role prompting, instruction tuning concepts, multi-step prompting, evaluation methods, and prompt optimization for consistent outputs. This helps you use GenAI tools professionally for marketing, operations, HR, sales, and product workflows.",
      },
      {
        q: "Who should take a Generative AI course—students or working professionals?",
        a: "Both. Students learn future-proof skills for internships and entry-level roles, while professionals use Generative AI training to improve productivity, create faster deliverables, and automate repetitive tasks. If you work in marketing, sales, operations, recruitment, design, or analytics, this course can directly improve daily performance.",
      },
      {
        q: "Will I build real projects in the Generative AI program?",
        a: "Absolutely. Rexgalaxy Academy focuses on portfolio-building. You’ll create GenAI projects such as a brand content generator, customer support chatbot flow, AI-powered resume enhancer, and a niche knowledge assistant—so you can show real proof of skills to recruiters or clients.",
      },
      {
        q: "Does the course cover AI ethics and responsible AI use?",
        a: "Yes. We include responsible AI practices—privacy awareness, bias basics, safe prompting, and content accuracy checks. You’ll learn how to reduce hallucinations using structured prompts, verification workflows, and best practices so your outputs remain reliable for real business usage.",
      },
    ],
  },

  {
    key: "ml",
    label: "Machine Learning Training",
    faqs: [
      {
        q: "What topics are covered in Rexgalaxy Academy machine learning training?",
        a: "Our machine learning training covers supervised and unsupervised learning, feature engineering, model evaluation, classification, regression, clustering, and practical ML workflows. You’ll learn to work with real datasets, build models, and interpret results—skills required for ML internships and entry-level AI roles.",
      },
      {
        q: "Do I need strong mathematics to learn Machine Learning?",
        a: "You don’t need advanced math to start. We explain the required concepts in an applied way and focus more on implementation and understanding. As you progress, we introduce essential statistics and model intuition so you can confidently build and explain ML models in interviews and projects.",
      },
      {
        q: "Is Python included in the Machine Learning course?",
        a: "Yes. Python is a key foundation. You’ll learn Python for data handling, libraries used in machine learning workflows, and how to structure ML code properly. Rexgalaxy Academy ensures you can actually build models—not just watch lectures.",
      },
      {
        q: "Will I learn how to evaluate and improve ML model performance?",
        a: "Yes. You’ll learn model evaluation metrics, validation methods, overfitting control, hyperparameter tuning basics, and performance reporting. This is critical if you want to work as a data analyst transitioning into ML or an AI/ML trainee role.",
      },
      {
        q: "Do you provide project guidance for Machine Learning?",
        a: "Yes. You will complete guided projects and a capstone that mirrors real industry work. You’ll build a portfolio that demonstrates data preparation, model building, evaluation, and insights—useful for job interviews, internships, and freelance analytics projects.",
      },
    ],
  },

  {
    key: "ds",
    label: "Data Science Course",
    faqs: [
      {
        q: "What is included in the Data Science course at Rexgalaxy Academy?",
        a: "Our data science course includes Python for data analysis, data cleaning, exploratory data analysis (EDA), visualization, problem-solving with real datasets, and insight storytelling. This helps you become job-ready for roles like data analyst, junior data scientist, and BI trainee.",
      },
      {
        q: "Is this data science course suitable for commerce or non-technical students?",
        a: "Yes. Many learners from commerce and non-tech backgrounds succeed with our structured approach. We teach from basics and focus on practical learning—how to interpret data, create reports, and communicate insights. This is especially helpful for learners aiming for analytics jobs in marketing, operations, and sales domains.",
      },
      {
        q: "Do you teach dashboards or reporting skills in Data Science?",
        a: "We teach reporting-friendly skills like visualization, insight structuring, and dataset storytelling. Depending on your program track, you can also learn how to present insights clearly for business decision-making—an essential requirement in data analyst job roles.",
      },
      {
        q: "Will I get a portfolio after completing the Data Science course?",
        a: "Yes. Rexgalaxy Academy focuses on output. You’ll complete multiple mini-projects and a final project to showcase on LinkedIn or your resume. A strong portfolio helps you stand out in interviews and improves your chances of getting shortlisted.",
      },
      {
        q: "How does Rexgalaxy Academy help with analytics career growth?",
        a: "We provide learning roadmaps, project reviews, resume guidance, and interview preparation support depending on the program. The goal is to move you from ‘learning’ to ‘job-ready’ with practical skills, proof-of-work projects, and confidence for interviews.",
      },
    ],
  },

  {
    key: "courses",
    label: "Programs & Curriculum",
    faqs: [
      {
        q: "Which AI courses are available at Rexgalaxy Academy?",
        a: "Rexgalaxy Academy offers AI courses such as Generative AI, Prompt Engineering, Machine Learning training, Data Science course, and Python foundations. Program availability can vary by batch, so we recommend selecting the track based on your goals—job, business growth, or upskilling.",
      },
      {
        q: "How long are the AI programs and what is the weekly commitment?",
        a: "Program duration depends on the track and level (beginner to advanced). Typically, you’ll need consistent weekly practice time for assignments, quizzes, and projects. We structure learning so working professionals can manage it alongside jobs while still building real skills.",
      },
      {
        q: "Do you offer beginner, intermediate, and advanced learning tracks?",
        a: "Yes. We offer learning paths based on your current level. Beginners start with fundamentals, while intermediate learners focus on practical workflows and projects. Advanced learners work on deeper applications, portfolio polish, and interview-ready training.",
      },
      {
        q: "Are the courses more theory-based or practical?",
        a: "Our approach is practical-first. You learn concepts and immediately apply them through assignments and projects. Rexgalaxy Academy is built for outcomes—skills you can demonstrate in interviews, internships, and real client work.",
      },
      {
        q: "Can I switch tracks during the program if my goal changes?",
        a: "In many cases, yes—depending on batch structure and prerequisites. If you start with a data science course and later want to move into Generative AI or machine learning training, we guide you on the best transition path so your learning remains structured and effective.",
      },
    ],
  },

  {
    key: "careers",
    label: "Career Support & Outcomes",
    faqs: [
      {
        q: "Does Rexgalaxy Academy provide job assistance after AI course completion?",
        a: "We provide structured career support depending on the program, including resume improvements, LinkedIn profile guidance, portfolio polishing, and interview preparation. The goal is to make you job-ready for roles like data analyst, AI intern, ML trainee, and GenAI associate.",
      },
      {
        q: "What kind of projects help in getting hired for AI and data roles?",
        a: "Recruiters value proof-of-work. Projects that show real problem-solving—data cleaning + EDA + insights, predictive modeling, and GenAI workflows—make your resume stronger. Rexgalaxy Academy ensures you complete projects that are interview-friendly and portfolio-ready.",
      },
      {
        q: "Do you help with interview preparation for AI and Data Science roles?",
        a: "Yes. We guide you on common interview questions, project explanations, case-study style thinking, and how to communicate your work clearly. Interview preparation is critical because many candidates fail not due to lack of skill—but due to weak presentation and unclear project explanations.",
      },
      {
        q: "Can business owners use these AI courses to improve productivity?",
        a: "Yes. Many business owners use our Generative AI course to create repeatable systems for content creation, proposal writing, lead follow-ups, customer support workflows, and internal SOP automation. The focus is practical ROI-driven AI adoption.",
      },
      {
        q: "How soon can I start freelancing after learning AI or Data Science?",
        a: "If you consistently complete projects and build a clear portfolio, you can start offering beginner-level services like data reporting, dashboards, AI content systems, and automation workflows. Rexgalaxy Academy helps you structure your portfolio so it’s client-ready, not just ‘course-complete’.",
      },
    ],
  },

  {
    key: "admission",
    label: "Admissions, Fees & Support",
    faqs: [
      {
        q: "How can I enroll in Rexgalaxy Academy AI courses?",
        a: "Enrollment typically involves selecting your program track, completing a quick counseling step (to match the right course level), and confirming your seat in the next batch. Rexgalaxy Academy recommends choosing a track based on your goal—job, internship, business productivity, or upskilling.",
      },
      {
        q: "Do you offer demo classes or counseling before enrollment?",
        a: "Yes. We offer guidance to help you understand which AI course is best for you—Generative AI, machine learning training, or data science course—based on your background and goal. This helps you avoid joining the wrong level and improves learning outcomes.",
      },
      {
        q: "Is there doubt-solving and mentor support during the program?",
        a: "Yes. Rexgalaxy Academy provides structured doubt support and mentoring guidance. You can ask questions during sessions and get direction on assignments and projects. This mentor support is especially useful for beginners who need clarity while building fundamentals.",
      },
      {
        q: "Do you provide installment options or flexible payment plans?",
        a: "Depending on the program and batch policy, installment options may be available. Our aim is to keep AI education accessible while maintaining quality training and support. For exact fee structure and payment plans, choose your track and confirm the current batch details.",
      },
      {
        q: "What if I miss a class—can I catch up?",
        a: "We support catch-up through structured guidance and available session resources depending on your course format. The most important part is consistency—so we also help you plan a realistic weekly schedule to complete assignments and projects without falling behind.",
      },
    ],
  },
];
export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<string>("seo");
  const active = useMemo(() => TABS.find((t) => t.key === activeTab) ?? TABS[0], [activeTab]);

  const [openIndex, setOpenIndex] = useState<number>(-1);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const scrollTabs = (dir: "left" | "right") => {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const onTab = (k: string) => {
    setActiveTab(k);
    setOpenIndex(-1);
  };

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-[var(--bg)] border-t border-white/5">
      {/* Background accents (same idea, dark) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_55%)]" />

      <div className="pointer-events-none absolute right-[-140px] bottom-[-140px] h-[520px] w-[520px] rounded-full border border-white/5" />
      <div className="pointer-events-none absolute right-[-70px] bottom-[-70px] h-[380px] w-[380px] rounded-full border border-white/5" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[260px] w-[260px] rounded-full border border-white/5" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-center text-sm md:text-base text-white/60">
          Quick answers about programs, learning, and support.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <ArrowButton onClick={() => scrollTabs("left")} dir="left" />

          <div className="relative w-full max-w-[980px]">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />

            <div ref={tabsRef} className="no-scrollbar flex items-center gap-3 overflow-x-auto whitespace-nowrap scroll-smooth px-10">
              {TABS.map((t) => {
                const isActive = t.key === activeTab;

                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => onTab(t.key)}
                    className={[
                      "shrink-0 rounded-full px-5 py-2.5 text-xs md:text-[13px] font-semibold border transition-colors",
                      isActive
                        ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                        : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/20",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ArrowButton onClick={() => scrollTabs("right")} dir="right" />
        </div>

        <div className="mt-10 space-y-4">
          {active?.faqs?.map((f, idx) => {
            const isOpen = idx === openIndex;

            return (
              <div
                key={f.q}
                className="rounded-xl bg-white/5 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((p) => (p === idx ? -1 : idx))}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-[15px] font-semibold text-white/90">
                    {f.q}
                  </span>

                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200",
                      isOpen
                        ? "border-[var(--ai-cyan)] bg-[var(--ai-cyan)] text-black"
                        : "border-[var(--ai-cyan)] text-[var(--ai-cyan)] bg-transparent",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {isOpen ? <span className="text-[16px] leading-none">×</span> : <span className="text-[16px] leading-none">+</span>}
                  </span>
                </button>

                <div
                  className={[
                    "grid transition-all duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm md:text-[14px] leading-relaxed text-white/65">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-7 py-3 text-black font-semibold text-sm shadow-[0_12px_28px_rgba(255,107,0,0.25)] transition-all duration-200 hover:scale-[1.02]"
          >
            View All <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 shadow-[0_10px_22px_rgba(0,0,0,0.45)] transition-all duration-200 hover:border-white/20 hover:text-white"
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}