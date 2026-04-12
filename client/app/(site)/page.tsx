import HeroSection from "../../section/SliderSection";
import AlumniLogos from "../../section/PlacementPatners";
import TopPrograms from "../../section/TopStack";
import UpcomingBatches from "../../section/UpcommingBatchs";
import CourseSlider from "../../section/Courses";
import SimpleSkillsSection from "../../section/Features";
import HowWeWorkSection from "../../section/HowTeach";
import ToolsOrbit from "../../section/ToolOrbit";
import TechExpertiseSection from "../../section/TechExpertiseSection";
import TestimonialSection from "../../section/Testimonial";
import FaqSection from "../../section/Faqs";
import ContactCtaSection from "../../section/Ctas";

export default function Home() {
  return (
    <main>
      {/* 1) Hero (value proposition + stats) */}
      <HeroSection
        title="Build job-ready skills with an AI-first learning experience"
        stats={[
          { number: 50000, label: "Active Students" },
          { number: 200, label: "Free Courses" },
          { number: 5000, label: "Certified Graduates" },
        ]}
      />
      
      {/* 5) Key benefits / features (why choose us) */}
      <SimpleSkillsSection />


      {/* 2) Social proof (placement/partners logos) */}
      <AlumniLogos />

      {/* 3) Top programs (what you offer) */}
      <TopPrograms />

      {/* 4) Upcoming batches (conversion trigger) */}
      <UpcomingBatches />

      {/* 6) How you teach (process + outcomes) */}
      <HowWeWorkSection />

      {/* 7) Tools / ecosystem (AI-first vibe) */}
      <ToolsOrbit />

      {/* 8) Expertise / tech stack */}
      <TechExpertiseSection />

      {/* 9) Courses slider (deeper browse + upsell) */}
      <CourseSlider />

      {/* 10) Testimonials (trust builder before CTA) */}
      <TestimonialSection />

      {/* 11) FAQs (handle objections) */}
      <FaqSection />

      {/* 12) Final CTA (last conversion push) */}
      <ContactCtaSection />
    </main>
  );
}