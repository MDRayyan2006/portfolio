/**
 * SolarSkills — Game Star Map Navigation Console
 *
 * A solar-system orbital diagram that doubles as a game "star map."
 * Accepts a `powered` prop: when false, renders in cold/dim state;
 * when true, transitions to vibrant colors — like a console booting up.
 *
 * Animation choices:
 * - Cold→Hot transition uses CSS transitions on color/opacity/boxShadow
 *   (GPU-accelerated, no layout reflow)
 * - Node hover: whileHover scale(1.12) + whileTap scale(0.95)
 *   with spring { stiffness: 350, damping: 18 } for tactile overshoot
 * - Orbital animations use useTime + useTransform for smooth rotation
 * - HUD chrome: corner brackets, "STAR MAP // ONLINE" label, grid lines
 */

import { Code2, Brain, Database, Server, Monitor, Settings } from "lucide-react";
import { useMemo } from "react";
import { motion, useTime, useTransform, useReducedMotion } from "framer-motion";

/* ─── Concentric flattened orbits (NASA 3D orbital perspective) ─── */
const orbits = [
  { rx: 16, ry: 7, speed: 18000 },
  { rx: 24, ry: 11, speed: 24000 },
  { rx: 32, ry: 15, speed: 32000 },
  { rx: 40, ry: 19, speed: 42000 },
  { rx: 48, ry: 23, speed: 55000 },
];

/* ─── Skill nodes with orbit index (0-based) and angle ─── */
const nodes = [
  {
    orbit: 2,
    angle: 210,
    icon: Code2,
    label: "LANGUAGES",
    color: "#ff9d2d",
    coldColor: "#333333",
  },
  {
    orbit: 3,
    angle: 320,
    icon: Brain,
    label: "AI & ML",
    color: "#b57cff",
    coldColor: "#2a2a2a",
  },
  {
    orbit: 4,
    angle: 175,
    icon: Server,
    label: "BACKEND",
    color: "#ff8b33",
    coldColor: "#333333",
  },
  {
    orbit: 4,
    angle: 10,
    icon: Database,
    label: "DATABASES",
    color: "#2f8fff",
    coldColor: "#252525",
  },
  {
    orbit: 1,
    angle: 110,
    icon: Monitor,
    label: "FRONTEND",
    color: "#ffe36c",
    coldColor: "#2e2e2e",
  },
  {
    orbit: 2,
    angle: 60,
    icon: Settings,
    label: "DEVOPS & TOOLS",
    color: "#66ff99",
    coldColor: "#282828",
  },
];

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 0.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.1,
  }));
}

/* ─── Animated Skill Node (with hover interactions) ─── */
function AnimatedSkillNode({
  n,
  index,
  planeTilt,
  powered,
}: {
  n: (typeof nodes)[0];
  index: number;
  planeTilt: number;
  powered: boolean;
}) {
  const orbit = orbits[n.orbit];
  const time = useTime();
  const prefersReduced = useReducedMotion();

  // Calculate dynamic angle: base angle + rotation over time.
  const angle = useTransform(time, (t) =>
    prefersReduced ? n.angle : n.angle + (t / orbit.speed) * 360
  );

  // Convert polar coordinates to Cartesian
  const left = useTransform(
    angle,
    (a) => `${50 + orbit.rx * Math.cos((a * Math.PI) / 180)}%`
  );
  const top = useTransform(
    angle,
    (a) => `${50 + orbit.ry * Math.sin((a * Math.PI) / 180)}%`
  );

  const Icon = n.icon;
  const activeColor = powered ? n.color : n.coldColor;

  return (
    <motion.div
      id={`target-skill-${index}`}
      className="absolute z-10 flex flex-col items-center"
      style={{
        left,
        top,
        transform: `translate(-50%, -50%) rotate(${-planeTilt}deg)`,
      }}
    >
      {/* Node circle — spring-based hover for game feel */}
      <motion.div
        className="grid h-12 w-12 place-items-center rounded-full border bg-background/85 backdrop-blur cursor-pointer sm:h-14 sm:w-14"
        style={{
          borderColor: activeColor,
          boxShadow: powered
            ? `0 0 14px ${n.color}66, inset 0 0 8px ${n.color}33`
            : `0 0 4px ${n.coldColor}33`,
          color: activeColor,
          transition: "border-color 0.8s, color 0.8s",
        }}
        /* Spring physics: stiffness 350, damping 18 for tactile overshoot */
        whileHover={{
          scale: 1.12,
          boxShadow: `0 0 24px ${n.color}88, inset 0 0 12px ${n.color}44`,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
      </motion.div>
      <span
        className="mt-2 whitespace-nowrap font-mono text-[8px] tracking-[0.2em] sm:text-[9px]"
        style={{
          color: powered ? "rgba(240,236,230,0.8)" : "rgba(240,236,230,0.25)",
          transition: "color 0.8s",
        }}
      >
        {n.label}
      </span>
    </motion.div>
  );
}

/* ─── Animated SVG Particle ─── */
function AnimatedParticle({
  orbit,
  startAngle,
  powered,
}: {
  orbit: (typeof orbits)[0];
  startAngle: number;
  powered: boolean;
}) {
  const time = useTime();
  const angle = useTransform(
    time,
    (t) => startAngle + (t / orbit.speed) * 360
  );
  const cx = useTransform(
    angle,
    (a) => 50 + orbit.rx * Math.cos((a * Math.PI) / 180)
  );
  const cy = useTransform(
    angle,
    (a) => 50 + orbit.ry * Math.sin((a * Math.PI) / 180)
  );

  return (
    <motion.ellipse
      cx={cx}
      cy={cy}
      rx={0.2}
      ry={0.2}
      fill={powered ? "#fff" : "#333"}
      opacity={powered ? 0.7 : 0.15}
      filter={powered ? "url(#ringGlow)" : undefined}
      style={{ transition: "fill 0.8s, opacity 0.8s" }}
    />
  );
}

/* ════════════════════════════════════════════════════════
   SOLAR SKILLS — GAME STAR MAP
   ════════════════════════════════════════════════════════ */

export function SolarSkills({ powered = true }: { powered?: boolean }) {
  const stars = useMemo(() => generateStars(120), []);
  const planeTilt = -6; // degrees

  return (
    <div className="relative mx-auto w-full max-w-[800px] aspect-[1.8/1] sm:aspect-[2.2/1]">
      {/* ─── HUD Chrome: Corner Brackets ─── */}
      <div
        className="hud-bracket hud-bracket--tl"
        style={{
          opacity: powered ? 1 : 0,
          transition: "opacity 0.6s",
        }}
      />
      <div
        className="hud-bracket hud-bracket--br"
        style={{
          opacity: powered ? 1 : 0,
          transition: "opacity 0.6s 0.1s",
        }}
      />

      {/* ─── HUD Chrome: Star Map Label ─── */}
      <motion.div
        className="absolute -top-6 left-0 z-20 font-mono text-[8px] uppercase tracking-[0.3em]"
        style={{
          color: powered ? "rgba(255,42,0,0.5)" : "rgba(255,42,0,0)",
          textShadow: powered ? "0 0 8px rgba(255,42,0,0.2)" : "none",
          transition: "color 0.8s 0.3s, text-shadow 0.8s 0.3s",
        }}
      >
        STAR MAP // {powered ? "ONLINE" : "OFFLINE"}
      </motion.div>

      {/* ─── HUD Chrome: Faint Grid Lines ─── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{
          opacity: powered ? 0.06 : 0,
          transition: "opacity 1s",
        }}
      >
        {/* Horizontal grid lines */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#ff2a00"
            strokeWidth="0.15"
          />
        ))}
        {/* Vertical grid lines */}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="100"
            stroke="#ff2a00"
            strokeWidth="0.15"
          />
        ))}
      </svg>

      {/* ─── Deep Space Background (Nebula glow) ─── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-[100px]"
        style={{
          background: powered
            ? "radial-gradient(ellipse at center, rgba(255,42,0,0.15) 0%, transparent 60%)"
            : "radial-gradient(ellipse at center, rgba(255,42,0,0.03) 0%, transparent 60%)",
          transition: "background 1s",
        }}
      />

      {/* ─── Star Field ─── */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.left}%`,
            top: `${s.top}%`,
            background: "#fff",
            opacity: powered ? s.opacity : s.opacity * 0.2,
            boxShadow:
              s.size > 1.5 ? "0 0 4px rgba(255,255,255,0.8)" : "none",
            transition: "opacity 1s",
          }}
        />
      ))}

      {/* ─── Orbital Plane (Tilted) ─── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${planeTilt}deg)`,
          transformOrigin: "center",
        }}
      >
        {/* SVG for Orbits */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden
        >
          <defs>
            <radialGradient id="solarCoreGlow" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={
                  powered ? "rgba(255,42,0,0.6)" : "rgba(255,42,0,0.1)"
                }
              />
              <stop
                offset="30%"
                stopColor={
                  powered ? "rgba(255,42,0,0.15)" : "rgba(255,42,0,0.03)"
                }
              />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="0.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central ambient glow */}
          <circle cx="50" cy="50" r="20" fill="url(#solarCoreGlow)" />

          {/* Orbit rings */}
          {orbits.map((o, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke={powered ? "#ff4d00" : "#222"}
              strokeOpacity={powered ? 0.15 + i * 0.05 : 0.08}
              strokeWidth="0.15"
              strokeDasharray={i % 2 === 1 ? "1.5 2" : "none"}
              filter={powered ? "url(#ringGlow)" : undefined}
              style={{ transition: "stroke 0.8s, stroke-opacity 0.8s" }}
            />
          ))}

          {/* Small orbital particles */}
          {orbits.map((o, oi) =>
            Array.from({ length: 8 }, (_, pi) => {
              const particleAngle = (360 / 8) * pi + oi * 25;
              return (
                <AnimatedParticle
                  key={`p-${oi}-${pi}`}
                  orbit={o}
                  startAngle={particleAngle}
                  powered={powered}
                />
              );
            })
          )}
        </svg>

        {/* ─── Center Core (AI Engineering) ─── */}
        <div
          id="target-solar-core"
          className="absolute z-10"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${-planeTilt}deg)`,
          }}
        >
          <motion.div
            className="grid h-24 w-24 place-items-center rounded-full border sm:h-32 sm:w-32"
            style={{
              borderColor: powered
                ? "var(--primary)"
                : "rgba(50,50,50,0.5)",
              background: powered
                ? "radial-gradient(circle at center, rgba(255,42,0,0.4), rgba(10,10,10,0.95))"
                : "radial-gradient(circle at center, rgba(50,50,50,0.2), rgba(10,10,10,0.95))",
              boxShadow: powered
                ? "0 0 20px rgba(255,77,0,0.7), 0 0 45px rgba(255,77,0,0.4), inset 0 0 20px rgba(255,255,255,0.2)"
                : "0 0 5px rgba(50,50,50,0.2)",
              transition:
                "border-color 0.8s, background 0.8s",
            }}
            /* Pulse animation only when powered */
            animate={
              powered
                ? {
                    boxShadow: [
                      "0 0 25px rgba(255,42,0,0.5), 0 0 60px rgba(255,42,0,0.25)",
                      "0 0 50px rgba(255,42,0,0.8), 0 0 100px rgba(255,42,0,0.4)",
                      "0 0 25px rgba(255,42,0,0.5), 0 0 60px rgba(255,42,0,0.25)",
                    ],
                  }
                : {}
            }
            transition={
              powered
                ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.8 }
            }
          >
            <div className="text-center">
              <div
                className="font-display text-3xl leading-none sm:text-4xl"
                style={{
                  color: powered ? "#eae6df" : "#444",
                  transition: "color 0.8s",
                }}
              >
                AI
              </div>
              <div
                className="mt-1 font-mono text-[7px] tracking-[0.22em] sm:text-[9px]"
                style={{
                  color: powered
                    ? "var(--primary)"
                    : "rgba(100,100,100,0.5)",
                  transition: "color 0.8s",
                }}
              >
                ENGINEERING
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Animated Skill Nodes ─── */}
        {nodes.map((n, i) => (
          <AnimatedSkillNode
            key={n.label}
            n={n}
            index={i}
            planeTilt={planeTilt}
            powered={powered}
          />
        ))}
      </div>
    </div>
  );
}
