import { createFileRoute } from "@tanstack/react-router";
import { Mail, Linkedin, Github, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TextReveal } from "@/components/TextReveal";
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
          </div>
        </div>
      </section>

      <div className="scratch-divider mx-auto max-w-[90%]" />

      {/* ═══════════════════════════════════════════════════════════
         CONTACT
         ═══════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="relative flex min-h-[92vh] items-center overflow-hidden px-6 py-24 md:pl-20 lg:px-10"
      >
        {/* Atmospheric backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(255,42,0,0.16),transparent_70%)]" />
          <img
            src={logoImg}
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 w-[min(70vw,780px)] -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-[0.045] blur-[1px]"
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px]">
          <ScrollReveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Let&apos;s Connect
            </span>
          </ScrollReveal>

          {/* Oversized editorial headline */}
          <h2 className="mt-5 font-display text-[clamp(2.75rem,10vw,9rem)] leading-[0.84] tracking-tight">
            <TextReveal delay={0.05}>
              <span className="title-stone block">Let&apos;s Build</span>
            </TextReveal>
            <TextReveal delay={0.16}>
              <span className="title-blood block">Something Great</span>
            </TextReveal>
          </h2>

          <ScrollReveal delay={0.25}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
              Open to internships, collaborations and exciting opportunities. If
              you are building something ambitious, I would love to hear about it.
            </p>
          </ScrollReveal>

          {/* Oversized magnetic CTA */}
          <ScrollReveal delay={0.35}>
            <motion.a
              href={`mailto:${contact.email}`}
              data-magnetic
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="group mt-12 inline-flex items-center gap-5 border border-primary/50 bg-primary/[0.07] px-8 py-6 backdrop-blur-sm transition-colors duration-500 hover:border-primary hover:bg-primary/15 sm:px-12 sm:py-8"
            >
              <span className="font-display text-[clamp(1.5rem,4vw,2.75rem)] leading-none tracking-tight text-bone transition-colors group-hover:text-primary">
                Say Hello
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45 sm:h-14 sm:w-14">
                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            </motion.a>
          </ScrollReveal>

          {/* Contact detail strip */}
          <ScrollReveal delay={0.45}>
            <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-border/50 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              <ContactRow Icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              <ContactRow Icon={Linkedin} label="LinkedIn" value={contact.linkedin} href={contact.linkedinUrl} />
              <ContactRow Icon={Github} label="GitHub" value={contact.github} href={contact.githubUrl} />
              <ContactRow Icon={MapPin} label="Location" value={contact.location} />
            </ul>
          </ScrollReveal>
        </div>
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
