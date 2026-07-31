import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only custom cursor: a precise dot plus a spring-lagged ring.
 * The ring expands and snaps toward the centre of any `[data-magnetic]`
 * element it hovers, giving CTAs a magnetic feel.
 *
 * Hidden on touch devices via CSS (`@media (pointer: coarse)`).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only run on devices with a real pointer and no reduced-motion request.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let raf = 0;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      const ringEl = ringRef.current;
      if (!ringEl) return;

      const el = (e.target as HTMLElement | null)?.closest?.("[data-magnetic]");
      if (el) {
        const rect = el.getBoundingClientRect();
        // Pull the ring 45% of the way toward the element's centre.
        target.x = e.clientX + (rect.left + rect.width / 2 - e.clientX) * 0.45;
        target.y = e.clientY + (rect.top + rect.height / 2 - e.clientY) * 0.45;
        ringEl.dataset.active = "true";
      } else {
        ringEl.dataset.active = "false";
      }
    }

    function tick() {
      // Damped follow for the ring; the dot tracks the pointer 1:1.
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-active="false" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
