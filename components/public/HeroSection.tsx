"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
};

const PORTS = [
  { rx: 0.17, ry: 0.62 }, // Mumbai
  { rx: 0.22, ry: 0.55 }, // Chennai
  { rx: 0.48, ry: 0.52 }, // Middle East / Gulf
  { rx: 0.62, ry: 0.35 }, // Europe
  { rx: 0.80, ry: 0.42 }, // UK/Netherlands
  { rx: 0.88, ry: 0.48 }, // US East
  { rx: 0.93, ry: 0.60 }, // US West
  { rx: 0.72, ry: 0.65 }, // SE Asia / Singapore
  { rx: 0.78, ry: 0.50 }, // China
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf: number;
    let frame = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize, { passive: true });

    // Floating cargo particles
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.45) * 0.2,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.55 + 0.15,
    }));

    function draw() {
      raf = requestAnimationFrame(draw);
      frame++;

      // Fade trail
      ctx!.fillStyle = "rgba(6, 7, 10, 0.18)";
      ctx!.fillRect(0, 0, W, H);

      // Nautical grid
      ctx!.strokeStyle = "rgba(201,164,82,0.025)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += 72) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke();
      }
      for (let y = 0; y < H; y += 72) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke();
      }

      // Route lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(201,164,82,${0.07 * (1 - d / 130)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        g.addColorStop(0, `rgba(201,164,82,${p.opacity * 0.8})`);
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(232,200,122,${p.opacity})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Port beacons
      PORTS.forEach(({ rx, ry }, i) => {
        const px = rx * W;
        const py = ry * H;
        const pulse = (Math.sin(frame * 0.025 + i * 1.1) + 1) / 2;

        ctx!.beginPath();
        ctx!.arc(px, py, 8 + pulse * 10, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(201,164,82,${0.22 * pulse})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(px, py, 3 + pulse * 2, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(201,164,82,${0.4 + 0.4 * pulse})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        const dot = ctx!.createRadialGradient(px, py, 0, px, py, 5);
        dot.addColorStop(0, `rgba(240,210,140,${0.9})`);
        dot.addColorStop(1, "rgba(201,164,82,0)");
        ctx!.fillStyle = dot;
        ctx!.beginPath();
        ctx!.arc(px, py, 5, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Animated sea wave at bottom
      ctx!.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y =
          H - 55 +
          Math.sin(x * 0.007 + frame * 0.018) * 9 +
          Math.sin(x * 0.013 - frame * 0.013) * 5 +
          Math.sin(x * 0.02 + frame * 0.009) * 3;
        x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.lineTo(W, H);
      ctx!.lineTo(0, H);
      ctx!.closePath();
      const wg = ctx!.createLinearGradient(0, H - 70, 0, H);
      wg.addColorStop(0, "rgba(201,164,82,0.045)");
      wg.addColorStop(0.5, "rgba(27,58,107,0.06)");
      wg.addColorStop(1, "rgba(6,7,10,0.9)");
      ctx!.fillStyle = wg;
      ctx!.fill();
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-deep">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(6,7,10,0.5)_100%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface-deep to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-36 w-full">
        <div className="max-w-3xl">
          {/* Pill tag */}
          <div className="inline-flex items-center gap-2 border border-gold/25 rounded-full px-4 py-1.5 mb-8
                          bg-gold/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs text-gold/90 uppercase tracking-[0.18em]">
              Freight Forwarding &amp; Customs Clearance
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-light text-ink leading-[1.07] mb-6 tracking-tight">
            Your Cargo.
            <br />
            <span className="gold-text italic">Our Expertise.</span>
            <br />
            The World, Connected.
          </h1>

          <div className="gold-line max-w-[180px] mb-7" />

          <p className="text-ink-secondary text-[clamp(1rem,2vw,1.2rem)] leading-relaxed mb-10 max-w-[540px]">
            End-to-end freight forwarding, customs clearance, and door-to-door logistics — trusted by 500+ businesses across India and beyond.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/signup"
              className="btn-gold text-base px-8 py-3 shadow-gold">
              Get a Free Quote
            </Link>
            <Link href="/login"
              className="btn-ghost text-base px-8 py-3 flex items-center gap-2">
              Track Shipment
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              "500+ Clients Served",
              "10,000+ Shipments Delivered",
              "15+ Years Experience",
              "50+ Countries Covered",
            ].map(b => (
              <span key={b} className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="w-1 h-1 rounded-full bg-gold/60" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] text-gold uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
