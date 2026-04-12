"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";

export type Tech = {
  src: string;
  label: string;
};

export default function TechGridClient({
  techs,
  chunk = 40,
}: {
  techs: Tech[];
  chunk?: number;
}) {
  const [visible, setVisible] = React.useState(() =>
    Math.min(chunk, techs.length)
  );

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
            onClick={() =>
              setVisible((v) => Math.min(v + chunk, techs.length))
            }
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
            Load More
            <span className="ml-2 text-white/60">
              ({Math.min(visible + chunk, techs.length)}/{techs.length})
            </span>
          </button>
        </div>
      )}
    </>
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
      <img
        src={tech.src}
        alt={tech.label}
        loading="lazy"
        className="
          h-10 w-10 object-contain
          opacity-90 grayscale
          transition duration-300
          group-hover:grayscale-0
          group-hover:opacity-100
        "
      />

      <div className="mt-3 text-sm font-semibold text-white/90">
        {tech.label}
      </div>

      <div className="mt-2 h-[2px] w-10 bg-white/15 transition group-hover:bg-[var(--brand)]/80" />
    </div>
  );
}