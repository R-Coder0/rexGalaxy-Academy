/* eslint-disable @next/next/no-img-element */
import path from "path";
import fs from "fs/promises";
import React from "react";

type Tech = { src: string; label: string };

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

export default async function TechExpertiseSection2() {
  const techs = await getTechs();
  if (!techs.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg)] py-16 md:py-20 text-white border-t border-white/5">
      {/* Background layers (RexGalaxy theme) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,107,0,0.14),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_55%,rgba(34,211,238,0.10),transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.25),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] bg-size-[18px_18px]" />
      </div>

      {/* Moving headline text */}
      <div className="relative">
        <Marquee direction="left" text="REXGALAXY ACADEMY · AI-FIRST SKILLS · INDUSTRY TOOLS" outlined />
        <div className="-mt-4 md:-mt-7">
          <Marquee
            direction="right"
            text="REXGALAXY ACADEMY · AI-FIRST SKILLS · INDUSTRY TOOLS"
            outlined={false}
          />
        </div>

        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
        {/* Small heading */}
        <div className="mt-10 text-center">
          <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Our Tech Stack
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Tools & Platforms You’ll Master
          </h2>

          <div className="mt-4 h-[2px] w-40 mx-auto bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />
        </div>

        {/* Tiles + Load more (client) */}
        <div className="mt-10">
          <TechGridClient techs={techs} chunk={40} />
        </div>
      </div>
    </section>
  );
}

/* -----------------------------
   Helpers
----------------------------- */

function Marquee({
  text,
  direction,
  outlined = true,
}: {
  text: string;
  direction: "left" | "right";
  outlined?: boolean;
}) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={[
          "flex w-max items-center whitespace-nowrap",
          direction === "left"
            ? "animate-[marqLeft_26s_linear_infinite]"
            : "animate-[marqRight_26s_linear_infinite]",
        ].join(" ")}
      >
        <MarqueeText text={text} outlined={outlined} />
        <MarqueeText text={text} outlined={outlined} />
        <MarqueeText text={text} outlined={outlined} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marqLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
            @keyframes marqRight { 0%{transform:translateX(-33.333%)} 100%{transform:translateX(0)} }
          `,
        }}
      />
    </div>
  );
}

function MarqueeText({ text, outlined }: { text: string; outlined: boolean }) {
  return (
    <span
      className={[
        "px-10 py-2",
        "text-[34px] md:text-[66px] lg:text-[84px]",
        "font-extrabold uppercase tracking-[0.06em]",
        "drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        outlined ? "text-transparent opacity-60" : "text-white/90",
      ].join(" ")}
      style={outlined ? { WebkitTextStroke: "2px rgba(255,255,255,0.85)" } : undefined}
    >
      {text}
    </span>
  );
}

function TechTile({ tech }: { tech: Tech }) {
  return (
    <div
      className="
        group relative
        flex flex-col items-center justify-center
        h-[118px]
        rounded-xl
        border border-white/12
        bg-white/5
        backdrop-blur-sm
        shadow-[0_14px_30px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-white/22
        hover:bg-white/7
      "
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
        <div className="absolute -inset-6 rounded-[18px] bg-[radial-gradient(circle,rgba(255,107,0,0.10),transparent_60%)]" />
      </div>

      <img
        src={tech.src}
        alt={tech.label}
        loading="lazy"
        className="
          relative z-10 h-10 w-10 object-contain
          opacity-90 grayscale
          drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]
          transition duration-300
          group-hover:grayscale-0
          group-hover:opacity-100
        "
      />

      <div className="relative z-10 mt-3 text-sm font-semibold text-white/90">{tech.label}</div>
      <div className="relative z-10 mt-2 h-[2px] w-10 bg-white/15 transition group-hover:bg-[var(--brand)]/80" />
    </div>
  );
}

/* -----------------------------
   Client grid (Load more)
----------------------------- */
function TechGridClient({ techs, chunk = 40 }: { techs: Tech[]; chunk?: number }) {
  "use client";

  const [visible, setVisible] = React.useState(() => Math.min(chunk, techs.length));
  const canLoadMore = visible < techs.length;

  const shown = techs.slice(0, visible);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-8">
        {shown.map((t) => (
          <TechTile key={t.src} tech={t} />
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + chunk, techs.length))}
            className="
              inline-flex items-center justify-center
              rounded-full
              border border-white/15
              bg-white/5
              px-6 py-2.5
              text-sm font-semibold text-white/90
              backdrop-blur
              transition
              hover:bg-white/10 hover:border-white/25
              focus:outline-none focus:ring-2 focus:ring-white/20
            "
          >
            Load more
            <span className="ml-2 text-white/60">
              ({Math.min(visible + chunk, techs.length)}/{techs.length})
            </span>
          </button>
        </div>
      )}
    </>
  );
}   