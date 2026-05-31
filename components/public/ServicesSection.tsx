const SERVICES = [
  {
    num: "01",
    tag: "MARITIME",
    title: "Sea Freight",
    desc: "Global ocean logistics with real-time tracking and prioritized port discharge. FCL, LCL, and oversized breakbulk cargo handled with precision.",
    gradient: "linear-gradient(135deg, #062a4a 0%, #0a3d62 60%, #0c4a75 100%)",
    large: true,
  },
  {
    num: "02",
    tag: "PRIORITY",
    title: "Air Freight",
    desc: "When time is the only currency. Express and deferred air cargo for time-critical shipments. IATA certified handling worldwide.",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1654 60%, #1a0a2e 100%)",
    large: false,
  },
  {
    num: "03",
    tag: "REGULATORY",
    title: "Customs",
    desc: "Licensed CHA services — complex tariffs, duty calculation, documentation, and seamless port clearance simplified.",
    gradient: "linear-gradient(135deg, #1a1d2e 0%, #252839 60%, #1a1d2e 100%)",
    large: false,
  },
  {
    num: "04",
    tag: "END-TO-END",
    title: "Door-to-Door",
    desc: "Complete logistics from origin to doorstep. Inland transport, last-mile delivery, and live status updates.",
    gradient: "linear-gradient(135deg, #0f1a0f 0%, #1a2a1a 60%, #152215 100%)",
    large: false,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-36 px-5 md:px-20 bg-surface-container-lowest">
      <div className="max-w-[1440px] mx-auto">

        {/* Top row: header + sea freight */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8 items-start">

          {/* Header */}
          <div className="md:col-span-4 reveal">
            <h2 className="font-display mb-6"
              style={{
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 600,
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
              }}>
              Moving Beyond<br />Borders
            </h2>
            <div className="h-0.5 w-20 bg-secondary mb-6" />
            <p className="font-sans text-base text-on-surface-variant leading-relaxed">
              Freight forwarding services tailored for Indian importers and exporters — sea, air, customs and last-mile delivery.
            </p>
          </div>

          {/* Sea Freight — large card */}
          <div className="md:col-span-7 md:col-start-6 md:mt-20 relative reveal">
            <div className="absolute -top-16 -left-8 select-none pointer-events-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "180px",
                fontWeight: 700,
                color: "#1a1c1c",
                opacity: 0.025,
                lineHeight: 1,
              }}>
              01
            </div>
            <div className="group relative overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-500 shadow-sm"
              style={{ aspectRatio: "16/9" }}>
              <div className="w-full h-full flex items-end"
                style={{ background: SERVICES[0].gradient }}>
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                  }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.15">
                    <path d="M8 56L20 36L32 44L44 28L56 36L72 20" stroke="white" strokeWidth="2"/>
                    <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
                    <path d="M10 40H70M40 10V70" stroke="white" strokeWidth="0.5" strokeDasharray="2 4"/>
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                <span className="font-mono text-[10px] uppercase tracking-widest block mb-2 opacity-60">Maritime Operations</span>
                <h3 className="font-display text-3xl" style={{ fontStyle: "italic" }}>The Deepest Reach</h3>
              </div>
            </div>
            <div className="mt-7 flex justify-between items-start gap-6">
              <div>
                <h3 className="font-display text-4xl mb-3" style={{ fontStyle: "italic" }}>Sea Freight</h3>
                <p className="font-sans text-base text-on-surface-variant leading-relaxed max-w-[420px]">
                  {SERVICES[0].desc}
                </p>
              </div>
              <div className="font-mono text-secondary text-xl mt-1 flex-shrink-0">→</div>
            </div>
          </div>
        </div>

        {/* Second row: air freight + customs + d2d */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 items-start mt-16 md:-mt-24">

          {/* Air Freight — offset card with padding */}
          <div className="md:col-span-5 reveal">
            <div className="group relative p-10 bg-white border border-outline-variant hover:border-primary transition-all duration-500 hover:shadow-xl">
              <div className="mb-7 overflow-hidden border border-outline-variant/20"
                style={{ aspectRatio: "16/9", background: SERVICES[1].gradient }}>
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
                    }} />
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.2">
                    <path d="M5 42L28 14L52 28" stroke="white" strokeWidth="1.5"/>
                    <path d="M28 14L32 42" stroke="white" strokeWidth="1.5"/>
                    <circle cx="28" cy="14" r="4" fill="white" opacity="0.4"/>
                  </svg>
                </div>
              </div>
              <span className="font-mono text-[11px] text-secondary mb-5 block tracking-[0.12em]">
                02 / PRIORITY
              </span>
              <h3 className="font-display text-5xl mb-5" style={{ fontStyle: "italic" }}>Air Freight</h3>
              <p className="font-sans text-base text-on-surface-variant mb-10 leading-relaxed">
                {SERVICES[1].desc}
              </p>
              <a href="/signup"
                className="inline-block bg-primary text-on-primary font-mono text-[11px] tracking-[0.12em] px-8 py-4 hover:opacity-80 transition-opacity active:scale-95">
                SCHEDULE URGENT
              </a>
            </div>
          </div>

          {/* Customs */}
          <div className="md:col-span-4 md:col-start-7 md:mt-32 reveal">
            <div className="border-l-2 border-outline-variant pl-8 py-2">
              <span className="font-mono text-[11px] text-secondary mb-4 block tracking-[0.12em]">03 / REGULATORY</span>
              <h3 className="font-display text-4xl mb-4" style={{ fontStyle: "italic" }}>Customs</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed mb-8">
                {SERVICES[2].desc}
              </p>
              <div className="h-36 w-full border border-outline-variant/30 flex items-center justify-center overflow-hidden"
                style={{ background: SERVICES[2].gradient }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
                  <rect x="6" y="6" width="36" height="36" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M14 18H34M14 24H28M14 30H22" stroke="white" strokeWidth="1.5"/>
                  <path d="M34 28L44 38" stroke="white" strokeWidth="2"/>
                  <circle cx="38" cy="32" r="6" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Door-to-Door */}
          <div className="md:col-span-3 md:col-start-11 md:mt-52 reveal">
            <div className="border-l-2 border-outline-variant pl-8 py-2">
              <span className="font-mono text-[11px] text-secondary mb-4 block tracking-[0.12em]">04 / END-TO-END</span>
              <h3 className="font-display text-3xl mb-4" style={{ fontStyle: "italic" }}>Door-to-Door</h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {SERVICES[3].desc}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
