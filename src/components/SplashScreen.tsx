import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";

/* ── Orbital ring SVG — a dashed arc that spins ── */
function OrbitalRing({
  radius,
  stroke,
  dash,
  duration,
  reverse,
  delay = 0,
  opacity = 0.3,
}: {
  radius: number;
  stroke: number;
  dash: string;
  duration: number;
  reverse?: boolean;
  delay?: number;
  opacity?: number;
}) {
  const size = radius * 2 + stroke * 2;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity, rotate: reverse ? -360 : 360 }}
      transition={{
        opacity: { duration: 0.8, delay },
        rotate: { duration, repeat: Infinity, ease: "linear" },
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,42,0,0.5)"
        strokeWidth={stroke}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ── Tick marks around a circle ── */
function TickRing({ radius, count, length }: { radius: number; count: number; length: number }) {
  const ticks = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const isMajor = i % (count / 4) === 0;
    return (
      <line
        key={i}
        x1={200}
        y1={200 - radius}
        x2={200}
        y2={200 - radius + (isMajor ? length * 1.8 : length)}
        stroke={isMajor ? "rgba(255,42,0,0.6)" : "rgba(255,255,255,0.12)"}
        strokeWidth={isMajor ? 1.5 : 0.5}
        transform={`rotate(${angle} 200 200)`}
      />
    );
  });
  return (
    <motion.svg
      width={400}
      height={400}
      viewBox="0 0 400 400"
      className="absolute"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {ticks}
    </motion.svg>
  );
}

/* ── Scanning sweep arc ── */
function ScanSweep({ radius }: { radius: number }) {
  const size = radius * 2 + 20;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 0.8, rotate: 360 }}
      transition={{
        opacity: { duration: 0.5, delay: 0.5 },
        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
      }}
    >
      <defs>
        <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,42,0,0)" />
          <stop offset="100%" stopColor="rgba(255,42,0,0.7)" />
        </linearGradient>
      </defs>
      <path
        d={describeArc(size / 2, size / 2, radius, 0, 60)}
        fill="none"
        stroke="url(#sweepGrad)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ── Nodes on orbit ── */
function OrbitNodes({ radius, count }: { radius: number; count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              x: x - 3,
              y: y - 3,
              background: "rgba(255,42,0,0.7)",
              boxShadow: "0 0 6px rgba(255,42,0,0.5)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.4], scale: [0, 1, 1] }}
            transition={{
              duration: 1.5,
              delay: 0.4 + i * 0.15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </>
  );
}

/* ── Data readout labels ── */
function DataReadout({
  progress,
  phase,
}: {
  progress: number;
  phase: string;
}) {
  const labels = [
    { text: "SYS.INIT", x: -160, y: -120, align: "left" as const },
    { text: `PWR: ${Math.min(progress, 99)}%`, x: 110, y: -120, align: "right" as const },
    { text: "STATUS: ACTIVE", x: -160, y: 120, align: "left" as const },
    { text: phase === "loading" ? "LOADING..." : "READY", x: 110, y: 120, align: "right" as const },
  ];
  return (
    <>
      {labels.map((l, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[8px] uppercase tracking-[0.25em]"
          style={{
            top: "50%",
            left: "50%",
            x: l.x,
            y: l.y,
            color: "rgba(255,42,0,0.45)",
            textAlign: l.align,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
        >
          {l.text}
        </motion.span>
      ))}
    </>
  );
}

/* ── Crosshair lines ── */
function Crosshairs() {
  return (
    <motion.svg
      width={400}
      height={400}
      viewBox="0 0 400 400"
      className="absolute"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      {/* Horizontal */}
      <line x1={60} y1={200} x2={140} y2={200} stroke="rgba(255,42,0,0.5)" strokeWidth={0.5} />
      <line x1={260} y1={200} x2={340} y2={200} stroke="rgba(255,42,0,0.5)" strokeWidth={0.5} />
      {/* Vertical */}
      <line x1={200} y1={60} x2={200} y2={140} stroke="rgba(255,42,0,0.5)" strokeWidth={0.5} />
      <line x1={200} y1={260} x2={200} y2={340} stroke="rgba(255,42,0,0.5)" strokeWidth={0.5} />
      {/* Corner brackets */}
      {[
        [140, 140],
        [260, 140],
        [140, 260],
        [260, 260],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <line
            x1={cx + (cx < 200 ? -8 : 8)}
            y1={cy}
            x2={cx}
            y2={cy}
            stroke="rgba(255,42,0,0.4)"
            strokeWidth={1}
          />
          <line
            x1={cx}
            y1={cy + (cy < 200 ? -8 : 8)}
            x2={cx}
            y2={cy}
            stroke="rgba(255,42,0,0.4)"
            strokeWidth={1}
          />
        </g>
      ))}
    </motion.svg>
  );
}

/* ── Helper: SVG arc path ── */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ════════════════════════════════════════════════════
   MAIN SPLASH SCREEN
   ════════════════════════════════════════════════════ */

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");

  const startExit = useCallback(() => {
    setPhase("exit");
    setTimeout(() => onComplete(), 900);
  }, [onComplete]);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(startExit, 400);
      }
    };
    requestAnimationFrame(tick);
  }, [startExit]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0, scale: 1.08 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "#030303" }}
      >
        {/* Deep ambient glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,42,0,0.08) 0%, rgba(255,42,0,0.02) 40%, transparent 65%)",
          }}
        />

        {/* ── Engineering HUD layers ── */}
        <div className="relative" style={{ width: 400, height: 400 }}>
          {/* Tick marks */}
          <TickRing radius={170} count={72} length={6} />

          {/* Outer dashed orbit — slow */}
          <OrbitalRing
            radius={165}
            stroke={1}
            dash="4 12"
            duration={25}
            delay={0.2}
            opacity={0.2}
          />

          {/* Middle segmented ring — medium speed, reverse */}
          <OrbitalRing
            radius={135}
            stroke={1.5}
            dash="30 15 8 15"
            duration={12}
            reverse
            delay={0.4}
            opacity={0.35}
          />

          {/* Inner arc — fast */}
          <OrbitalRing
            radius={105}
            stroke={1}
            dash="60 200"
            duration={6}
            delay={0.1}
            opacity={0.4}
          />

          {/* Scanning sweep */}
          <ScanSweep radius={150} />

          {/* Crosshair lines + corner brackets */}
          <Crosshairs />

          {/* Orbit nodes */}
          <OrbitNodes radius={135} count={6} />

          {/* ── Progress ring (SVG arc that fills) ── */}
          <svg
            width={280}
            height={280}
            viewBox="0 0 280 280"
            className="absolute"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {/* Track */}
            <circle
              cx={140}
              cy={140}
              r={120}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={2}
            />
            {/* Fill */}
            <motion.circle
              cx={140}
              cy={140}
              r={120}
              fill="none"
              stroke="rgba(255,42,0,0.7)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              style={{
                filter: "drop-shadow(0 0 4px rgba(255,42,0,0.5))",
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </svg>

          {/* ── Center: Logo ── */}
          <motion.div
            className="absolute flex flex-col items-center justify-center"
            style={{ inset: 0 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
          >
            <img
              src={logoImg}
              alt="RM Logo"
              className="h-20 w-20 object-contain drop-shadow-[0_0_30px_rgba(255,42,0,0.5)] sm:h-24 sm:w-24"
            />
            {/* Percentage */}
            <span
              className="mt-3 font-mono text-lg tracking-[0.15em]"
              style={{
                color: "rgba(255,42,0,0.8)",
                textShadow: "0 0 12px rgba(255,42,0,0.3)",
              }}
            >
              {progress}
              <span className="text-xs text-foreground/30">%</span>
            </span>
          </motion.div>

          {/* Data readouts at corners */}
          <DataReadout progress={progress} phase={phase} />
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="absolute bottom-12 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/30">
            Initializing Systems
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-primary/60"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
