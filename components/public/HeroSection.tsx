"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Three.js uses browser WebGL — must be client-only
const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false, loading: () => null });

export default function HeroSection() {
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!watermarkRef.current) return;
      const x = e.clientX / window.innerWidth  - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      watermarkRef.current.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#f5f6f8" }}>

      {/* ── Dark space backdrop on the right (makes globe look premium) ── */}
      <div className="absolute inset-y-0 right-0 w-[72%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 68% 50%, rgba(4,10,30,0.97) 0%, rgba(4,10,30,0.92) 22%, rgba(4,10,30,0.75) 44%, rgba(4,10,30,0.35) 63%, transparent 80%)",
        }}
      />

      {/* ── Globe canvas (transparent bg, full section so stars fill space) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <GlobeCanvas cx={0.64} cy={0.50} opacity={1} />
      </div>

      {/* ── Left gradient: light bg → transparent so globe shows on right ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #f5f6f8 0%, #f5f6f8 28%, rgba(245,246,248,0.90) 40%, rgba(245,246,248,0.45) 52%, transparent 66%)",
        }}
      />

      {/* ── Watermark ── */}
      <div ref={watermarkRef}
        className="watermark-text absolute top-1/2 left-0 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(160px, 22vw, 340px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: "#1a1c1c",
          opacity: 0.03,
          whiteSpace: "nowrap",
          zIndex: 0,
        }}>
        Navkar
      </div>

      {/* ── Text content — left side ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-20 pt-28 pb-12 w-full">
        <div className="max-w-[540px]">

          <span className="font-mono text-[11px] tracking-[0.22em] text-secondary mb-5 block uppercase">
            Established 2026 · Chennai, India
          </span>

          <h1 className="font-display mb-12"
            style={{
              fontSize: "clamp(48px, 7vw, 110px)",
              lineHeight: "108%",
              letterSpacing: "-0.04em",
              fontWeight: 700,
            }}>
            Your Cargo.<br />
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>Our Universe.</span>
          </h1>

          <p className="font-sans text-lg text-on-surface-variant leading-relaxed mb-10 max-w-[400px]">
            Elite freight forwarding — sea, air, customs and door-to-door delivery
            for businesses across India.
          </p>

          <div className="flex flex-col gap-5">
            <a href="#services"
              className="group inline-flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-primary">
              <span className="h-px w-12 bg-primary transition-all duration-300 group-hover:w-20" />
              EXPLORE SERVICES
            </a>
            <Link href="/login"
              className="group inline-flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-on-surface-variant hover:text-primary transition-colors">
              <span className="h-px w-12 bg-outline-variant transition-all duration-300 group-hover:w-20 group-hover:bg-primary" />
              CLIENT PORTAL
            </Link>
          </div>

        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-5 md:left-20 flex items-center gap-3 z-10">
        <div className="w-px h-10 bg-outline-variant" />
        <span className="font-mono text-[10px] tracking-[0.18em] text-on-surface-variant">SCROLL</span>
      </div>
    </section>
  );
}
