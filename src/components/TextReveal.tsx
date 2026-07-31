import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Editorial mask reveal: content slides up from behind an overflow-hidden
 * clip so the line appears to be "unveiled" rather than simply faded in.
 * Compose several with staggered `delay` values for multi-line headlines.
 */
export function TextReveal({
  children,
  delay = 0,
  duration = 0.9,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <span className={`reveal-mask ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once, amount: 0.4 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
