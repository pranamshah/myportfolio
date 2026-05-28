import Link from "next/link";
import { Ship, Plane, FileCheck, Home } from "lucide-react";

const services = [
  {
    icon: Ship,
    title: "Sea Freight",
    desc: "FCL & LCL shipping, port to port and door to door. All major shipping lines.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Plane,
    title: "Air Freight",
    desc: "Express and standard air cargo. Perishables, time-sensitive goods.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: FileCheck,
    title: "Customs Coordination",
    desc: "CHA liaison, documentation assistance, BE filing, duty optimization.",
    color: "text-accent-teal",
    bg: "bg-teal-50",
  },
  {
    icon: Home,
    title: "Door to Door",
    desc: "Pickup from supplier to last-mile delivery at your warehouse.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

export function ServicesStrip() {
  return (
    <section className="py-20 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">What We Do</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-deep mt-2">
            End-to-End Logistics Services
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            From booking to delivery — we handle every step of your shipment with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 ${svc.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svc.icon className={`w-6 h-6 ${svc.color}`} />
              </div>
              <h3 className="font-heading font-bold text-primary-deep text-lg mb-2">{svc.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="btn-secondary inline-flex">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
