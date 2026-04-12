/* eslint-disable @next/next/no-img-element */
import path from "path";
import fs from "fs/promises";

type BrandLogo = {
  name: string;
  src: string;
  href?: string;
};

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

async function getBrandLogos(): Promise<BrandLogo[]> {
  // ✅ Use your folder name: /public/alumni (recommended)
  const dir = path.join(process.cwd(), "public", "alumni");

  try {
    const files = await fs.readdir(dir);

    return files
      .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => {
        const name = f.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
        return { name: name || f, src: `/alumni/${f}` };
      });
  } catch {
    return [];
  }
}

function LogoItem({ logo }: { logo: BrandLogo }) {
  const item = (
    <div
      className="
        h-20
        w-[150px] sm:w-40 md:w-[170px] lg:w-[180px] 2xl:w-[190px]
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur
        flex items-center justify-center
        transition duration-300
        hover:border-white/18 hover:bg-white/7
      "
    >
      <img
        src={logo.src}
        alt={logo.name}
        className="
          max-h-16 w-auto max-w-[140px] object-contain
          opacity-80 grayscale
          transition duration-300
          group-hover:opacity-100 group-hover:grayscale-0
        "
        loading="lazy"
      />
    </div>
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noreferrer"
        aria-label={logo.name}
        className="group outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
      >
        {item}
      </a>
    );
  }

  return <div className="group">{item}</div>;
}

export default async function AlumniLogos() {
  const logos = await getBrandLogos();
  if (!logos.length) return null;

  const track = [...logos, ...logos];
  const hasEnough = logos.length >= 6;

  return (
    <section className="relative overflow-hidden bg-[var(--bg)] py-16 sm:py-20 border-t border-white/5">
      {/* AI background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(139,92,246,0.06),transparent_60%)]" />

      {/* Optional decor SVGs (dark theme) */}
      <img
        src="/homepage/orbit-decor.svg"
        alt=""
        className="pointer-events-none select-none absolute right-[-40px] top-[-30px] z-0 w-[220px] opacity-25 rotate-12 md:w-[420px]"
        loading="lazy"
      />
      <img
        src="/homepage/orbit-decor.svg"
        alt=""
        className="pointer-events-none select-none absolute left-[-40px] bottom-[-40px] z-0 w-[220px] opacity-20 -rotate-12 md:w-[380px] hidden md:block"
        loading="lazy"
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10">
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--ai-cyan)]" />
            <p className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Our learners work at
            </p>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            Alumni Placed Across <span className="text-[var(--brand)]">Top Companies</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/65 max-w-2xl">
            Learners from RexGalaxy Academy have built careers in product companies, IT services, startups,
            and high-growth teams.
          </p>

          <div className="mt-6 h-[2px] w-40 bg-gradient-to-r from-[var(--brand)] via-[var(--ai-cyan)] to-transparent" />
        </div>

        {/* Container */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          {/* Mobile fade edges (for marquee) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-black/70 to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black/70 to-transparent sm:hidden" />

          <div className="p-6 md:p-8">
            {/* ✅ MOBILE: marquee */}
            <div className="sm:hidden">
              <div className="group overflow-hidden">
                <div
                  className={[
                    "flex w-max items-center",
                    hasEnough ? "gap-10" : "gap-14",
                    "motion-reduce:animate-none",
                    "group-hover:[animation-play-state:paused]",
                    "animate-[logoMarquee_40s_linear_infinite]",
                  ].join(" ")}
                >
                  {track.map((logo, i) => (
                    <div key={`${logo.name}-${i}`}>
                      <LogoItem logo={logo} />
                    </div>
                  ))}
                </div>

                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                      @keyframes logoMarquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                      }
                    `,
                  }}
                />
              </div>
            </div>

            {/* ✅ TABLET + DESKTOP grid */}
            <div className="hidden sm:block">
              <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
                {logos.map((logo, i) => (
                  <div key={i}>
                    <LogoItem logo={logo} />
                  </div>
                ))}
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}