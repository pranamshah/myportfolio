const SERVICES = [
  {
    icon: "🚢",
    title: "Sea Freight",
    desc: "FCL & LCL shipments across all major global ports. Competitive rates with full documentation support.",
  },
  {
    icon: "✈️",
    title: "Air Freight",
    desc: "Express and deferred air cargo for time-critical shipments. IATA certified handling worldwide.",
  },
  {
    icon: "📋",
    title: "Customs Clearance",
    desc: "Licensed CHA services — complete documentation, duty calculation, and seamless port clearance.",
  },
  {
    icon: "📦",
    title: "Door-to-Door",
    desc: "End-to-end logistics from origin to doorstep. Inland transport, last-mile delivery, live status.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A452] mb-3">Services</p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-light text-gray-900 mb-3">
            Everything Your Cargo Needs
          </h2>
          <div className="w-10 h-px bg-[#C9A452] mx-auto" />
        </div>

        {/* 4-card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-[#FAFAF8] rounded-xl p-6 border border-gray-100 hover:border-[#C9A452]/30
                         hover:shadow-md transition-all duration-200 cursor-default group">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
              <div className="w-6 h-px bg-[#C9A452] mb-3 group-hover:w-10 transition-all duration-300" />
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
