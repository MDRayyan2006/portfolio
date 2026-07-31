import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Pulse phase so nodes breathe out of sync */
  phase: number;
};

/**
 * Canvas-2D neural-network visualisation used as the hero centrepiece.
 *
 * - Nodes drift slowly and connect to nearby neighbours (distance-thresholded edges)
 * - The cursor gently repels nodes, creating an interactive "parting" effect
 * - Signal pulses travel along a few random edges to suggest inference
 * - Disabled entirely for reduced-motion users and very small viewports
 */
export function NeuralCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;

    // Pointer in CSS pixels, relative to the canvas. -9999 == "away".
    const pointer = { x: -9999, y: -9999 };

    const LINK_DIST = 132;
    const REPEL_DIST = 110;

    function nodeCount() {
      // Scale density with area but stay bounded for performance.
      const target = Math.round((width * height) / 15000);
      return Math.max(26, Math.min(72, target));
    }

    function seed() {
      nodes = Array.from({ length: nodeCount() }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);

      // ── Update positions ──
      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;

          // Cursor repulsion
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL_DIST && d > 0.01) {
            const force = (1 - d / REPEL_DIST) * 0.9;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }

          // Soft wrap so the field never empties out
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
      }

      // ── Edges ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK_DIST) continue;

          const strength = 1 - dist / LINK_DIST;
          ctx!.strokeStyle = `rgba(255, 42, 0, ${strength * 0.28})`;
          ctx!.lineWidth = strength * 0.9;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();

          // Travelling signal pulse on a deterministic subset of edges
          if (!reduced && (i * 31 + j * 17) % 11 === 0 && strength > 0.45) {
            const p = ((t / 1400 + (i + j) * 0.13) % 1);
            const px = a.x + (b.x - a.x) * p;
            const py = a.y + (b.y - a.y) * p;
            ctx!.beginPath();
            ctx!.fillStyle = `rgba(255, 130, 60, ${strength * 0.85})`;
            ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      // ── Nodes ──
      for (const n of nodes) {
        const breathe = reduced ? 1 : 0.75 + Math.sin(t / 900 + n.phase) * 0.25;
        const radius = n.r * breathe;

        // Halo
        const halo = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6);
        halo.addColorStop(0, "rgba(255, 85, 0, 0.28)");
        halo.addColorStop(1, "rgba(255, 85, 0, 0)");
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, radius * 6, 0, Math.PI * 2);
        ctx!.fill();

        // Core
        ctx!.fillStyle = "rgba(255, 226, 214, 0.9)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    // Pause the loop when scrolled out of view to save cycles.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
