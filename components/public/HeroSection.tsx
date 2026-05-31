"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import GlobeCanvas from "./GlobeCanvas";

export default function HeroSection() {
  const floaterRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      if (watermarkRef.current) {
        watermarkRef.current.style.transform =
          `translate(${x * 10}px, ${y * 10}px)`;
      }
      if (floaterRef.current) {
        floaterRef.current.style.transform =
          `rotate(${3 + x * 4}deg) translate(${x * 18}px, ${y * 18}px)`;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-10
      px-5 md:px-20 overflow-hidden bg-surface canvas-bg">

      {/* Giant watermark */}
      <div ref={watermarkRef}
        className="watermark-text absolute top-1/2 -translate-y-1/2 left-0 leading-none select-none"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(180px, 25vw, 380px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: "#1a1c1c",
          opacity: 0.028,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 0,
        }}>
        Navkar
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[920px] reveal">
        <span className="font-mono text-[11px] tracking-[0.22em] text-secondary mb-5 block uppercase">
          Established 1994 · Chennai, India
        </span>

        <h1 className="font-display mb-12"
          style={{
            fontSize: "clamp(52px, 7.5vw, 120px)",
            lineHeight: "110%",
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}>
          Your Cargo.<br />
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>Our Universe.</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          <p className="font-sans text-lg text-on-surface-variant leading-relaxed max-w-[420px]">
            Elite freight forwarding where technical precision meets global intuition.
            Sea freight, air freight, customs clearance and door-to-door delivery.
          </p>

          <div className="flex flex-col gap-5 md:mt-1">
            <a href="#services"
              className="group flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-primary">
              <span className="h-px w-12 bg-primary transition-all duration-300 group-hover:w-20 group-focus:w-20" />
              EXPLORE SERVICES
            </a>
            <Link href="/login"
              className="group flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-on-surface-variant hover:text-primary transition-colors">
              <span className="h-px w-12 bg-outline-variant transition-all duration-300 group-hover:w-20 group-hover:bg-primary" />
              CLIENT PORTAL
            </Link>
          </div>
        </div>
      </div>

      {/* Floating globe card */}
      <div ref={floaterRef}
        className="float-card hidden lg:block absolute bg-white/60 backdrop-blur-sm shadow-2xl"
        style={{
          right: "80px",
          top: "50%",
          marginTop: "-320px",
          width: "460px",
          height: "620px",
          border: "1px solid rgba(198,198,205,0.35)",
          padding: "14px",
          zIndex: 5,
        }}>
        <div className="w-full h-full relative overflow-hidden bg-surface-container-low">
          <GlobeCanvas cx={0.5} cy={0.5} radiusFactor={0.44} opacity={0.92} />
          <div className="absolute bottom-0 left-0 right-0 bg-primary text-on-primary px-6 py-5">
            <p className="font-mono text-[10px] tracking-[0.15em] opacity-50 mb-1">SYSTEM STATUS</p>
            <p className="font-sans text-xl font-bold tracking-tight uppercase leading-none">
              Global Network Active
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-5 md:left-20 flex items-center gap-3 reveal reveal-delay-3">
        <div className="w-px h-10 bg-outline-variant" />
        <span className="font-mono text-[10px] tracking-[0.15em] text-on-surface-variant">SCROLL</span>
      </div>
    </section>
  );
}
