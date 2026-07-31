import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface PlusIconProps {
  to: string;
  label: string;
  sublabel?: string;
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md";
}

export function PlusIcon({ to, label, sublabel, className = "", style, size = "md" }: PlusIconProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className={`group absolute ${className}`} style={style}>
      <Link to={to} aria-label={`Go to ${label}`}>
        <motion.button
          whileHover={{ scale: 1.18 }}
          whileTap={{ scale: 0.95 }}
          className={`plus-icon grid ${sizeClasses} place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_14px_rgba(255,42,0,0.7)] ring-2 ring-background`}
        >
          <Plus className={iconSize} />
        </motion.button>
      </Link>
      <div className="pointer-events-none absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background/95 px-3 py-1.5 text-center opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 z-20">
        <div className="font-display text-xs text-bone">{label}</div>
        {sublabel && (
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{sublabel}</div>
        )}
      </div>
    </div>
  );
}
