import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, BookOpen, Gamepad, Coffee, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { hobbies } from "@/lib/site-data";

const interestDetails: Record<string, {
  icon: typeof Trophy;
  description: string;
  highlights: string[];
  quote?: string;
}> = {
  anime: {
    icon: Tv,
    description: "Anime has shaped how I deal with hard things more than people realize.It's not just something I watch,it's where I find motivation when things get tough.Characters like Izuku Midoriya and Monkey D.Luffy taught me that progress isn't about talent.It's about showing up every day,learning from your failures,and not quitting.",
    highlights: [
      "One Piece — The ultimate story of dreams, friendship, and perseverance",
      "My Hero Academia — Proving that anyone can be extraordinary with enough effort",
      "Bleach — The art of storytelling and visual narrative design",
      "Attack on Titan — Strategic thinking and questioning the status quo",
      "Jujutsu Kaisen — Pushing past limits when it matters most",
    ],
    quote: "The only ones who should fight are those who are prepared to be fought. — Luffy",
  },
  badminton: {
    icon: Gamepad,
    description: "Badminton is my arena for physical and mental sharpness. The split-second decision-making, the footwork precision, and the strategic shot placement — it all mirrors what I do in code. Every rally teaches focus, every match builds resilience.",
    highlights: [
      "Training reflexes that translate to faster coding decisions",
      "Learning to read opponents — a skill useful in competitive programming",
      "Building endurance for long coding sessions",
      "Team doubles for collaboration skills",
      "Tournament experience under pressure",
    ],
  },
  chess: {
    icon: Trophy,
    description: "Chess is the ultimate training ground for a developer's mind. Pattern recognition, thinking multiple moves ahead, sacrificing short-term gains for long-term strategy — these are the same skills I use when architecting AI systems and debugging complex pipelines.",
    highlights: [
      "Strategic thinking applied to system architecture decisions",
      "Pattern recognition for algorithm design",
      "Endgame analysis — planning for edge cases in code",
      "Time management under pressure",
      "Learning from losses — debugging mindset",
    ],
    quote: "In chess, as in coding, every move creates possibilities and closes others.",
  },
  coffee: {
    icon: Coffee,
    description: "Coffee is more than caffeine — it's the ritual that marks the start of focused work. The perfect pour-over parallels clean code: precise measurements, consistent methodology, and a result that's both functional and beautiful.",
    highlights: [
      "Late-night build sessions powered by carefully brewed coffee",
      "The ritual of grinding and brewing as a focus trigger",
      "Exploring different origins — like exploring new tech stacks",
      "The community aspect — coffee chats lead to great ideas",
      "Appreciation for craftsmanship in every cup",
    ],
  },
};

export const Route = createFileRoute("/interests/$slug")({
  head: ({ params }) => {
    const hobby = hobbies.find((h) => h.slug === params.slug);
    return {
      meta: [
        { title: `${hobby?.name ?? "Interest"} — Rayyan Mohammed` },
        { name: "description", content: `Rayyan Mohammed's passion for ${hobby?.name ?? "this interest"} and how it shapes his work.` },
      ],
    };
  },
  component: InterestDetailPage,
});

function InterestDetailPage() {
  const { slug } = Route.useParams();
  const hobby = hobbies.find((h) => h.slug === slug);
  const detail = interestDetails[slug];

  if (!hobby || !detail) {
    return (
      <SiteShell>
        <section className="px-6 py-20 md:pl-20 lg:px-10 text-center">
          <h1 className="font-display text-4xl text-bone">Interest Not Found</h1>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-primary font-mono text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Hobbies
          </Link>
        </section>
      </SiteShell>
    );
  }

  const Icon = detail.icon;

  return (
    <SiteShell>
      <section className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <div className="mx-auto max-w-[1100px]">
          <Link to="/contact" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Hobbies
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-cyber w-fit">
              <Icon className="h-3 w-3" /> Beyond Coding
            </span>
            <h1 className="mt-4 font-display text-6xl leading-[0.85] tracking-tight lg:text-7xl">
              <span className="title-blood block">{hobby.name}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{hobby.desc}</p>
          </motion.div>

          {/* Image */}
          <ScrollReveal className="mt-8">
            <div className="relative overflow-hidden rounded-xl neon-border">
              <img
                src={hobby.img}
                alt={hobby.name}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal className="mt-8">
            <div className="glass-card rounded-xl p-6">
              <p className="text-sm text-foreground/85 leading-relaxed">{detail.description}</p>
            </div>
          </ScrollReveal>

          {/* Quote */}
          {detail.quote && (
            <ScrollReveal className="mt-6">
              <div className="glass-card rounded-xl p-6 border-l-2 border-primary">
                <p className="text-sm text-primary italic leading-relaxed">"{detail.quote}"</p>
              </div>
            </ScrollReveal>
          )}

          {/* Highlights */}
          <ScrollReveal className="mt-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-xl text-bone mb-4">Highlights</h3>
              <ul className="space-y-3">
                {detail.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(255,42,0,0.5)]" />
                    {h}
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal className="mt-10 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground glow-red transition-all hover:shadow-[0_0_40px_rgba(255,42,0,0.6)]"
            >
              Get In Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
