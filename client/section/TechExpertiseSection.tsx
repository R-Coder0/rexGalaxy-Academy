/* eslint-disable @next/next/no-img-element */
import path from "path";
import fs from "fs/promises";
import TechGridClient, { type Tech } from "./TechGridClient";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

function labelFromFile(file: string) {
  const base = file.replace(/\.[^/.]+$/, "");
  const cleaned = base.replace(/[-_]+/g, " ").trim();

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const LABEL_OVERRIDES: Record<string, string> = {
  Next: "Next.js",
  "Next Js": "Next.js",
  Node: "Node.js",
  Mongodb: "MongoDB",
  Javascript: "JavaScript",
  Typescript: "TypeScript",
  Wp: "WordPress",
  Tw: "Tailwind CSS",
  Ae: "After Effects",
  Pr: "Premiere Pro",
  Cd: "Corel Draw",
};

async function getTechs(): Promise<Tech[]> {
  const dir = path.join(process.cwd(), "public", "tech");

  try {
    const files = await fs.readdir(dir);

    return files
      .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => {
        const rawLabel = labelFromFile(f);
        const label = LABEL_OVERRIDES[rawLabel] ?? rawLabel;
        return { src: `/tech/${f}`, label };
      });
  } catch {
    return [];
  }
}

export default async function TechExpertiseSection() {
  const techs = await getTechs();
  if (!techs.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg)] py-16 md:py-20 text-white border-t border-white/5">
      
      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
        
        <div className="mt-10 text-center">
          <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Our Tech Stack
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Tools & Platforms You’ll Master
          </h2>

          <div className="mt-4 h-[2px] w-40 mx-auto bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />
        </div>

        {/* ✅ Load More grid */}
        <div className="mt-10">
          <TechGridClient techs={techs} chunk={40} />
        </div>

      </div>
    </section>
  );
}