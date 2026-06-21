/**
 * HudBootSequence — Full-screen HUD boot overlay
 *
 * Triggered by clicking the hero button. Renders a terminal-style
 * boot sequence with HUD line-draw animations, then smooth-scrolls
 * the user into the About section.
 *
 * Animation choices:
 * - pathLength 0→1 on SVG brackets for "line drawing" feel (GPU: transform only)
 * - Terminal text typed char-by-char with setInterval for authenticity
 * - Progress bar uses scaleX transform (GPU-accelerated, no layout thrash)
 * - Spring config { stiffness: 400, damping: 25 } for power-on overshoot
 * - All exits use opacity + scale(1.05) for a quick "power down" dismiss
 *
 * Reduced motion: skips overlay entirely, immediately scrolls to #about
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GameCharacterIdle } from "@/components/GameCharacter";

/* ── Boot log lines typed sequentially ── */
const BOOT_LINES = [
  { text: "> INITIALIZING SYSTEM...", delay: 0 },
  { text: "> LOADING NEURAL MODULES...", delay: 600 },
  { text: "> CALIBRATING SKILL MATRIX...", delay: 1100 },
  { text: "> CONNECTING TO PORTFOLIO SERVER...", delay: 1600 },
  { text: "> ALL SYSTEMS ONLINE", delay: 2100 },
];

const TOTAL_DURATION = 2800; // ms for full boot

/* ── HUD corner bracket SVG (draws in via pathLength) ── */
function HudBracket({
  corner,
  delay,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  // Each bracket is an L-shaped path
  const paths: Record<string, string> = {
    tl: "M 2,30 L 2,2 L 30,2",
    tr: "M 70,2 L 98,2 L 98,30",
    bl: "M 2,70 L 2,98 L 30,98",
    br: "M 70,98 L 98,98 L 98,70",
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute pointer-events-none"
      style={{
        width: 80,
        height: 80,
        ...(corner.includes("t") ? { top: 0 } : { bottom: 0 }),
        ...(corner.includes("l") ? { left: 0 } : { right: 0 }),
      }}
    >
      <motion.path
        d={paths[corner]}
        fill="none"
        stroke="rgba(255,42,0,0.6)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.6, delay, ease: "easeOut" },
          opacity: { duration: 0.2, delay },
        }}
      />
    </motion.svg>
  );
}

/* ── Terminal line with typewriter effect ── */
function TerminalLine({
  text,
  startDelay,
  isLast,
}: {
  text: string;
  startDelay: number;
  isLast: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 25); // 25ms per char for snappy typing
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="font-mono text-[11px] tracking-[0.08em] leading-relaxed"
      style={{
        color: isLast ? "#ff3d1a" : "rgba(255,61,26,0.6)",
        textShadow: isLast ? "0 0 12px rgba(255,42,0,0.4)" : "none",
      }}
    >
      {displayed}
      {displayed.length < text.length && (
        <span className="terminal-cursor" />
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   BOOT SEQUENCE OVERLAY
   ════════════════════════════════════════════════════════ */

export function HudBootSequence({ onBootComplete }: { onBootComplete?: () => void }) {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"booting" | "exit">("booting");
  const prefersReduced = useReducedMotion();
  const startRef = useRef(0);

  /* ── Handle boot trigger ── */
  const handleInitialize = useCallback(() => {
    // Reduced motion: skip overlay, just scroll
    if (prefersReduced) {
      document.getElementById("about")?.scrollIntoView({ behavior: "auto" });
      return;
    }
    setActive(true);
    setPhase("booting");
    setProgress(0);
  }, [prefersReduced]);

  /* ── Progress ticker (uses rAF, not setInterval) ── */
  useEffect(() => {
    if (!active || phase !== "booting") return;
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / TOTAL_DURATION, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Boot complete → start exit
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => {
            setActive(false);
            onBootComplete?.();
            // Smooth scroll to About section
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }, 700);
        }, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [active, phase]);

  return (
    <>
      {/* ── Trigger Button (replaces Play button) ── */}
      <div className="absolute right-[8%] top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        {/* Game Character sits here until initialized */}
        <GameCharacterIdle visible={!active} />
        
        <motion.button
          onClick={handleInitialize}
          aria-label="Initialize System — scroll into interactive resume"
          /* Spring-based hover: scale + glow overshoot for tactile feel */
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative border border-primary/50 bg-background/80 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur-md transition-shadow hover:shadow-[0_0_30px_rgba(255,42,0,0.4)]"
        >
          {/* Red underline accent */}
          <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary/80 to-primary/20" />
          {/* Pulsing dot */}
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ring" />
          [ INITIALIZE SYSTEM ]
        </motion.button>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
          Enter Interactive Resume
        </span>
      </div>

      {/* ── Boot Overlay ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="boot-overlay"
            initial={{ opacity: 0 }}
            animate={
              phase === "exit"
                ? { opacity: 0, scale: 1.05 }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: phase === "exit" ? 0.6 : 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed inset-0 z-[9990] flex items-center justify-center hud-scanline"
            style={{ background: "#030303" }}
          >
            {/* Central boot container */}
            <div className="relative w-[400px] max-w-[90vw]">
              {/* HUD corner brackets — draw in on mount */}
              <HudBracket corner="tl" delay={0.1} />
              <HudBracket corner="tr" delay={0.2} />
              <HudBracket corner="bl" delay={0.3} />
              <HudBracket corner="br" delay={0.4} />

              {/* Content area */}
              <div className="px-10 py-12">
                {/* System label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mb-6 font-mono text-[9px] uppercase tracking-[0.35em] text-primary/40"
                >
                  PORTFOLIO OS v2.0
                </motion.div>

                {/* Terminal lines */}
                <div className="space-y-1.5 min-h-[120px]">
                  {BOOT_LINES.map((line, i) => (
                    <TerminalLine
                      key={i}
                      text={line.text}
                      startDelay={line.delay}
                      isLast={i === BOOT_LINES.length - 1}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-primary/40">
                      System Boot
                    </span>
                    <span
                      className="font-mono text-[10px] tracking-[0.15em]"
                      style={{
                        color: "rgba(255,42,0,0.7)",
                        textShadow: "0 0 8px rgba(255,42,0,0.3)",
                      }}
                    >
                      {progress}%
                    </span>
                  </div>
                  {/* Track */}
                  <div className="h-[2px] w-full bg-white/[0.04] overflow-hidden">
                    {/* Fill — uses scaleX for GPU acceleration */}
                    <motion.div
                      className="h-full origin-left"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,42,0,0.9), rgba(255,85,0,0.7))",
                        boxShadow: "0 0 12px rgba(255,42,0,0.5)",
                        scaleX: progress / 100,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                {/* Status indicator */}
                <motion.div
                  className="mt-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        progress >= 100
                          ? "#ff3d1a"
                          : "rgba(255,42,0,0.4)",
                      boxShadow:
                        progress >= 100
                          ? "0 0 8px rgba(255,42,0,0.6)"
                          : "none",
                    }}
                    animate={
                      progress < 100
                        ? { opacity: [0.3, 1, 0.3] }
                        : { opacity: 1 }
                    }
                    transition={
                      progress < 100
                        ? { duration: 1, repeat: Infinity }
                        : { duration: 0.2 }
                    }
                  />
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-primary/40">
                    {progress >= 100 ? "READY" : "PROCESSING..."}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Sweep line — vertical scan */}
            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,42,0,0.3), transparent)",
              }}
              animate={{ top: ["0%", "100%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
