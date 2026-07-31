import { useMemo } from "react";

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 5,
  }));
}

export function ParticleField({ count = 50 }: { count?: number }) {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.size > 1.5 ? "#ff2a00" : "#ffffff",
            opacity: p.opacity,
            boxShadow: p.size > 1.5
              ? "0 0 6px rgba(255,42,0,0.6)"
              : "0 0 4px rgba(255,255,255,0.4)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
