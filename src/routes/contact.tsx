import { createFileRoute } from "@tanstack/react-router";
import { Mail, Linkedin, Github, MapPin, ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PlusIcon } from "@/components/PlusIcon";
import { hobbies, contact } from "@/lib/site-data";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Hobbies & Contact — Rayyan Mohammed" },
      { name: "description", content: "Beyond the code — hobbies, interests, and how to reach Rayyan Mohammed for internships and collaborations." },
      { property: "og:title", content: "Hobbies & Contact — Rayyan Mohammed" },
      { property: "og:description", content: "Let's build something great together." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      {/* ═══════════════════════════════════════════════════════════
         HOBBIES — "Beyond the Code"
         ═══════════════════════════════════════════════════════════ */}
      <section id="hobbies" className="relative px-6 py-20 md:pl-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
          <ScrollReveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Hobbies & Interests</span>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight">
              <span className="title-stone block">Beyond</span>
              <span className="title-blood block">The Code</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The things that recharge my mind and inspire my ideas.
            </p>
          </ScrollReveal>

          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {hobbies.map((h, i) => (
                <ScrollReveal key={h.name} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -6, rotateY: 3, rotateX: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative overflow-hidden rounded-lg glass-card cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={h.img}
                        alt={h.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                    </div>
                    <div className="p-3 relative">
                      <div className="font-display text-base text-bone">{h.name}</div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{h.desc}</p>
                    </div>

                    {/* Plus icon for hobby detail */}
                    <PlusIcon
                      to={`/interests/${h.slug}`}
                      label={h.name}
                      sublabel="Learn More"
                      className="right-2 top-2"
                      size="sm"
                    />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
            {/* Pagination dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,0,0.5)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          </div>
        </div>
      </section>

      <div className="scratch-divider mx-auto max-w-[90%]" />

      {/* ═══════════════════════════════════════════════════════════
         CONTACT
         ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative px-6 py-20 md:pl-20 lg:px-10 ambient-red">
        <ScrollReveal>
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 overflow-hidden rounded-xl glass-card p-8 lg:grid-cols-[1.3fr_1fr] lg:p-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Let's Connect</span>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight">
                <span className="title-stone block">Let's Build</span>
                <span className="title-stone block">Something Great</span>
              </h2>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Open to internships, collaborations and exciting opportunities.
              </p>

              {/* Contact rows */}
              <ul className="mt-8 space-y-4">
                <ContactRow Icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                <ContactRow Icon={Linkedin} label="LinkedIn" value={contact.linkedin} href={contact.linkedinUrl} />
                <ContactRow Icon={Github} label="GitHub" value={contact.github} href={contact.githubUrl} />
                <ContactRow Icon={MapPin} label="Location" value={contact.location} />
              </ul>

              {/* CTA button */}
              <motion.a
                href={`mailto:${contact.email}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground glow-red-strong transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,42,0,0.6)]"
              >
                <Send className="h-3.5 w-3.5" />
                Say Hello
              </motion.a>
            </div>

            {/* RM Logo watermark */}
            <div className="relative flex items-center justify-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,0,0.12),transparent_65%)] blur-2xl" />
              <img
                src={logoImg}
                alt="RM Logo"
                className="w-64 h-64 object-contain opacity-70 select-none drop-shadow-[0_0_40px_rgba(255,42,0,0.3)]"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>
    </SiteShell>
  );
}

function ContactRow({
  Icon, label, value, href,
}: { Icon: typeof Mail; label: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary transition-all group-hover:shadow-[0_0_12px_rgba(255,42,0,0.3)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{label}</div>
        <div className="truncate text-sm text-foreground/90">{value}</div>
      </div>
    </>
  );
  return (
    <li className="group">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-all hover:text-primary">
          {inner}
        </a>
      ) : (
        <div className="flex items-center gap-3">{inner}</div>
      )}
    </li>
  );
}
