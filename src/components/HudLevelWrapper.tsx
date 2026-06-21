/**
 * HudLevelWrapper — Scroll-driven "level" wrapper with HUD chrome
 *
 * Makes any section behave as a game level that "powers on" as it
 * scrolls into the viewport. Uses useScroll + useTransform for
 * scroll-linked motion (not just fade-in-on-view).
 *
 * Animation choices:
 * - SVG brackets use pathLength tied to scrollYProgress (true scroll-linked)
 * - Level label opacity + translateX mapped to scroll (not just whileInView)
 * - Content translateY + opacity mapped to scroll range [0.1, 0.4]
 * - Horizontal sweep line traverses section at scroll midpoint
 * - All transforms are GPU-accelerated (transform + opacity only)
 *
 * Reduced motion: content fades in with simple opacity, no transforms
 */

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface HudLevelWrapperProps {
  levelNumber: number;
  levelName: string;
  children: ReactNode;
  className?: string;
}

export function HudLevelWrapper({
  levelNumber,
  levelName,
  children,
  className = "",
}: HudLevelWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  /* ── Scroll progress: 0 = section top hits viewport bottom,
       1 = section bottom hits viewport top ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* ── Scroll-linked transforms ── */
  // Bracket draw-in: start at 0% when section enters, complete at 30%
  const bracketProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Level label: fade + slide from left, mapped to scroll [0.05, 0.25]
  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const labelX = useTransform(scrollYProgress, [0.05, 0.25], [-20, 0]);

  // Content: slide up + fade, mapped to scroll [0.1, 0.35]
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.35], [40, 0]);

  // Sweep line: horizontal position mapped to scroll [0.15, 0.5]
  const sweepX = useTransform(scrollYProgress, [0.15, 0.5], ["-100%", "200%"]);
  const sweepOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.3, 0.45, 0.5],
    [0, 0.6, 0.6, 0]
  );

  // Pad the level number: 01, 02, etc.
  const levelLabel = `LVL ${String(levelNumber).padStart(2, "0")} // ${levelName}`;

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {/* ── HUD Corner Brackets (SVG, scroll-linked pathLength) ── */}
      {!prefersReduced && (
        <>
          {/* Top-left bracket */}
          <svg
            className="absolute top-4 left-4 pointer-events-none z-10"
            width="36"
            height="36"
            viewBox="0 0 36 36"
          >
            <motion.path
              d="M 1,30 L 1,1 L 30,1"
              fill="none"
              stroke="rgba(255,42,0,0.4)"
              strokeWidth={1}
              strokeLinecap="round"
              style={{ pathLength: bracketProgress }}
            />
          </svg>

          {/* Bottom-right bracket */}
          <svg
            className="absolute bottom-4 right-4 pointer-events-none z-10"
            width="36"
            height="36"
            viewBox="0 0 36 36"
          >
            <motion.path
              d="M 6,35 L 35,35 L 35,6"
              fill="none"
              stroke="rgba(255,42,0,0.4)"
              strokeWidth={1}
              strokeLinecap="round"
              style={{ pathLength: bracketProgress }}
            />
          </svg>
        </>
      )}

      {/* ── Level Label (scroll-linked opacity + x) ── */}
      <motion.div
        className="absolute top-5 left-12 z-10 font-mono text-[9px] uppercase tracking-[0.3em]"
        style={
          prefersReduced
            ? { opacity: 1 }
            : {
                opacity: labelOpacity,
                x: labelX,
                color: "rgba(255,42,0,0.45)",
                textShadow: "0 0 8px rgba(255,42,0,0.2)",
              }
        }
      >
        {levelLabel}
      </motion.div>

      {/* ── Horizontal Sweep Line ── */}
      {!prefersReduced && (
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-[1px] pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,42,0,0.4) 40%, rgba(255,42,0,0.4) 60%, transparent 100%)",
            x: sweepX,
            opacity: sweepOpacity,
          }}
        />
      )}

      {/* ── Content (scroll-linked translateY + opacity) ── */}
      <motion.div
        style={
          prefersReduced
            ? { opacity: 1 }
            : { opacity: contentOpacity, y: contentY }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
