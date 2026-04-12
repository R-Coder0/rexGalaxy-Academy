export type CourseContent = {
  about: {
    title: string;
    points: {
      title: string;
      description: string;
    }[];
  };
  eligibility: {
    title: string;
    description: string;
  }[];
  enrollment: {
    title: string;
    description: string;
  }[];
  certificate: {
    image: string;
    text: string;
  };
  faqs: {
    q: string;
    a: string;
  }[];
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  image: string;
  content?: CourseContent;   // ✅ merged here
};

export const courses: Course[] = [
  {
    slug: "diploma-courses-integrated-ai-advanced-diploma-in-ai",
    title: "Advanced Diploma in AI",
    category: "Diploma Courses + Integrated AI",
    shortDescription: "Industry-focused AI diploma",
    fullDescription:
      "Master the technologies shaping the future with our comprehensive Artificial Intelligence program...",
    objectives: ["Machine Learning", "Deep Learning", "Real-world AI projects"],
    image: "/images/courses/ai.png",

    content: {
      about: {
        title: "What you will learn?",
        points: [
          {
            title: "AI Fundamentals",
            description: "Neural networks, ML pipelines, and model building."
          }
        ]
      },
      eligibility: [
        {
          title: "Education",
          description: "Any graduate or final-year student."
        }
      ],
      enrollment: [
        {
          title: "Live Classes",
          description: "Instructor-led interactive sessions."
        }
      ],
      certificate: {
        image: "/certificate-ai.png",
        text: "Industry-recognized AI certificate."
      },
      faqs: [
        {
          q: "Do I need coding experience?",
          a: "Basic programming is helpful but not mandatory."
        }
      ]
    }
  },

  {
    slug: "diploma-courses-integrated-ai-integrated-ai-ml",
    title: "Integrated AI + ML",
    category: "Diploma Courses + Integrated AI",
    shortDescription: "Comprehensive AI & ML program for future-ready professionals",
    fullDescription:
      "The Integrated AI + ML program combines Artificial Intelligence and Machine Learning...",
    objectives: [
      "AI + ML combined curriculum",
      "Hands-on model training",
      "Live project exposure"
    ],
    image: "/images/courses/ai-ml.png",

    content: {
      about: {
        title: "What you will learn?",
        points: [
          {
            title: "AI + Machine Learning",
            description: "End-to-end ML workflows and deployment."
          }
        ]
      },
      eligibility: [
        {
          title: "Education",
          description: "Open to all science/engineering graduates."
        }
      ],
      enrollment: [
        {
          title: "Hybrid Mode",
          description: "Online + project mentorship."
        }
      ],
      certificate: {
        image: "/certificate-aiml.png",
        text: "Certified AI + ML professional."
      },
      faqs: [
        {
          q: "Is there placement support?",
          a: "Yes, placement assistance is provided."
        }
      ]
    }
  },

  {
    slug: "diploma-courses-integrated-ai-data-science-diploma",
    title: "Diploma in Data Science",
    category: "Diploma Courses + Integrated AI",
    shortDescription: "Data-driven decision making with real-world analytics",
    fullDescription:
      "This Data Science diploma focuses on data analysis, visualization...",
    objectives: [
      "Data analysis & visualization",
      "Statistical modeling",
      "Predictive analytics"
    ],
    image: "/images/courses/data-science.png",

    content: {
      about: {
        title: "What you will learn?",
        points: [
          {
            title: "Python & Statistics",
            description: "Core Python, NumPy, Pandas, statistics."
          }
        ]
      },
      eligibility: [
        {
          title: "Education",
          description: "Open for all graduates."
        }
      ],
      enrollment: [
        {
          title: "Online Training",
          description: "Live instructor-led classes."
        }
      ],
      certificate: {
        image: "/certificate-dummy.png",
        text: "Certificate after completion."
      },
      faqs: [
        {
          q: "Is prior coding required?",
          a: "No, basics are covered."
        }
      ]
    }
  },

{
    slug: "diploma-courses-integrated-ai-ai-engineering-diploma",
    title: "AI Engineering Diploma",
    category: "Diploma Courses + Integrated AI",
    shortDescription: "Build and deploy production-ready AI systems",
    fullDescription:"<div style=\"background:#0b0f14;color:#ffffff;padding:36px;border-radius:14px;font-family:Helvetica,Arial,sans-serif;max-width:960px;line-height:1.75\"><h1 style=\"color:#ffffff;font-size:28px;font-weight:800;margin-bottom:16px\">AI Engineering Diploma</h1><h2 style=\"color:#ffffff;font-size:22px;font-weight:800;margin-top:24px\">Overview</h2><p style=\"color:#ffffff;font-size:16px\">Artificial Intelligence is transforming industries by enabling machines to learn from data, reason intelligently, and automate complex decisions. This <strong>AI Engineering Diploma</strong> is designed to take you from fundamentals to production-ready AI systems. You will master programming, data engineering, machine learning, deep learning, and Generative AI while building real-world projects that prove your capability to employers.</p><hr style=\"border-color:#2a2f36;margin:24px 0\"/><h2 style=\"color:#ffffff;font-size:22px;font-weight:800\">Why This Course?</h2><ul style=\"color:#ffffff\"><li>End-to-end AI system building (data → model → deployment)</li><li>Hands-on labs, industry-style projects, and portfolio work</li><li>Focus on real employable engineering skills, not just theory</li><li>Mentor guidance, code reviews, and interview readiness</li></ul><hr style=\"border-color:#2a2f36;margin:24px 0\"/><h2 style=\"color:#ffffff;font-size:22px;font-weight:800\">Who Should Attend</h2><ul style=\"color:#ffffff\"><li>Fresh graduates aiming for AI/ML roles</li><li>Software developers moving into AI</li><li>Data professionals upgrading to engineering</li><li>Career switchers with logical and mathematical mindset</li></ul><hr style=\"border-color:#2a2f36;margin:24px 0\"/><h2 style=\"color:#ffffff;font-size:22px;font-weight:800\">What You Will Learn</h2><ul style=\"color:#ffffff\"><li>Python, maths, statistics & probability for AI</li><li>Data cleaning, pipelines, and feature engineering</li><li>Machine Learning & Deep Learning</li><li>Computer Vision and NLP basics</li><li>Generative AI & prompt engineering</li><li>MLOps: deployment, monitoring, and versioning</li><li>Responsible AI, bias, and safety</li><li>Capstone: real-world AI project</li></ul><hr style=\"border-color:#2a2f36;margin:24px 0\"/><h2 style=\"color:#ffffff;font-size:22px;font-weight:800\">Career Outcomes</h2><ul style=\"color:#ffffff\"><li>AI Engineer</li><li>Machine Learning Engineer</li><li>NLP Engineer</li><li>Computer Vision Engineer</li><li>AI Operations Associate</li></ul></div>",
    objectives: [
      "AI system design",
      "Model deployment",
      "Industry-level projects"
    ],
    image: "/images/courses/ai-engineering.png",

    content: {
      about: {
        title: "What you will learn?",
        points: [
          {
            title: "AI Deployment",
            description: "MLOps, cloud deployment, and APIs."
          }
        ]
      },
      eligibility: [
        {
          title: "Education",
          description: "B.Tech / B.Sc / MCA preferred."
        }
      ],
      enrollment: [
        {
          title: "Project-Based Learning",
          description: "Real industry case studies."
        }
      ],
      certificate: {
        image: "/certificate-aieng.png",
        text: "Certified AI Engineer."
      },
      faqs: [
        {
          q: "Will I build real projects?",
          a: "Yes, multiple industry projects included."
        }
      ]
    }
  }
];