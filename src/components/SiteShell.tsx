import { Link, useRouterState } from "@tanstack/react-router";
import { Home, User, Code2, Trophy, Gamepad2, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { ParticleField } from "@/components/ParticleField";
import logoImg from "@/assets/logo.png";

const topNav = [
  { label: "HOME", to: "/", hash: "" },
  { label: "ABOUT", to: "/", hash: "#about" },
  { label: "SKILLS", to: "/", hash: "#skills" },
  { label: "PROJECTS", to: "/projects", hash: "" },
  { label: "ACHIEVEMENTS", to: "/projects", hash: "#journey" },
  { label: "HOBBIES", to: "/contact", hash: "#hobbies" },
  { label: "CONTACT", to: "/contact", hash: "#contact" },
] as const;

const sideNav = [
  { icon: Home, to: "/", label: "Home" },
  { icon: User, to: "/", hash: "#about", label: "About" },
  { icon: Code2, to: "/", hash: "#skills", label: "Skills" },
  { icon: Trophy, to: "/projects", label: "Projects" },
  { icon: Gamepad2, to: "/contact", hash: "#hobbies", label: "Hobbies" },
  { icon: Mail, to: "/contact", hash: "#contact", label: "Contact" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Global ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,42,0,0.06),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,85,0,0.04),transparent_70%)] blur-3xl" />
      </div>

      {/* Subtle particle background */}
      <ParticleField count={30} />

      {/* ─── Top Nav ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/[0.04]">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logoImg}
              alt="RM Logo"
              className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,42,0,0.4)] transition-all group-hover:drop-shadow-[0_0_14px_rgba(255,42,0,0.6)]"
            />
            <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-foreground/90 sm:block">
              Rayyan Mohammed
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {topNav.map((item) => {
              const active =
                (item.to === "/" && item.hash === "" && path === "/") ||
                (item.to !== "/" && path.startsWith(item.to));
              return (
                <a
                  key={item.label}
                  href={item.to + item.hash}
                  className={`relative font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 hover:text-primary ${active ? "text-primary" : "text-foreground/60"
                    }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-primary shadow-[0_0_12px_rgba(255,42,0,0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:text-primary lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="glass border-t border-white/[0.04] overflow-hidden lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {topNav.map((item) => {
                  const active =
                    (item.to === "/" && item.hash === "" && path === "/") ||
                    (item.to !== "/" && path.startsWith(item.to));
                  return (
                    <a
                      key={item.label}
                      href={item.to + item.hash}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-lg px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-all ${active
                          ? "bg-primary/10 text-primary neon-border"
                          : "text-foreground/60 hover:bg-white/[0.03] hover:text-primary"
                        }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Left Icon Rail ─── */}
      <aside className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 md:block">
        <div className="ml-3 flex flex-col gap-3 rounded-full glass p-2.5">
          {sideNav.map((item, i) => {
            const Icon = item.icon;
            const isHome = i === 0 && path === "/";
            return (
              <a
                key={item.label}
                href={item.to + ("hash" in item && item.hash ? item.hash : "")}
                aria-label={item.label}
                className={`group relative grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${isHome
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/40 hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-background/95 border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/80 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </aside>

      <main className="pt-16 relative z-10">{children}</main>

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-border/30 bg-background/90 px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="RM Logo"
              className="h-8 w-auto object-contain opacity-80"
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Built with curiosity, caffeine, and countless iterations.
          </p>
          <p className="text-xs text-muted-foreground">©Rayyan Mohammed Since 2006.</p>
        </div>
      </footer>
    </div>
  );
}
