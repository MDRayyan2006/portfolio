import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Code2, Brain, Database, Server, Monitor, Settings, Award } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/skills-detail")({
  head: () => ({
    meta: [
      { title: "Skills Universe — Rayyan Mohammed" },
      { name: "description", content: "Detailed technology breakdown, proficiency levels, and tech stack categories." },
    ],
  }),
  component: SkillsDetailPage,
});

const categories = [
  {
    icon: Code2,
    name: "Languages",
    color: "#ff9d2d",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "C++", level: 70 },
      { name: "SQL", level: 75 },
    ],
  },
  {
    icon: Brain,
    name: "AI & Machine Learning",
    color: "#b57cff",
    skills: [
      { name: "LangChain", level: 92 },
      { name: "LangGraph", level: 88 },
      { name: "RAG Systems", level: 95 },
      { name: "FAISS / Vector DBs", level: 85 },
      { name: "Prompt Engineering", level: 90 },
      { name: "Groq / OpenAI API", level: 88 },
    ],
  },
  {
    icon: Server,
    name: "Backend",
    color: "#ff8b33",
    skills: [
      { name: "FastAPI", level: 88 },
      { name: "Flask", level: 80 },
      { name: "Node.js", level: 75 },
      { name: "REST APIs", level: 90 },
      { name: "WebSockets", level: 78 },
    ],
  },
  {
    icon: Monitor,
    name: "Frontend",
    color: "#ffe36c",
    skills: [
      { name: "React", level: 85 },
      { name: "Next.js", level: 75 },
      { name: "TailwindCSS", level: 90 },
      { name: "Framer Motion", level: 78 },
      { name: "HTML/CSS", level: 92 },
    ],
  },
  {
    icon: Database,
    name: "Databases",
    color: "#2f8fff",
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "PostgreSQL", level: 72 },
      { name: "FAISS", level: 80 },
      { name: "ChromaDB", level: 78 },
      { name: "Redis", level: 65 },
    ],
  },
  {
    icon: Settings,
    name: "DevOps & Tools",
    color: "#66ff99",
    skills: [
      { name: "Docker", level: 78 },
      { name: "Git & GitHub", level: 90 },
      { name: "VS Code", level: 95 },
      { name: "Linux", level: 75 },
      { name: "CI/CD", level: 68 },
    ],
  },
];

function SkillsDetailPage() {
  return (
    <SiteShell>
      <section className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <div className="mx-auto max-w-[1200px]">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-cyber w-fit">Skills Universe</span>
            <h1 className="mt-4 font-display text-6xl leading-[0.85] tracking-tight lg:text-7xl">
              <span className="title-stone block">Technology</span>
              <span className="title-blood block">Arsenal</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              A comprehensive breakdown of the technologies, frameworks, and tools I use to build intelligent systems and full-stack applications.
            </p>
          </motion.div>

          {/* Skills grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, ci) => {
              const Icon = cat.icon;
              return (
                <ScrollReveal key={cat.name} delay={ci * 0.08}>
                  <div className="glass-card rounded-xl p-5 h-full transition-all duration-300 hover:border-opacity-60" style={{ borderColor: `${cat.color}22` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-lg border"
                        style={{
                          borderColor: `${cat.color}55`,
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                          boxShadow: `0 0 12px ${cat.color}33`,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg" style={{ color: cat.color }}>{cat.name}</h3>
                    </div>

                    <div className="space-y-3">
                      {cat.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground/80">{skill.name}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`,
                                boxShadow: `0 0 8px ${cat.color}55`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Certifications placeholder */}
          <ScrollReveal className="mt-12">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl text-bone">Continuous Learning</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                I believe in learning by building. Every project in my portfolio represents hands-on experience
                with cutting-edge technologies. From hackathon prototypes to production-ready AI systems,
                each challenge sharpens my skills and expands my toolkit.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
