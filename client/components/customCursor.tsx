"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y, target } = e;

      // follow
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // if hovering interactive, shrink/hide our cursor and let native pointer show
      const isInteractive = (target as Element)?.closest?.(
        'a, button, [role="button"], input, textarea, select, .cursor-pointer'
      );
      setInteractive(Boolean(isInteractive));
    };

    const hide = () => setHidden(true);
    const show = () => setHidden(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseenter", show);
    window.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseenter", show);
      window.removeEventListener("mouseleave", hide);
    };
  }, []);

  // hide custom cursor when native pointer should be visible
  const visibility = hidden || interactive ? "opacity-0 scale-75" : "opacity-100";

  return (
    <>
      {/* tiny center dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] custom-cursor 
          h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full 
          bg-orange-400/90 mix-blend-difference ${visibility}`}
      />
      {/* outer ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] custom-cursor 
          h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full 
          border border-orange-400/50 backdrop-blur-sm 
          ${visibility}`}
      />
    </>
  );
}
    