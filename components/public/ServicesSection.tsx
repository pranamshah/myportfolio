"use client";
/* eslint-disable @next/next/no-img-element */

const SERVICES = [
  {
    num: "01",
    tag: "MARITIME",
    title: "Sea Freight",
    desc: "FCL & LCL shipments across all major global ports. Competitive rates with full documentation support and real-time container tracking.",
    img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80",
    fallback: "linear-gradient(135deg,#062a4a,#0a3d62)",
  },
  {
    num: "02",
    tag: "PRIORITY",
    title: "Air Freight",
    desc: "Express and deferred air cargo for time-critical shipments. IATA-standard handling with exclusive carrier partnerships worldwide.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    fallback: "linear-gradient(135deg,#1a0a2e,#2d1654)",
  },
  {
    num: "03",
    tag: "REGULATORY",
    title: "Customs Clearance",
    desc: "Seamless customs coordination through our network of licensed CHA partners — tariff classification, duty calculation, and port clearance.",
    img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    fallback: "linear-gradient(135deg,#1a1d2e,#252839)",
  },
  {
    num: "04",
    tag: "END-TO-END",
    title: "Door-to-Door",
    desc: "End-to-end logistics from origin to doorstep. Inland transport, last-mile delivery, and live status updates in your client portal.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    fallback: "linear-gradient(135deg,#0f1a0f,#1a2a1a)",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative pt-32 pb-36 px-5 md:px-20 bg-surface-container-lowest overflow-hidden">
      {/* Faint globe shadow — suggests the globe from the hero continues behind */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 65% 55% at 82% 0%, rgba(30,80,180,0.07) 0%, rgba(20,60,140,0.03) 55%, transparent 72%)",
      }} />
      <div className="max-w-[1440px] mx-auto">

        {/* Section header */}
        <div className="mb-14 reveal">
          <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase block mb-4">Our Services</span>
          <h2 className="font-display"
            style={{ fontSize:"clamp(36px,4.5vw,64px)", fontWeight:600, lineHeight:"1.15", letterSpacing:"-0.02em" }}>
            Moving Beyond Borders
          </h2>
          <div className="h-0.5 w-20 bg-secondary mt-5" />
        </div>

        {/* Sea Freight — hero card (full width) */}
        <div className="reveal mb-4">
          <div className="group relative overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-500"
            style={{ height: "420px" }}>
            {/* Image */}
            <img
              src={SERVICES[0].img}
              alt="Container ship sea freight"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
            />
            {/* Dark fallback behind image */}
            <div className="absolute inset-0" style={{ background: SERVICES[0].fallback, zIndex: -1 }} />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/50 block mb-2 uppercase">{SERVICES[0].tag}</span>
                <h3 className="font-display text-white mb-2"
                  style={{ fontSize:"clamp(32px,4vw,52px)", fontStyle:"italic", fontWeight:600, lineHeight:1 }}>
                  {SERVICES[0].title}
                </h3>
                <p className="font-sans text-sm text-white/70 max-w-md leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {SERVICES[0].desc}
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <span className="font-mono text-[10px] tracking-widest text-white/30">{SERVICES[0].num}</span>
              </div>
            </div>
            {/* Hover: desc also appears as overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        </div>

        {/* Air + Customs + D2D — three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.slice(1).map((svc) => (
            <div key={svc.num} className="group relative overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-500 reveal"
              style={{ height: "320px" }}>
              <img
                src={svc.img}
                alt={svc.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
              />
              <div className="absolute inset-0" style={{ background: svc.fallback, zIndex: -1 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="font-mono text-[10px] tracking-[0.15em] text-white/50 block mb-2 uppercase">{svc.tag}</span>
                <h3 className="font-display text-white mb-2"
                  style={{ fontSize:"clamp(24px,2.5vw,36px)", fontStyle:"italic", fontWeight:600 }}>
                  {svc.title}
                </h3>
                <p className="font-sans text-xs text-white/65 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                  {svc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
