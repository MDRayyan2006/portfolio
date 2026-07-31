import { motion, useScroll, useSpring } from "framer-motion";

/** Thin page-scroll progress line pinned under the top nav. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-16 z-50 h-[2px] w-full origin-left bg-gradient-to-r from-primary via-[#ff7a2a] to-primary shadow-[0_0_12px_rgba(255,42,0,0.7)]"
    />
  );
}
