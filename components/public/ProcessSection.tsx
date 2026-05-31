const STEPS = [
  { n: "01", title: "REQUEST A QUOTE", desc: "Share cargo details — mode, weight, origin, destination. Get a competitive quote within 2 hours." },
  { n: "02", title: "BOOKING & DOCS", desc: "We handle vessel/airline bookings, Bill of Lading, AWB, and all customs documentation." },
  { n: "03", title: "LIVE TRACKING", desc: "Monitor every milestone — vessel ETA, port arrival, customs clearance — in your client portal." },
  { n: "04", title: "DELIVERY", desc: "Expert customs clearance, duty coordination, and last-mile inland delivery to your doorstep." },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-36 px-5 md:px-20 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto">

        <div className="flex flex-col md:flex-row gap-20">
          {/* Left: heading */}
          <div className="md:w-80 flex-shrink-0 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-secondary block mb-5 uppercase">
              How It Works
            </span>
            <h2 className="font-display"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 600,
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
              }}>
              Simple &amp;<br />Transparent.
            </h2>
            <div className="h-0.5 w-16 bg-secondary mt-6" />
          </div>

          {/* Right: steps */}
          <div className="flex-1 relative">
            {/* Connecting line */}
            <div className="absolute left-7 top-4 bottom-4 w-px bg-outline-variant hidden md:block" />

            <div className="space-y-10">
              {STEPS.map(({ n, title, desc }, i) => (
                <div key={n} className={`reveal reveal-delay-${i + 1} flex gap-8 items-start`}>
                  <div className="flex-shrink-0 w-14 h-14 border border-outline-variant bg-surface flex items-center justify-center relative z-10">
                    <span className="font-display text-lg text-secondary" style={{ fontStyle: "italic" }}>{n}</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-mono text-[11px] tracking-[0.12em] text-on-surface font-bold mb-2">{title}</h3>
                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
