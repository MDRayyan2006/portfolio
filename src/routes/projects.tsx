import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
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

function ProjectsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const offset = clientWidth * 0.8;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - offset : scrollLeft + offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <SiteShell>
      <section id="projects" className="relative px-6 py-20 md:pl-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_2.4fr_auto]">
            {/* ── Left: Header ── */}
            <ScrollReveal className="flex flex-col justify-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Projects</span>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight">
                <span className="title-stone block">Things I've</span>
                <span className="title-stone block">Built</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Turning ideas into intelligent and impactful solutions.
              </p>
              <button className="mt-7 inline-flex w-fit items-center gap-2 border border-border bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_16px_rgba(255,42,0,0.12)]">
                View All Projects <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </ScrollReveal>

            {/* ── Center: Project Cards ── */}
            <div className="overflow-x-auto pb-2 scroll-smooth" ref={scrollContainerRef}>
              <div className="flex gap-4 snap-x">
                {projects.map((p, idx) => (
                  <ScrollReveal key={p.name} delay={idx * 0.1}>
                    <motion.article
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative min-w-[260px] max-w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-lg glass-card p-3"
                    >
                      {/* Animated border glow on hover */}
                      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100 border border-primary/40" />

                      <div className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-background">
                        <img
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <h3 className="mt-3 font-display text-xl text-primary glow-text-red">{p.name}</h3>
                      <p className="text-xs text-foreground/75">{p.tagline}</p>

                      {/* Tech stack badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-foreground/70 transition-all hover:border-primary/50 hover:text-primary"
                        >
                          <Github className="h-3 w-3" /> GitHub
                        </a>
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(255,42,0,0.2)]"
                        >
                          <ExternalLink className="h-3 w-3" /> Demo
                        </a>
                        <div className="ml-auto">
                          <ArrowUpRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all group-hover:opacity-100" />
                        </div>
                      </div>

                      {/* Plus icon */}
                      <PlusIcon
                        to={`/project/${p.slug}`}
                        label={p.name}
                        sublabel="Full Details"
                        className="right-2 top-2"
                        size="sm"
                      />
                    </motion.article>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* ── Right: Pagination ── */}
            <div className="hidden flex-col justify-center gap-2 lg:flex">
              <button onClick={() => scroll("left")} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground/70 backdrop-blur-sm transition-all hover:text-primary hover:border-primary/40 hover:shadow-[0_0_12px_rgba(255,42,0,0.15)]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll("right")} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-primary bg-primary/10 text-primary glow-red transition-all hover:bg-primary/20">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
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
