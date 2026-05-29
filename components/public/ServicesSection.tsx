import { Ship, Plane, FileCheck, Package, Warehouse, BarChart2 } from "lucide-react";

const SERVICES = [
  {
    icon: Ship,
    title: "Sea Freight",
    desc: "FCL & LCL shipments across all major global ports. Competitive rates with real-time cargo tracking and documentation support.",
    tag: "Import · Export",
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: Plane,
    title: "Air Freight",
    desc: "Express and deferred air cargo solutions for time-sensitive and high-value shipments worldwide. IATA certified handling.",
    tag: "Express · Deferred",
    color: "text-sky-400",
    bg: "bg-sky-900/20",
    border: "group-hover:border-sky-500/30",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    desc: "Expert CHA services — complete documentation, duty calculation, compliance filing, and seamless port clearance.",
    tag: "Import · Export · Transit",
    color: "text-gold",
    bg: "bg-gold/10",
    border: "group-hover:border-gold/30",
  },
  {
    icon: Package,
    title: "Door-to-Door",
    desc: "End-to-end logistics from origin to final destination. Inland transportation, last-mile delivery, and status updates throughout.",
    tag: "Nationwide Delivery",
    color: "text-emerald-400",
    bg: "bg-emerald-900/20",
    border: "group-hover:border-emerald-500/30",
  },
  {
    icon: Warehouse,
    title: "Warehousing & CFS",
    desc: "CFS-linked warehousing, bonded storage, container freight station services, and cargo consolidation in Chennai.",
    tag: "CFS · Bonded Storage",
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    border: "group-hover:border-purple-500/30",
  },
  {
    icon: BarChart2,
    title: "Project Cargo",
    desc: "Heavy lift and over-dimensional cargo solutions with specialized equipment, route surveys, and multi-modal planning.",
    tag: "ODC · Heavy Lift",
    color: "text-orange-400",
    bg: "bg-orange-900/20",
    border: "group-hover:border-orange-500/30",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-28 bg-surface-primary relative">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">What We Offer</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-ink leading-tight mb-4">
            Comprehensive Logistics<br />
            <span className="gold-text">Solutions</span>
          </h2>
          <div className="gold-line max-w-[120px] mb-5" />
          <p className="text-ink-secondary leading-relaxed">
            From booking to delivery, we handle every stage of your cargo's journey with precision,
            transparency, and care.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc, tag, color, bg, border }) => (
            <div
              key={title}
              className={`card-luxury p-7 transition-all duration-300 group cursor-default ${border}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-5
                              group-hover:scale-105 transition-transform duration-300`}>
                <Icon size={22} className={color} />
              </div>

              {/* Tag */}
              <div className={`text-[10px] uppercase tracking-widest mb-2 ${color} opacity-70`}>{tag}</div>

              <h3 className="font-display text-xl font-light text-ink mb-2">{title}</h3>
              <div className="gold-line mb-4 opacity-40 transition-opacity group-hover:opacity-70" />
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
