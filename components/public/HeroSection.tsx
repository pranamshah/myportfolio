"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import GlobeCanvas from "./GlobeCanvas";

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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden canvas-bg"
      style={{ backgroundColor: "#f9f9f9" }}>

      {/* Globe — full section, centered right */}
      <div className="absolute inset-0">
        <GlobeCanvas cx={0.64} cy={0.5} radiusFactor={0.43} opacity={1} />
      </div>

      {/* Gradient — solid left (text readable) → transparent right (globe visible) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #f9f9f9 0%, #f9f9f9 34%, rgba(249,249,249,0.88) 46%, rgba(249,249,249,0.35) 60%, transparent 74%)",
        }}
      />

      {/* Watermark — faint, behind text */}
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

      {/* Content — left side */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-20 pt-28 pb-12 w-full">
        <div className="max-w-[540px]">

          <span className="font-mono text-[11px] tracking-[0.22em] text-secondary mb-5 block uppercase">
            Established 1994 · Chennai, India
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

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-5 md:left-20 flex items-center gap-3 reveal reveal-delay-3 z-10">
        <div className="w-px h-10 bg-outline-variant" />
        <span className="font-mono text-[10px] tracking-[0.18em] text-on-surface-variant">SCROLL</span>
      </div>
    </section>
  );
}
