import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Briefcase, Heart, MapPin, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import heroImg from "@/assets/hero-portrait.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Rayyan Mohammed" },
      { name: "description", content: "Full biography, education, experience, and personal journey of Rayyan Mohammed." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <SiteShell>
      <section className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <div className="mx-auto max-w-[1100px]">
          {/* Back nav */}
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto]"
          >
            <div>
              <span className="badge-cyber w-fit">Full Profile</span>
              <h1 className="mt-4 font-display text-6xl leading-[0.85] tracking-tight lg:text-7xl">
                <span className="title-stone block">Rayyan</span>
                <span className="title-blood block">Mohammed</span>
              </h1>
              <p className="mt-4 text-sm text-muted-foreground max-w-lg leading-relaxed">
                Computer Science undergraduate at Gayatri Vidya Parishad College of Engineering,
                Visakhapatnam. Passionate about AI systems, multi-agent architectures, and
                building full-stack products that create real-world impact.
              </p>
            </div>
            <div className="relative flex items-start justify-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,0,0.25),transparent_65%)] blur-2xl" />
              <img src={heroImg} alt="Rayyan Mohammed" className="w-48 h-48 object-contain rounded-full border-2 border-primary/30 glow-red" />
            </div>
          </motion.div>

          <div className="scratch-divider my-12 max-w-full" />

          {/* Education */}
          <ScrollReveal>
            <div className="glass-card rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl text-bone">Education</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-primary/40 pl-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">2023 — Present</div>
                  <div className="font-display text-lg text-bone mt-1">B.Tech in Computer Science & Engineering</div>
                  <div className="text-sm text-muted-foreground">Gayatri Vidya Parishad College of Engineering, Visakhapatnam</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Experience & Skills Focus */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl text-bone">Experience & Focus</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { area: "AI & Machine Learning", desc: "Building RAG systems, multi-agent pipelines, and LLM-powered applications using LangChain, LangGraph, and vector databases." },
                  { area: "Full-Stack Development", desc: "Creating end-to-end web applications with React, FastAPI, MongoDB, and modern deployment pipelines." },
                  { area: "Competitive Programming", desc: "100+ problems solved on LeetCode across Data Structures, Dynamic Programming, and Graph algorithms." },
                  { area: "Hackathons & Innovation", desc: "Smart India Hackathon and Quantum Valley Hackathon participant — building working prototypes under pressure." },
                ].map((item) => (
                  <div key={item.area} className="rounded-lg border border-border/40 bg-background/40 p-4 transition-all hover:border-primary/30">
                    <div className="font-display text-base text-primary">{item.area}</div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Personal Journey */}
          <ScrollReveal delay={0.2}>
            <div className="glass-card rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl text-bone">Personal Journey</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                My journey into tech began with curiosity — dismantling how things work and rebuilding them better.
                What started with simple scripts evolved into a deep passion for artificial intelligence and its
                potential to transform industries. Today, I channel that same curiosity into building AI agents,
                multi-modal systems, and products that push boundaries. When I'm not coding, you'll find me
                watching anime for inspiration, playing chess for strategic thinking, or fueling late-night builds
                with coffee.
              </p>
            </div>
          </ScrollReveal>

          {/* Location */}
          <ScrollReveal delay={0.3}>
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl text-bone">Based In</h2>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-display text-lg text-bone">Visakhapatnam, India</div>
                  <p className="text-xs text-muted-foreground">Open to remote opportunities worldwide</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
