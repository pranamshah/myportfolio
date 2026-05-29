"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

type Node = { x: number; y: number; vx: number; vy: number; r: number; isPort: boolean; pulse: number };

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

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize, { passive: true });

    const nodes: Node[] = Array.from({ length: 32 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.15,
      r: i < 7 ? 3.5 : 1.8,
      isPort: i < 7,
      pulse: Math.random() * Math.PI * 2,
    }));

    function draw() {
      raf = requestAnimationFrame(draw);
      frame++;
      ctx!.clearRect(0, 0, W, H);

      // Lines between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = `rgba(180,180,180,${0.35 * (1 - d / 160)})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
        n.pulse += 0.025;

        if (n.isPort) {
          // Gold pulse ring
          const p = (Math.sin(n.pulse) + 1) / 2;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + 5 + p * 6, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(201,164,82,${0.18 * p})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
          // Gold core
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(201,164,82,0.85)`;
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = "rgba(160,160,160,0.55)";
          ctx!.fill();
        }
      });
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-[#FAFAF8] overflow-hidden">
      {/* Canvas animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Content — centered */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#C9A452]/30 rounded-full px-4 py-1.5 mb-8 bg-white/70 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A452]" />
          <span className="text-xs font-medium text-[#C9A452] uppercase tracking-widest">
            Freight Forwarding · Customs Clearance · Logistics
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-light text-gray-900 leading-[1.08] mb-5 tracking-tight">
          Your Cargo. Our Expertise.<br />
          <span style={{ color: "#C9A452" }}>The World, Connected.</span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-px bg-[#C9A452] mx-auto mb-6" />

        {/* Subtext */}
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10">
          End-to-end freight forwarding and customs clearance for businesses across India — sea, air, and door-to-door.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup"
            className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-md hover:bg-gray-800 transition-colors text-sm">
            Get a Free Quote
          </Link>
          <Link href="/login"
            className="border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm">
            Track Shipment →
          </Link>
        </div>

        {/* Trust row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400 font-medium uppercase tracking-wider">
          {["500+ Clients", "10,000+ Shipments", "15+ Years", "50+ Countries"].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A452]/60" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF8] to-transparent pointer-events-none" />
    </section>
  );
}
