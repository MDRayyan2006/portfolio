import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Lightbulb, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import aboutImg from "@/assets/about-scene.png";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "My Story — Rayyan Mohammed" },
      { name: "description", content: "The expanded story behind Rayyan Mohammed — motivations, creative journey, and what drives the code." },
    ],
  }),
  component: StoryPage,
});

const chapters = [
  {
    icon: Lightbulb,
    title: "The Spark",
    text: "It started with a question: 'What if machines could think?' That curiosity led me from tinkering with Python scripts to building multi-agent AI systems that solve real problems. Every line of code is driven by that original spark of wonder.",
  },
  {
    icon: BookOpen,
    title: "The Fuel",
    text: "Anime taught me resilience — characters who never give up inspire my work ethic. Chess sharpens my strategic thinking. Coffee powers the late-night sessions where the best ideas come alive. Everything I consume feeds back into what I create.",
  },
  {
    icon: Rocket,
    title: "The Mission",
    text: "I don't just want to build software. I want to build systems that augment human intelligence. From RAG pipelines that make knowledge accessible, to multi-agent frameworks that automate complex workflows — every project pushes toward that vision.",
  },
  {
    icon: Star,
    title: "The Future",
    text: "The intersection of AI and human creativity is where I see myself. I'm working toward becoming an AI engineer who doesn't just implement solutions, but architects entirely new ways of human-AI collaboration.",
  },
];

function StoryPage() {
  return (
    <SiteShell>
      <section className="relative px-6 py-20 md:pl-20 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-cyber w-fit">My Story</span>
            <h1 className="mt-4 font-display text-6xl leading-[0.85] tracking-tight lg:text-7xl">
              <span className="title-stone block">More Than</span>
              <span className="title-blood block">Just Code</span>
            </h1>
          </motion.div>

          {/* Scene image */}
          <ScrollReveal className="mt-10">
            <div className="relative overflow-hidden rounded-xl neon-border">
              <img src={aboutImg} alt="Creative space" className="w-full h-[350px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-display text-2xl text-bone">Where ideas come to life</p>
                <p className="text-xs text-muted-foreground mt-1">My creative workspace, fueled by anime, coffee, and curiosity</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Story chapters */}
          <div className="mt-12 space-y-6">
            {chapters.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <ScrollReveal key={ch.title} delay={i * 0.1}>
                  <div className="glass-card rounded-xl p-6 transition-all hover:border-primary/40">
                    <div className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-bone">{ch.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ch.text}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* CTA */}
          <ScrollReveal className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground glow-red transition-all hover:shadow-[0_0_40px_rgba(255,42,0,0.6)]"
            >
              See What I've Built <Rocket className="h-3.5 w-3.5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
