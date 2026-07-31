/**
 * CatCompanion — A charming pixel-art cat that lives near the hero button.
 *
 * Behaviour:
 *  - Roams randomly within a safe radius around its anchor point.
 *  - State machine: idle · walk · sit · look · stretch · lie · circle.
 *  - Sprite flips with movement direction.
 *  - Click triggers a playful bounce reaction, then returns to roaming.
 *  - pointer-events-none on the cat body so it never blocks clicks.
 *  - Exported as GameCharacterIdle (used in HudBootSequence) and
 *    GameCharacter (kept for API compatibility, now a no-op).
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────
   CAT STATES
───────────────────────────────────────────── */
type CatState = "idle" | "walk" | "sit" | "look" | "stretch" | "lie" | "circle";

/* ─────────────────────────────────────────────
   PIXEL-ART CAT SPRITE  (pure CSS, ~40×32 px)
   Colour palette: warm grey / cream / dark nose
───────────────────────────────────────────── */
function CatSprite({
  state,
  frame,
  flipped,
}: {
  state: CatState;
  frame: number; // 0 | 1  (walk cycle)
  flipped: boolean;
}) {
  const W = 40;
  const H = 32;

  // Colours
  const fur = "#c8bfb0";       // warm grey-cream
  const furDark = "#a89f92";   // shadow / inner ear
  const nose = "#e8a0a0";      // pink nose
  const eye = "#2a2018";       // dark eye
  const belly = "#e8e2d8";     // lighter belly
  const stripe = "#b0a898";    // tabby stripe

  /* ── helpers ── */
  const px = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    radius = 0,
    extra: React.CSSProperties = {}
  ) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        borderRadius: radius,
        ...extra,
      }}
    />
  );

  /* ── body variants per state ── */
  // Walk: legs alternate; Sit: no visible legs; Lie: body flattened; Stretch: elongated
  const isLie = state === "lie";
  const isSit = state === "sit";
  const isStretch = state === "stretch";

  // Body position
  const bodyY = isLie ? 18 : isSit ? 14 : isStretch ? 16 : 16;
  const bodyH = isLie ? 10 : isSit ? 12 : isStretch ? 10 : 12;
  const bodyW = isStretch ? 24 : 18;

  // Head bob (idle breathing or look)
  const headY = isLie ? 16 : isSit ? 8 : isStretch ? 14 : 10;
  const headX = isStretch ? (flipped ? 4 : 18) : 12;

  // Tail: a small curved arc rendered as rotated rounded div
  const tailAngle = isLie ? -10 : isSit ? -50 : state === "idle" ? -30 : -20;

  // Ear twitch for "look" state
  const earH = state === "look" ? 7 : 6;

  // Walk leg offsets
  const legL = frame === 0 ? 0 : 2;
  const legR = frame === 0 ? 2 : 0;

  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      {/* ── Tail ── */}
      {px(isStretch ? (flipped ? 28 : 0) : 28, bodyY + 2, 8, 5, furDark, 4, {
        transform: `rotate(${tailAngle}deg)`,
        transformOrigin: "left center",
      })}

      {/* ── Body ── */}
      {px(isStretch ? 8 : 11, bodyY, bodyW, bodyH, fur, 5)}
      {/* Belly highlight */}
      {!isLie && px(14, bodyY + 2, 10, bodyH - 4, belly, 4)}
      {/* Tabby stripe */}
      {px(15, bodyY + 1, 2, bodyH - 2, stripe, 1)}
      {px(19, bodyY + 1, 2, bodyH - 2, stripe, 1)}

      {/* ── Legs ── */}
      {!isSit && !isLie && (
        <>
          {px(12, bodyY + bodyH - 2, 5, 5 + legL, furDark, 2)}
          {px(19, bodyY + bodyH - 2, 5, 5 + legR, furDark, 2)}
          {/* Back legs (stretch state shows hind legs back) */}
          {isStretch && px(24, bodyY + bodyH - 2, 5, 5, furDark, 2)}
        </>
      )}

      {/* Sit: paws in front */}
      {isSit && (
        <>
          {px(13, bodyY + bodyH, 5, 5, furDark, 2)}
          {px(20, bodyY + bodyH, 5, 5, furDark, 2)}
        </>
      )}

      {/* ── Head ── */}
      {px(headX, headY, 14, 12, fur, 6)}

      {/* Ears */}
      {px(headX + 1, headY - earH + 2, 4, earH, fur, 2)}
      {px(headX + 9, headY - earH + 2, 4, earH, fur, 2)}
      {/* Inner ears */}
      {px(headX + 2, headY - earH + 3, 2, earH - 2, furDark, 1)}
      {px(headX + 10, headY - earH + 3, 2, earH - 2, furDark, 1)}

      {/* ── Eyes ── */}
      {/* closed/blinking eye for lie state */}
      {isLie ? (
        <>
          {px(headX + 3, headY + 4, 3, 1, eye, 0)}
          {px(headX + 8, headY + 4, 3, 1, eye, 0)}
        </>
      ) : (
        <>
          {px(headX + 3, headY + 3, 3, 3, eye, 2)}
          {px(headX + 8, headY + 3, 3, 3, eye, 2)}
          {/* eye shine */}
          {px(headX + 4, headY + 3, 1, 1, "#ffffff", 0)}
          {px(headX + 9, headY + 3, 1, 1, "#ffffff", 0)}
        </>
      )}

      {/* ── Nose ── */}
      {px(headX + 5, headY + 7, 4, 3, nose, 2)}

      {/* ── Whiskers ── */}
      <div
        style={{
          position: "absolute",
          left: headX - 6,
          top: headY + 7,
          width: 8,
          height: 1,
          background: "#888",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: headX - 6,
          top: headY + 9,
          width: 8,
          height: 1,
          background: "#888",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: headX + 16,
          top: headY + 7,
          width: 8,
          height: 1,
          background: "#888",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: headX + 16,
          top: headY + 9,
          width: 8,
          height: 1,
          background: "#888",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROAM HELPERS
───────────────────────────────────────────── */
function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function rndInt(min: number, max: number) {
  return Math.floor(rnd(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* Safe roam radius around anchor */
const ROAM_R = 80; // px from anchor centre

function randomTarget(ax: number, ay: number) {
  const angle = rnd(0, Math.PI * 2);
  const r = rnd(20, ROAM_R);
  return { x: ax + Math.cos(angle) * r, y: ay + Math.sin(angle) * r };
}

/* ─────────────────────────────────────────────
   CAT COMPANION  (the real component)
───────────────────────────────────────────── */
export function GameCharacterIdle({ visible }: { visible: boolean }) {
  const prefersReduced = useReducedMotion();

  // Position state driven by Framer Motion
  const [pos, setPos] = useState({ x: 0, y: -10 });        // offset from anchor
  const [catState, setCatState] = useState<CatState>("idle");
  const [frame, setFrame] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [scale, setScale] = useState(1);
  const [blinking, setBlinking] = useState(false);

  // We'll use a ref for the current anchor so the timer callbacks see fresh values
  const anchorRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: -10 });
  const stateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkFrameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const circleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bobDurationRef = useRef(rnd(2.2, 3.2)); // stable bob speed

  /* ── Walk-cycle animation ── */
  const startWalkCycle = useCallback(() => {
    if (walkFrameRef.current) clearInterval(walkFrameRef.current);
    walkFrameRef.current = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, 160);
  }, []);

  const stopWalkCycle = useCallback(() => {
    if (walkFrameRef.current) clearInterval(walkFrameRef.current);
    walkFrameRef.current = null;
    setFrame(0);
  }, []);

  /* ── Random blink ── */
  const scheduleBlink = useCallback(() => {
    const delay = rnd(2500, 6000);
    blinkRef.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, 120);
    }, delay);
  }, []);

  /* ── Move the cat to a position ── */
  const moveTo = useCallback(
    (x: number, y: number) => {
      const dx = x - posRef.current.x;
      setFlipped(dx < -1);
      posRef.current = { x, y };
      setPos({ x, y });
    },
    []
  );

  /* ── State machine tick ── */
  const nextBehaviour = useCallback(() => {
    const ax = anchorRef.current.x;
    const ay = anchorRef.current.y;

    if (prefersReduced) {
      setCatState("sit");
      return;
    }

    const choices: { state: CatState; weight: number }[] = [
      { state: "walk", weight: 35 },
      { state: "sit", weight: 20 },
      { state: "idle", weight: 20 },
      { state: "look", weight: 10 },
      { state: "stretch", weight: 7 },
      { state: "lie", weight: 5 },
      { state: "circle", weight: 3 },
    ];

    // Weighted random pick
    const total = choices.reduce((s, c) => s + c.weight, 0);
    let r = Math.random() * total;
    let chosen: CatState = "idle";
    for (const c of choices) {
      r -= c.weight;
      if (r <= 0) { chosen = c.state; break; }
    }

    setCatState(chosen);

    if (chosen === "walk") {
      startWalkCycle();
      const target = randomTarget(ax, ay);
      moveTo(target.x, target.y);
      const dist = Math.hypot(target.x - posRef.current.x, target.y - posRef.current.y);
      const dur = Math.max(1000, dist * 14); // speed proportional to distance
      stateTimeoutRef.current = setTimeout(() => {
        stopWalkCycle();
        nextBehaviour();
      }, dur + rnd(200, 600));

    } else if (chosen === "circle") {
      // Walk in a small arc around the anchor
      startWalkCycle();
      let angle = Math.atan2(posRef.current.y - ay, posRef.current.x - ax);
      const radius = rnd(35, 60);
      const speed = pick([1, -1]) * rnd(0.015, 0.025); // rad/frame
      const steps = rndInt(20, 40);
      let step = 0;
      circleRef.current = setInterval(() => {
        angle += speed;
        const nx = ax + Math.cos(angle) * radius;
        const ny = ay + Math.sin(angle) * radius;
        moveTo(nx, ny);
        step++;
        if (step >= steps) {
          clearInterval(circleRef.current!);
          stopWalkCycle();
          nextBehaviour();
        }
      }, 80);

    } else {
      // Stationary states
      stopWalkCycle();

      // Maybe drift slightly before settling
      if (Math.random() < 0.4) {
        const t = randomTarget(ax, ay);
        moveTo(t.x, t.y);
      }

      // Turn toward anchor sometimes
      if (chosen === "look" || chosen === "sit") {
        const dx = ax - posRef.current.x;
        setFlipped(dx < 0);
      }

      const minDur = chosen === "lie" ? 3000 : chosen === "sit" ? 1500 : 800;
      const maxDur = chosen === "lie" ? 7000 : chosen === "sit" ? 4000 : 2500;

      stateTimeoutRef.current = setTimeout(nextBehaviour, rnd(minDur, maxDur));
    }
  }, [prefersReduced, startWalkCycle, stopWalkCycle, moveTo]);

  /* ── Click reaction ── */
  const handleClick = useCallback(() => {
    if (reacting) return;
    setReacting(true);
    stopWalkCycle();
    if (circleRef.current) clearInterval(circleRef.current);
    if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    setCatState("idle");
    setScale(1.3);
    setTimeout(() => setScale(1), 200);
    // Short playful bounce then return to roaming
    setTimeout(() => {
      setReacting(false);
      nextBehaviour();
    }, 1200);
  }, [reacting, stopWalkCycle, nextBehaviour]);

  /* ── Lifecycle ── */
  useEffect(() => {
    if (!visible) return;

    scheduleBlink();
    const startDelay = setTimeout(nextBehaviour, 800);

    return () => {
      clearTimeout(startDelay);
      if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
      if (walkFrameRef.current) clearInterval(walkFrameRef.current);
      if (blinkRef.current) clearTimeout(blinkRef.current);
      if (circleRef.current) clearInterval(circleRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* ── Transition durations per state ── */
  const moveDuration =
    catState === "walk" ? 1.4
    : catState === "circle" ? 0.08
    : catState === "stretch" ? 0.6
    : 0.5;

  /* ── Idle body bob ── */
  const shouldBob = catState === "idle" || catState === "sit" || catState === "look";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 12 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 flex flex-col items-center"
          style={{ pointerEvents: "none" }}
        >
          {/* Offset container that moves the cat around the anchor */}
          <motion.div
            animate={{ x: pos.x, y: pos.y, scale }}
            transition={{
              x: { duration: moveDuration, ease: [0.4, 0, 0.2, 1] },
              y: { duration: moveDuration, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: 0.18, ease: "easeOut" },
            }}
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            onClick={handleClick}
            title=""
          >
            {/* Body bob when stationary */}
            <motion.div
              animate={shouldBob ? { y: [0, -3, 0] } : { y: 0 }}
              transition={
                shouldBob
                  ? { duration: bobDurationRef.current, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            >
              {/* Shadow under cat */}
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: catState === "lie" ? 34 : 22,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.25)",
                  filter: "blur(2px)",
                  transition: "width 0.4s ease",
                }}
              />

              {/* React blink on eyes via blinking state */}
              <CatSprite
                state={blinking ? "lie" : catState} // "lie" closes eyes = blink
                frame={frame}
                flipped={flipped}
              />

              {/* Tiny heart pops up on click reaction */}
              <AnimatePresence>
                {reacting && (
                  <motion.div
                    key="heart"
                    initial={{ opacity: 0, y: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -28, scale: [0.4, 1.2, 1, 0.6] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 14,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    🩷
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   API SHIM — kept so index.tsx import doesn't break.
   The cat companion lives near the button (HudBootSequence),
   no longer needs a scroll-tracking version.
───────────────────────────────────────────── */
export function GameCharacter({ visible: _visible }: { visible: boolean }) {
  // No-op: cat companion is rendered via GameCharacterIdle in HudBootSequence
  return null;
}
