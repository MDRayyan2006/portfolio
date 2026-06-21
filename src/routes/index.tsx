/**
 * Home Page — HUD Boot Sequence & Scroll-Driven Level System
 *
 * The hero section features a "INITIALIZE SYSTEM" button that triggers
 * a terminal-style boot overlay, then smooth-scrolls into the content.
 *
 * Each section is a scroll-driven "level" wrapped in HudLevelWrapper:
 * - LVL 01 // ABOUT — scroll-linked entrance with HUD brackets
 * - LVL 02 // SKILLS — star map powers up on scroll, dots fill sequentially
 *
 * Animation philosophy (per SKILL.md §7):
 * - Duration 150–300ms for micro-interactions
 * - Spring physics for natural overshoot (HUD power-on feel)
 * - exit-faster-than-enter for responsiveness
 * - GPU-only: transform + opacity exclusively
 * - prefers-reduced-motion: simple opacity fades, no parallax
 */

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Plus } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { SolarSkills } from "@/components/SolarSkills";
import { HudBootSequence } from "@/components/HudBootSequence";
import { HudLevelWrapper } from "@/components/HudLevelWrapper";
import { GameCharacter } from "@/components/GameCharacter";
import { popularSkills } from "@/lib/site-data";
import heroImg from "@/assets/hero-portrait.png";
import aboutImg from "@/assets/about-scene.png";
import splashRed from "@/assets/splash-red.png";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rayyan Mohammed — AI Engineer & Builder" },
      {
        name: "description",
        content:
          "AI Engineer, Developer, Problem Solver. Building multi-agent pipelines, RAG systems and full-stack products.",
      },
      {
        property: "og:title",
        content: "Rayyan Mohammed — AI Engineer & Builder",
      },
      {
        property: "og:description",
        content:
          "Portfolio of Rayyan Mohammed — AI systems and full-stack engineering.",
      },
    ],
  }),
  component: Home,
});

/* ── Reusable animation variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

/* ════════════════════════════════════════════════════════
   HOME
   ════════════════════════════════════════════════════════ */

function Home() {
  const [characterVisible, setCharacterVisible] = useState(false);

  return (
    <SiteShell>
      <Hero onBootComplete={() => setCharacterVisible(true)} />
      <About />
      <Skills />
      {/* Game character appears after boot sequence */}
      <GameCharacter visible={characterVisible} />
    </SiteShell>
  );
}

/* ════════════════════════════════════════════════════════
   HERO — Splash background + boot sequence trigger
   ════════════════════════════════════════════════════════ */

function Hero({ onBootComplete }: { onBootComplete?: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Parallax transforms — disabled for reduced motion */
  const splashY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const splashOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <section
        id="home"
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 4rem)", background: "#080808" }}
      >
        {/* ── Layer 0: Splash Red background (parallax) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={
            prefersReduced
              ? {}
              : { y: splashY, opacity: splashOpacity }
          }
        >
          <img
            src={splashRed}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-right-bottom"
            style={{ mixBlendMode: "screen", opacity: 0.85 }}
          />
          {/* Glow amplifier */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 85% 55%, rgba(255,42,0,0.18) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* ── Layer 1: Portrait (parallax) ── */}
        <motion.img
          src={heroImg}
          alt="Rayyan Mohammed portrait"
          width={1500}
          height={1024}
          style={prefersReduced ? {} : { y: portraitY }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_100%] md:object-contain md:object-right-bottom translate-y-12 md:translate-y-0"
        />

        {/* ── Layer 2: Gradient overlay for text readability ── */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080808]/40 to-transparent md:hidden" />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.88) 22%, rgba(8,8,8,0.6) 40%, rgba(8,8,8,0.15) 55%, transparent 70%)",
          }}
        />

        {/* ── Layer 3: Top/bottom vignette ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, transparent 12%, transparent 92%, rgba(8,8,8,0.4) 100%)",
          }}
        />

        {/* ── Text content — staggered entrance ── */}
        <motion.div
          className="relative z-10 mx-auto max-w-[1400px] px-6 pt-20 pb-10 md:pt-10 md:pl-20 lg:px-10 lg:py-16 flex h-full flex-col justify-start md:justify-center"
          style={prefersReduced ? {} : { y: textY }}
        >
          <motion.div
            className="flex flex-col justify-center lg:max-w-[48%]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex w-fit items-center gap-2 border border-primary/60 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ring" />{" "}
              Hi, I'm
            </motion.span>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-3 font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.85] tracking-tight"
            >
              <motion.span
                className="block title-stone"
                variants={slideLeft}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                RAYYAN
              </motion.span>
              <motion.span
                className="block title-blood"
                variants={slideLeft}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08,
                }}
              >
                MOHAMMED
              </motion.span>
            </motion.h1>

            {/* Role tags */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70"
            >
              <span>AI Engineer</span>
              <span className="text-foreground/25 text-[8px]">●</span>
              <span>Developer</span>
              <span className="text-foreground/25 text-[8px]">●</span>
              <span>Problem Solver</span>
              <span className="text-foreground/25 text-[8px]">●</span>
              <span>Builder</span>
            </motion.div>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="mt-1.5 h-px w-48 bg-gradient-to-r from-primary to-transparent"
            />

            {/* Description */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground"
            >
              Computer Science undergraduate passionate about building AI
              systems, multi-agent pipelines, and full-stack products that
              solve real-world problems.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-5 flex flex-wrap gap-3"
            >
              <a
                href="#about"
                className="group inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground shadow-[0_0_25px_oklch(0.6_0.25_25/0.5)] transition-all hover:shadow-[0_0_38px_oklch(0.6_0.25_25/0.75)]"
              >
                Explore My Journey
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 border border-border bg-card/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground hover:border-primary/60 hover:text-primary"
              >
                Download Resume <Download className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-2 flex flex-wrap gap-3"
            >
              <a
                href="https://github.com/MDRayyan2006"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-card/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground hover:border-primary/60 hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/rayyan-mohammed55"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-card/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground hover:border-primary/60 hover:text-primary"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── HUD Boot Sequence (replaces Play button) ── */}
        <HudBootSequence onBootComplete={onBootComplete} />
      </section>
      <div className="scratch-divider mx-auto max-w-[90%]" />
    </>
  );
}

/* ════════════════════════════════════════════════════════
   ABOUT — LVL 01
   ════════════════════════════════════════════════════════ */

const hotspots = [
  { title: "Dream Big", sub: "My Mission", x: 27, y: 10, href: "/story" },
  { title: "Deku Figure", sub: "My Motivation", x: 8, y: 65, href: "/interests/anime" },
  { title: "Coffee Mug", sub: "Late Night Builder", x: 27, y: 80, href: "/interests/coffee" },
  { title: "Laptop", sub: "Tech Stack", x: 20, y: 60, href: "/skills-detail" },
  { title: "Luffy Poster", sub: "My Anime Side", x: 85, y: 24, href: "/interests/anime" },
  { title: "Bleach Manga", sub: "Storytelling", x: 76, y: 70, href: "/interests/anime" },
  { title: "Moon Lamp", sub: "Facts", x: 90, y: 80, href: "/profile" },
];

function Hotspot({ h, prefersReduced, hotspotScale, hotspotOpacity }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="absolute z-10"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        left: `${h.x}%`,
        top: `${h.y}%`,
        transform: "translate(-50%, -50%)",
        ...(prefersReduced
          ? {}
          : {
              scale: hotspotScale,
              opacity: hotspotOpacity,
            }),
      }}
    >
      <button
        aria-label={h.title}
        onClick={() => setIsOpen(!isOpen)}
        className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_14px_oklch(0.6_0.25_25/0.75)] ring-2 ring-background transition-transform hover:scale-110 focus:outline-none"
        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
      >
        <Plus className="h-4 w-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -5, x: "-50%" }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 mt-2 whitespace-nowrap rounded-md border border-border bg-background/95 px-3 py-1.5 text-center backdrop-blur shadow-xl hover:border-primary/50 transition-colors"
          >
            <Link to={h.href} className="flex flex-col items-center group/link">
              <div className="font-display text-xs text-bone group-hover/link:text-primary transition-colors">
                {h.title}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1 group-hover/link:text-primary/80 transition-colors mt-0.5">
                {h.sub} <ArrowUpRight className="h-2.5 w-2.5" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imgScroll } = useScroll({
    target: imgRef,
    offset: ["start end", "center center"],
  });

  /* Scroll-linked image entrance (slide from right, tied to scroll) */
  const imgX = useTransform(imgScroll, [0, 1], [60, 0]);
  const imgOpacity = useTransform(imgScroll, [0, 0.6], [0, 1]);

  /* Hotspot reveal — mapped to scroll so they "pop" as image fully enters */
  const hotspotScale = useTransform(imgScroll, [0.5, 0.8], [0, 1]);
  const hotspotOpacity = useTransform(imgScroll, [0.5, 0.8], [0, 1]);

  const prefersReduced = useReducedMotion();

  return (
    <HudLevelWrapper levelNumber={1} levelName="ABOUT">
      <section
        id="about"
        className="relative px-6 py-20 md:pl-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.6fr]">
          {/* Left text column — staggered entrance via parent HudLevelWrapper */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              About Me
            </span>

            <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight lg:text-6xl">
              <span className="title-stone block">More Than Code.</span>
              <span className="title-blood block">It's A Mindset.</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              I'm a builder, a learner, and a dreamer. From anime marathons
              to AI agents, everything I love fuels my creativity and keeps
              me going.
            </p>

            <a
              id="target-explore-world"
              href="/projects"
              className="mt-7 inline-flex w-fit items-center gap-2 border border-border bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:border-primary/60 hover:text-primary"
            >
              Explore My World{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Right image column — scroll-linked slide from right */}
          <motion.div
            ref={imgRef}
            className="relative overflow-hidden rounded-xl border border-border bg-card/60 shadow-[0_0_60px_oklch(0.5_0.22_25/0.15)]"
            style={
              prefersReduced
                ? {}
                : { x: imgX, opacity: imgOpacity }
            }
          >
            <img
              src={aboutImg}
              alt="Rayyan's creative world"
              loading="lazy"
              className="w-full h-auto object-cover rounded-xl block"
            />
            {hotspots.map((h, i) => (
              <Hotspot
                key={h.title}
                h={h}
                prefersReduced={prefersReduced}
                hotspotScale={hotspotScale}
                hotspotOpacity={hotspotOpacity}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </HudLevelWrapper>
  );
}

/* ════════════════════════════════════════════════════════
   SKILLS — LVL 02 (Star Map powers up on scroll)
   ════════════════════════════════════════════════════════ */

function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  /* Star map powers on when section is ~40% into viewport */
  const powerProgress = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  /* Popular skills list — staggered scroll-linked entrance */
  const listOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const listX = useTransform(scrollYProgress, [0.3, 0.55], [40, 0]);

  return (
    <HudLevelWrapper levelNumber={2} levelName="SKILLS">
      <section
        id="skills"
        ref={sectionRef}
        className="relative px-6 py-20 md:pl-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.4fr_0.9fr]">
          {/* Left: heading */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              My Skills
            </span>

            <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-tight lg:text-5xl">
              <span className="title-stone block">Tools I Use To</span>
              <span className="title-stone block">Build The Future</span>
            </h2>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A blend of cutting-edge AI, solid engineering principles, and
              continuous learning.
            </p>

            <Link
              id="target-explore-skills"
              to="/projects"
              className="mt-7 inline-flex w-fit items-center gap-2 border border-border bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:border-primary/60 hover:text-primary"
            >
              Explore Skills{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Center: Solar skills star map — powered by scroll */}
          <SkillsStarMap powerProgress={powerProgress} />

          {/* Right: popular skills list — scroll-linked entrance */}
          <motion.div
            className="self-center rounded-xl border border-border bg-card/60 p-5"
            style={
              prefersReduced
                ? {}
                : { opacity: listOpacity, x: listX }
            }
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Popular Skills
            </div>
            <ul className="mt-4 space-y-3">
              {popularSkills.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-background/60 font-mono text-[10px] text-primary">
                      {s.name[0]}
                    </span>
                    <span className="text-sm text-foreground/90">
                      {s.name}
                    </span>
                  </div>
                  <SkillDots
                    level={s.level}
                    powerProgress={powerProgress}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right font-mono text-[10px] italic text-muted-foreground">
              and many more…
            </p>
          </motion.div>
        </div>
      </section>
    </HudLevelWrapper>
  );
}

/* ── Star Map with scroll-linked power ── */
function SkillsStarMap({
  powerProgress,
}: {
  powerProgress: MotionValue<number>;
}) {
  const prefersReduced = useReducedMotion();
  const [isPowered, setIsPowered] = useState(!!prefersReduced);

  /* Subscribe to scroll progress and flip powered when > 0.4 */
  useEffect(() => {
    if (prefersReduced) {
      setIsPowered(true);
      return;
    }
    const unsubscribe = powerProgress.on("change", (v) => {
      setIsPowered(v > 0.4);
    });
    return unsubscribe;
  }, [powerProgress, prefersReduced]);

  return <SolarSkills powered={isPowered} />;
}

/* ── Skill dots that "power up" from cold to hot ── */
function SkillDots({
  level,
  powerProgress,
}: {
  level: number;
  powerProgress: MotionValue<number>;
}) {
  const prefersReduced = useReducedMotion();
  const [dotAlpha, setDotAlpha] = useState(prefersReduced ? 1 : 0.15);

  useEffect(() => {
    if (prefersReduced) return;
    const unsub = powerProgress.on("change", (v) => {
      // Map [0.3, 0.7] → [0.15, 1]
      const clamped = Math.min(1, Math.max(0, (v - 0.3) / 0.4));
      setDotAlpha(0.15 + clamped * 0.85);
    });
    return unsub;
  }, [powerProgress, prefersReduced]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 7 }).map((_, j) => {
        const isFilled = j < level;
        return (
          <span
            key={j}
            className="h-1.5 w-1.5 rounded-full"
            style={
              isFilled
                ? {
                  background: "var(--primary)",
                  opacity: dotAlpha,
                  boxShadow: `0 0 6px oklch(0.6 0.25 25 / ${dotAlpha * 0.7})`,
                  transition: "opacity 0.1s, box-shadow 0.1s",
                }
                : { background: "var(--border)" }
            }
          />
        );
      })}
    </div>
  );
}
