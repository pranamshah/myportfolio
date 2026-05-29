"use client";
import Link from "next/link";
import GlobeCanvas from "./GlobeCanvas";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #080d1a 0%, #0d1630 50%, #090e1c 100%)" }}>

      {/* Globe — positioned right-center, large and dramatic */}
      <div className="absolute inset-0">
        <GlobeCanvas cx={0.72} cy={0.5} radiusFactor={0.46} opacity={1} />
      </div>

      {/* Left gradient so text is readable */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(8,13,26,1) 0%, rgba(8,13,26,0.94) 28%, rgba(8,13,26,0.5) 55%, transparent 75%)" }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, #080d1a, transparent)" }} />

      {/* Content — left-aligned */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#C9A452]/40 rounded-full px-4 py-1.5 mb-8 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A452] animate-pulse" />
            <span className="text-xs font-semibold text-[#C9A452] uppercase tracking-widest">
              Freight Forwarding &amp; Logistics — Chennai
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-light text-white leading-[1.08] mb-5 tracking-tight">
            Your Cargo.<br />Our Expertise.<br />
            <em style={{ color: "#C9A452", fontStyle: "italic" }}>The World, Connected.</em>
          </h1>

          <div className="w-14 h-px bg-[#C9A452] mb-6" />

          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Sea freight, air freight, customs clearance and door-to-door delivery for businesses across India.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup"
              className="bg-[#C9A452] text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-[#d4b06a] transition-colors text-sm shadow-lg">
              Get a Free Quote
            </Link>
            <Link href="/login"
              className="border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium px-8 py-3 rounded-lg hover:border-white/40 hover:bg-white/10 transition-colors text-sm">
              Track Shipment →
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-gray-500 font-medium">
            {[
              "Sea · Air · Land Freight",
              "Customs & CHA Coordination",
              "Door-to-Door Delivery",
              "Real-Time Tracking",
            ].map(t => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C9A452]/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
