const STATS = [
  { value: "500+", label: "Clients Served", sub: "Businesses across India" },
  { value: "10K+", label: "Shipments Delivered", sub: "Sea, air & land" },
  { value: "15+", label: "Years of Excellence", sub: "Founded in Chennai, 2009" },
  { value: "50+", label: "Countries Covered", sub: "Global shipping network" },
];

const CERTIFICATIONS = [
  "Licensed Customs House Agent (CHA)",
  "DGFT Registered",
  "FIATA Member",
  "ISO 9001:2015 Certified",
];

export default function StatsSection() {
  return (
    <section id="about" className="py-28 bg-surface-deep relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[700px] h-[350px] bg-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — story */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">About Us</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-ink leading-tight mb-4">
              Chennai's Most Trusted<br />
              <span className="gold-text">Freight Partner</span>
            </h2>
            <div className="gold-line max-w-[120px] mb-7" />

            <p className="text-ink-secondary leading-relaxed mb-5 text-[15px]">
              Navkar Impex is a premier customs broker and freight forwarder headquartered in Chennai,
              serving importers, exporters, and manufacturers across India. We specialise in sea freight,
              air freight, customs clearance, and door-to-door logistics.
            </p>
            <p className="text-ink-secondary leading-relaxed mb-8 text-[15px]">
              Our team of licensed CHAs, freight specialists, and logistics coordinators ensures your cargo
              moves efficiently through every port, checkpoint, and last-mile — on time, every time.
            </p>

            {/* Certifications */}
            <div className="space-y-2.5">
              {CERTIFICATIONS.map(c => (
                <div key={c} className="flex items-center gap-3 text-sm text-ink-secondary">
                  <div className="w-4 h-4 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ value, label, sub }) => (
              <div key={label}
                className="card-luxury p-7 text-center hover:border-gold/30 transition-all duration-300 group">
                <div className="font-display text-[2.8rem] font-light gold-text leading-none mb-2
                                group-hover:scale-105 transition-transform duration-300">
                  {value}
                </div>
                <div className="text-sm font-medium text-ink mb-1">{label}</div>
                <div className="text-xs text-ink-muted leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
