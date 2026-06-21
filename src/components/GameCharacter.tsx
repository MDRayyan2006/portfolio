/**
 * GameCharacter — A dynamic "Mario-style" platforming character that leaps
 * between DOM elements based on scroll progress.
 *
 * Behavior:
 * - Reads DOM element bounding boxes every frame.
 * - Builds a sequence of waypoints based on predefined target IDs.
 * - Interpolates absolute X/Y page coordinates based on window.scrollY.
 * - Adds a parabolic sine-wave jump arc when transitioning between elements.
 * - Gracefully handles missing elements or spinning targets (like skill nodes).
 */

import { useEffect, useState, useRef } from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

/* ── Pixel character frames (CSS-drawn) ── */
function CharacterSprite({ frame }: { frame: "idle" | "run1" | "run2" | "jump" }) {
  return (
    <div className="relative" style={{ width: 28, height: 36 }}>
      {/* Head */}
      <div
        className="absolute rounded-sm"
        style={{
          width: 12,
          height: 12,
          top: 0,
          left: 8,
          background: "#ff3d1a",
          boxShadow: "0 0 8px rgba(255,61,26,0.5)",
        }}
      />
      {/* Eyes */}
      <div
        className="absolute"
        style={{
          width: 2,
          height: 2,
          top: 4,
          left: 11,
          background: "#080808",
          boxShadow: "4px 0 0 #080808",
        }}
      />
      {/* Body */}
      <div
        className="absolute rounded-sm"
        style={{
          width: 10,
          height: 10,
          top: 12,
          left: 9,
          background: "#cc2200",
          boxShadow: "0 0 6px rgba(255,42,0,0.3)",
        }}
      />
      {/* Arms */}
      <div
        className="absolute"
        style={{
          width: 4,
          height: 8,
          top: frame === "run1" || frame === "jump" ? 11 : 14,
          left: 5,
          background: "#ff3d1a",
          borderRadius: 1,
          transform:
            frame === "jump"
              ? "rotate(-45deg)"
              : frame === "run1"
              ? "rotate(-20deg)"
              : "rotate(10deg)",
          transition: "transform 0.08s, top 0.08s",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 4,
          height: 8,
          top: frame === "run2" || frame === "jump" ? 11 : 14,
          left: 19,
          background: "#ff3d1a",
          borderRadius: 1,
          transform:
            frame === "jump"
              ? "rotate(45deg)"
              : frame === "run2"
              ? "rotate(20deg)"
              : "rotate(-10deg)",
          transition: "transform 0.08s, top 0.08s",
        }}
      />
      {/* Legs */}
      <div
        className="absolute"
        style={{
          width: 4,
          height: 10,
          top: frame === "jump" ? 20 : 22,
          left: frame === "run1" ? 8 : 10,
          background: "#aa1a00",
          borderRadius: 1,
          transform:
            frame === "jump"
              ? "rotate(-30deg)"
              : frame === "run1"
              ? "rotate(-15deg)"
              : frame === "run2"
              ? "rotate(15deg)"
              : "rotate(0deg)",
          transition: "transform 0.08s, left 0.08s, top 0.08s",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 4,
          height: 10,
          top: frame === "jump" ? 20 : 22,
          left: frame === "run2" ? 16 : 14,
          background: "#aa1a00",
          borderRadius: 1,
          transform:
            frame === "jump"
              ? "rotate(30deg)"
              : frame === "run2"
              ? "rotate(-15deg)"
              : frame === "run1"
              ? "rotate(15deg)"
              : "rotate(0deg)",
          transition: "transform 0.08s, left 0.08s, top 0.08s",
        }}
      />
    </div>
  );
}

/* ── DOM Targets in sequence order ── */
const TARGET_IDS = [
  "target-explore-world",
  "target-explore-skills",
  "target-solar-core",
  "target-skill-0",
  "target-skill-1",
  "target-skill-2",
  "target-skill-3",
  "target-skill-4",
  "target-skill-5",
];

export function GameCharacter({ visible }: { visible: boolean }) {
  const prefersReduced = useReducedMotion();
  const charRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<"idle" | "run1" | "run2" | "jump">("idle");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible || prefersReduced) return;

    let isRunning = false;
    let runToggle = false;
    let runLastTime = 0;

    const loop = (time: number) => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      /* 1. Build waypoints dynamically every frame */
      const waypoints: { x: number; y: number; trigger: number }[] = [];

      // Waypoint 0: Left side of screen, above first section
      waypoints.push({
        x: 60, // left margin
        y: vh * 0.5, // centered vertically initially
        trigger: 0,
      });

      TARGET_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Target X: Center of element
          const pageX = rect.left + rect.width / 2;
          // Target Y: Top edge of element (so character stands on it)
          const pageY = rect.top + scrollY - 20;
          
          // Trigger scroll depth: when element is vertically near center of viewport
          const trigger = Math.max(0, pageY - vh * 0.55);
          
          waypoints.push({ x: pageX, y: pageY, trigger });
        }
      });

      // Ensure waypoints are strictly monotonic by trigger
      for (let i = 1; i < waypoints.length; i++) {
        if (waypoints[i].trigger <= waypoints[i - 1].trigger) {
          waypoints[i].trigger = waypoints[i - 1].trigger + 1;
        }
      }

      // Waypoint N: End of page bounds (prevent crashing off bottom)
      const lastWp = waypoints[waypoints.length - 1];
      waypoints.push({
        x: lastWp.x,
        y: lastWp.y + vh, // Extrapolate downward
        trigger: lastWp.trigger + vh,
      });

      /* 2. Find which segment we are currently in */
      let segmentIndex = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (scrollY >= waypoints[i].trigger && scrollY <= waypoints[i + 1].trigger) {
          segmentIndex = i;
          break;
        } else if (scrollY > waypoints[i + 1].trigger) {
          segmentIndex = i + 1; // fallback if we're past the last trigger
        }
      }

      /* 3. Interpolate X, Y */
      let currentX = 0;
      let currentY = 0;
      let isJumpingSegment = false;
      let jumpProgress = 0;

      if (segmentIndex >= waypoints.length - 1) {
        // Clamped at end
        currentX = lastWp.x;
        currentY = lastWp.y;
      } else {
        const wpA = waypoints[segmentIndex];
        const wpB = waypoints[segmentIndex + 1];
        
        const segmentRange = wpB.trigger - wpA.trigger;
        jumpProgress = segmentRange > 0 ? (scrollY - wpA.trigger) / segmentRange : 1;
        jumpProgress = Math.max(0, Math.min(1, jumpProgress));

        // Linear interpolation for base position
        currentX = wpA.x + (wpB.x - wpA.x) * jumpProgress;
        currentY = wpA.y + (wpB.y - wpA.y) * jumpProgress;

        // Parabolic jump arc on Y-axis
        if (segmentIndex > 0 || jumpProgress > 0) {
          isJumpingSegment = true;
          // Sine wave from 0 to PI gives a perfect arch
          const jumpArc = Math.sin(jumpProgress * Math.PI);
          // Jump height scales with distance, max 200px
          const dist = Math.abs(wpB.x - wpA.x) + Math.abs(wpB.y - wpA.y);
          const jumpHeight = Math.min(200, dist * 0.3 + 40);
          
          currentY -= jumpArc * jumpHeight;
        }
      }

      /* 4. Apply transforms using direct DOM manipulation for performance */
      if (charRef.current) {
        // Calculate screen-space Y (subtract scrollY since char is fixed)
        const screenY = currentY - scrollY;
        // Transform origin is bottom center
        charRef.current.style.transform = `translate3d(${currentX}px, ${screenY}px, 0) translate(-50%, -100%)`;
      }

      /* 5. Determine Sprite Frame */
      if (isJumpingSegment && jumpProgress > 0.05 && jumpProgress < 0.95) {
        setFrame("jump");
        isRunning = false;
      } else {
        // Idle or Run based on scroll delta
        if (jumpProgress > 0 && jumpProgress < 1) {
          // We are actively scrolling through a very flat segment?
          // (Usually we jump, so this might not hit often, but good for flat runs)
          if (!isRunning) {
            isRunning = true;
            runToggle = false;
          }
          if (time - runLastTime > 120) {
            runToggle = !runToggle;
            setFrame(runToggle ? "run1" : "run2");
            runLastTime = time;
          }
        } else {
          setFrame("idle");
          isRunning = false;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={charRef}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4 }}
          className="fixed z-[100] top-0 left-0 pointer-events-none will-change-transform"
          style={
            prefersReduced
              ? { left: 60, top: "50%", transform: "translate(0, -50%)" }
              : {} // Transforms applied manually in rAF for 60fps
          }
        >
          {/* Character glow trail */}
          <div
            className="absolute inset-0 blur-sm"
            style={{
              background: "rgba(255,61,26,0.15)",
              borderRadius: "50%",
              transform: "scale(1.5)",
            }}
          />

          {/* The character sprite */}
          <CharacterSprite frame={prefersReduced ? "idle" : frame} />

          {/* Label below character */}
          <motion.div
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] uppercase tracking-[0.2em]"
            style={{
              color: "rgba(255,61,26,0.5)",
              textShadow: "0 0 6px rgba(255,42,0,0.3)",
            }}
          >
            GUIDE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Static Idle Character for the Boot Trigger button ── */
export function GameCharacterIdle({ visible }: { visible: boolean }) {
  const prefersReduced = useReducedMotion();
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: prefersReduced ? 0 : [0, -4, 0], scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          transition={{
            opacity: { duration: 0.3 },
            y: prefersReduced 
              ? { duration: 0.3 } 
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-10 flex flex-col items-center pointer-events-none"
        >
          <div
            className="absolute inset-0 blur-sm"
            style={{
              background: "rgba(255,61,26,0.15)",
              borderRadius: "50%",
              transform: "scale(1.5)",
            }}
          />
          <CharacterSprite frame="idle" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
