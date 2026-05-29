"use client";
import Link from "next/link";
import LogisticsCanvas from "./LogisticsCanvas";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(160deg, #FDFCF9 0%, #F5F3EE 100%)" }}>
      {/* Logistics route animation */}
      <LogisticsCanvas />

      {/* Soft radial vignette so text stays readable */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(250,248,243,0.55) 100%)" }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F5F3EE, transparent)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#C9A452]/30 rounded-full px-4 py-1.5 mb-8 bg-white/70 backdrop-blur-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A452] animate-pulse" />
          <span className="text-xs font-semibold text-[#C9A452] uppercase tracking-widest">
            Freight Forwarding &amp; Logistics — Chennai
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-light text-gray-900 leading-[1.08] mb-5 tracking-tight">
          Your Cargo. Our Expertise.<br />
          <em style={{ color: "#C9A452", fontStyle: "italic" }}>The World, Connected.</em>
        </h1>

        <div className="w-14 h-px bg-[#C9A452] mx-auto mb-6" />

        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10">
          We coordinate sea freight, air freight, customs clearance, and door-to-door delivery for businesses across India.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup"
            className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-md">
            Get a Free Quote
          </Link>
          <Link href="/login"
            className="border border-gray-300 bg-white/80 text-gray-700 font-medium px-8 py-3 rounded-lg hover:border-gray-400 hover:bg-white transition-colors text-sm">
            Track Shipment →
          </Link>
        </div>

        {/* Simple trust row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400 font-medium">
          {[
            "Sea · Air · Land Freight",
            "Customs & CHA Coordination",
            "Door-to-Door Delivery",
            "Real-Time Shipment Tracking",
          ].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A452]/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
