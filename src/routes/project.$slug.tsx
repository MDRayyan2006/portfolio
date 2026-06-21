import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Github, ExternalLink, Layers, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { projects } from "@/lib/site-data";

export const Route = createFileRoute("/project/$slug")({
  head: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: `${project?.name ?? "Project"} — Rayyan Mohammed` },
        { name: "description", content: project?.description ?? "Project details" },
      ],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <SiteShell>
        <section className="px-6 py-20 md:pl-20 lg:px-10 text-center">
          <h1 className="font-display text-4xl text-bone">Project Not Found</h1>
          <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-primary font-mono text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <div className="mx-auto max-w-[1100px]">
          <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-cyber w-fit">{project.tagline}</span>
            <h1 className="mt-4 font-display text-6xl leading-[0.85] tracking-tight lg:text-7xl">
              <span className="title-blood block">{project.name}</span>
            </h1>
          </motion.div>

          {/* Project image */}
          <ScrollReveal className="mt-8">
            <div className="relative overflow-hidden rounded-xl neon-border">
              <img
                src={project.img}
                alt={project.name}
                className="w-full h-[350px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </ScrollReveal>

          {/* Action buttons */}
          <ScrollReveal className="mt-6 flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm transition-all hover:border-primary/60 hover:text-primary hover:shadow-[0_0_16px_rgba(255,42,0,0.12)]"
            >
              <Github className="h-4 w-4" /> View Source
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground glow-red transition-all hover:shadow-[0_0_30px_rgba(255,42,0,0.5)]"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          </ScrollReveal>

          {/* Details grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <ScrollReveal>
              <div className="glass-card rounded-xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-lg text-bone">Overview</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="glass-card rounded-xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-lg text-bone">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="glass-card rounded-xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-lg text-bone">Key Challenges</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Designing scalable architecture for real-time data processing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Optimizing performance for production deployment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Building intuitive user interfaces for complex AI workflows
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
