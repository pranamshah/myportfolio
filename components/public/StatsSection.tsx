const STATS = [
  { label: "FREIGHT MODES", value: "SEA & AIR" },
  { label: "CERTIFICATION", value: "CHA LICENSED" },
  { label: "OPERATIONS", value: "CHENNAI PORT" },
  { label: "ESTABLISHED", value: "SINCE 1994" },
];

const WHY = [
  { title: "Full-Service Freight", desc: "Sea freight, air freight, and inland transport — all under one roof, managed end to end." },
  { title: "Real-Time Tracking", desc: "Live shipment status at every milestone through your secure client portal." },
  { title: "Transparent Billing", desc: "Detailed invoices with itemised charges — no surprises, no hidden fees." },
  { title: "Dedicated Support", desc: "One point of contact for all logistics queries — always available when you need us." },
];

export default function StatsSection() {
  return (
    <section id="about" className="py-36 overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div className="px-5 md:px-20 max-w-[1440px] mx-auto">

        {/* Headline + description */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10 reveal">
          <div className="max-w-xl">
            <h2 className="font-display text-white mb-5"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
              }}>
              Precision.<br />Standard.
            </h2>
            <p className="font-sans text-lg text-white/55 leading-relaxed">
              Every shipment, every document, every clearance. Navkar Impex provides clinical accuracy for your cargo and your peace of mind.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <a href="/login"
              className="group w-full md:w-auto flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-white/60 hover:text-white transition-colors">
              <span className="h-px w-12 bg-white/20 transition-all duration-300 group-hover:w-20 group-hover:bg-white" />
              TRACK SHIPMENT
            </a>
          </div>
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12 mb-24 reveal">
          {STATS.map(({ label, value }) => (
            <div key={label} className="group flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.15em] text-white/40 mb-3 uppercase">{label}</span>
              <span className="font-display text-white group-hover:text-secondary-container transition-colors duration-300"
                style={{
                  fontSize: "clamp(22px, 3.5vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  fontStyle: "italic",
                }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Why cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 reveal">
          {WHY.map(({ title, desc }) => (
            <div key={title} className="bg-black p-8 hover:bg-white/5 transition-colors group">
              <div className="w-1 h-8 bg-secondary mb-6 group-hover:h-10 transition-all duration-300" />
              <h3 className="font-sans text-sm font-semibold text-white mb-3">{title}</h3>
              <p className="font-sans text-xs text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
