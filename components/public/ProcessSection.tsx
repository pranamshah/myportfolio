const STEPS = [
  {
    step: "01",
    title: "Request a Quote",
    desc: "Share your cargo details — origin, destination, type, and volume. Receive a competitive quote within 2 hours.",
  },
  {
    step: "02",
    title: "Booking & Docs",
    desc: "We handle bookings, shipping instructions, BL/AWB preparation, and all export/import documentation.",
  },
  {
    step: "03",
    title: "Live Tracking",
    desc: "Monitor every milestone through your client portal — vessel movements, port arrival, customs status, and more.",
  },
  {
    step: "04",
    title: "Clearance & Delivery",
    desc: "Expert customs clearance, duty payment coordination, and final-mile delivery right to your door.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-28 bg-surface-primary relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">How It Works</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-ink mb-4">
            Simple. Transparent.<br />
            <span className="gold-text">Reliable.</span>
          </h2>
          <div className="gold-line max-w-[120px] mx-auto" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-9 left-[14%] right-[14%]
                          h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="relative text-center group">
              {/* Number circle */}
              <div className="w-[4.5rem] h-[4.5rem] rounded-full border-2 border-gold/25 flex items-center
                              justify-center mx-auto mb-6 bg-surface-deep relative z-10
                              group-hover:border-gold/60 transition-all duration-300">
                <span className="font-display text-2xl font-light gold-text">{step}</span>
              </div>

              <h3 className="font-display text-xl font-light text-ink mb-3">{title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
