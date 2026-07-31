import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PlusIcon } from "@/components/PlusIcon";
import { projects, timeline } from "@/lib/site-data";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Journey — Rayyan Mohammed" },
      { name: "description", content: "Projects, hackathons, and milestones — multi-agent RAG systems, MCP servers, real-time chat, and more." },
      { property: "og:title", content: "Projects & Journey — Rayyan Mohammed" },
      { property: "og:description", content: "Selected projects and milestones from Rayyan Mohammed." },
    ],
  }),
  component: ProjectsPage,
});

/* ════════════════════════════════════════════════════════
   PROJECT ROW — editorial case-study block
   Alternates image/text sides; image gets a subtle scroll parallax.
   ════════════════════════════════════════════════════════ */

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const rowRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={rowRef}
      className="group relative border-t border-border/40 py-14 lg:py-20"
    >
      <div
        className={`mx-auto flex max-w-[1400px] flex-col gap-8 lg:items-center lg:gap-16 ${
          flipped ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* ── Visual ── */}
        <motion.div
          className="relative w-full lg:w-[54%]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-background">
            <motion.img
              src={project.img}
              alt={`${project.name} — ${project.tagline}`}
              loading="lazy"
              style={prefersReduced ? {} : { y: imgY, scale: imgScale }}
              className="h-[112%] w-full object-cover"
            />
            {/* Cinematic tint that lifts on hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-40" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ring-1 ring-inset ring-primary/40" />

            <PlusIcon
              to={`/project/${project.slug}`}
              label={project.name}
              sublabel="Full Details"
              className="right-3 top-3"
              size="sm"
            />
          </div>
        </motion.div>

        {/* ── Copy ── */}
        <div className="w-full lg:w-[46%]">
          <div className="flex items-start gap-5">
            <span className="editorial-index editorial-index--hot text-[clamp(3.5rem,7vw,6rem)]">
              {number}
            </span>
            <div className="pt-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                {project.tagline}
              </span>
              <h3 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.92] tracking-tight title-stone">
                {project.name}
              </h3>
            </div>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {/* Stack */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary/80"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/project/$slug"
              params={{ slug: project.slug }}
              data-magnetic
              className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(255,42,0,0.55)]"
            >
              Case Study <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="inline-flex items-center gap-2 border border-border bg-card/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80 transition-all hover:border-primary/60 hover:text-primary"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary transition-all hover:bg-primary/20"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Demo
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectsPage() {
  return (
    <SiteShell>
      {/* ── Section intro ── */}
      <section id="projects" className="relative px-6 pt-20 pb-4 md:pl-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <ScrollReveal className="max-w-3xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Selected Work
            </span>
            <h2 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.86] tracking-tight">
              <span className="title-stone block">Things I&apos;ve</span>
              <span className="title-blood block">Built</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
              Turning ideas into intelligent and impactful solutions — from
              multi-agent retrieval pipelines to real-time systems.
            </p>
            <div className="mt-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
              <span>{String(projects.length).padStart(2, "0")} Projects</span>
              <span className="h-px w-16 bg-border" />
              <span>Scroll to explore</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Editorial project rows ── */}
      <section className="relative px-6 pb-20 md:pl-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          {projects.map((p, idx) => (
            <ProjectRow key={p.slug} project={p} index={idx} />
          ))}
        </div>
      </section>

      <div className="scratch-divider mx-auto max-w-[90%]" />

      {/* ═══════════════════════════════════════════════════════════
         TIMELINE
         ═══════════════════════════════════════════════════════════ */}
      <section id="journey" className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <ScrollReveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Journey So Far</span>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight">
              <span className="title-stone block">Milestones That</span>
              <span className="title-stone block">Fuel My Drive</span>
            </h2>
            <button className="mt-8 inline-flex w-fit items-center gap-2 border border-border bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_16px_rgba(255,42,0,0.12)]">
              View Full Timeline <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </ScrollReveal>

          {/* Premium vertical timeline */}
          <ol className="relative pl-8">
            {/* Animated glow line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />

            {timeline.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <li className="relative mb-10 last:mb-0 group">
                  {/* Glow marker */}
                  <span className="absolute -left-[21px] top-1.5 grid h-4 w-4 place-items-center">
                    <span className="absolute h-4 w-4 rounded-full bg-primary/20 timeline-marker" />
                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,42,0,0.8),0_0_24px_rgba(255,42,0,0.4)]" />
                  </span>

                  <div className="glass-card rounded-lg p-4 ml-2 transition-all duration-300 group-hover:border-primary/40">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{t.year}</div>
                    <div className="mt-1 font-display text-lg text-bone">{t.title}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>

        <div className="mt-10 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary transition-all hover:glow-text-red">
            Next: Hobbies & Contact <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
