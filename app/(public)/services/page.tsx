import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Ship, Plane, FileCheck, Home, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

const services = [
  {
    icon: Ship,
    title: "Sea Freight",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    details: [
      { label: "FCL (Full Container Load)", desc: "20ft, 40ft, 40HC containers. Direct port-to-port or door-to-door." },
      { label: "LCL (Less than Container Load)", desc: "Consolidation services for smaller cargo volumes." },
      { label: "Port to Port", desc: "We handle booking, BL, documentation, and port charges." },
      { label: "Door to Door", desc: "Complete solution from supplier pickup to warehouse delivery." },
    ],
  },
  {
    icon: Plane,
    title: "Air Freight",
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    details: [
      { label: "Express Air Cargo", desc: "Priority shipments with fastest transit times." },
      { label: "Standard Air Freight", desc: "Cost-effective air solutions for general cargo." },
      { label: "Perishable Cargo", desc: "Temperature-controlled handling with proper AWB documentation." },
      { label: "Dangerous Goods", desc: "IATA-certified handling with proper documentation." },
    ],
  },
  {
    icon: FileCheck,
    title: "Customs Coordination",
    color: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-200",
    details: [
      { label: "CHA Liaison", desc: "We coordinate with experienced Customs House Agents on your behalf." },
      { label: "Document Assistance", desc: "Bill of Entry filing, packing list verification, invoice checking." },
      { label: "Duty Optimization", desc: "HS Code analysis and duty structure guidance." },
      { label: "Customs Examination", desc: "Managing RMS, Yellow, Red channel examinations." },
    ],
  },
  {
    icon: Home,
    title: "Door to Door",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    details: [
      { label: "Pickup from Supplier", desc: "Arrange transport from factory/warehouse to origin port." },
      { label: "Complete CFS Management", desc: "Gate-in, destuffing, customs scanning, storage management." },
      { label: "Last Mile Delivery", desc: "Transport from port/CFS to your final destination." },
      { label: "E-Way Bill & GST Compliance", desc: "Complete documentation for domestic movement post-clearance." },
    ],
  },
];

const faq = [
  {
    q: "What is the difference between a CHA and a C&F Agent?",
    a: "A CHA (Customs House Agent) is licensed to file bills of entry and interact directly with customs. A C&F (Clearing & Forwarding) Agent like Navkar Exim coordinates the entire logistics chain — engaging the right CHA, CFS, shipping line, and transporter on your behalf.",
  },
  {
    q: "How long does customs clearance take in Chennai?",
    a: "Typically 2–5 working days for RMS (green) channel clearances. Yellow or Red channel examinations may take 5–10 working days.",
  },
  {
    q: "Do you handle export shipments?",
    a: "Yes. We handle both import and export coordination — from export BL booking and documentation to coordinating with the exporting CHA and CFS.",
  },
  {
    q: "Which shipping lines do you work with?",
    a: "We work with Hapag-Lloyd, CMA CGM, MSC, ONE (Ocean Network Express), Evergreen, PIL, and several others depending on origin/destination.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-primary-deep py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">What We Offer</span>
            <h1 className="text-4xl font-heading font-bold text-white mt-3 mb-4">Our Services</h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Complete clearing and forwarding solutions for importers and exporters across India.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {services.map((svc, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-card border ${svc.border} overflow-hidden`}>
                <div className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 ${svc.bg} rounded-xl flex items-center justify-center`}>
                    <svc.icon className={`w-6 h-6 ${svc.color}`} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary-deep">{svc.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y divide-gray-100">
                  {svc.details.map((d, j) => (
                    <div key={j} className="p-5">
                      <h3 className={`font-semibold text-sm ${svc.color} mb-2`}>{d.label}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Chain Diagram */}
        <section className="py-16 bg-primary-ocean">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">How Your Cargo Moves</h2>
            <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-semibold">
              {["Your Company", "→", "Navkar Exim", "→", "CHA", "→", "CFS / Port", "→", "Shipping Line", "→", "Destination"].map((item, i) => (
                <span
                  key={i}
                  className={item === "→" ? "text-accent-gold text-lg" : "bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20"}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-primary-deep text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <details key={i} className="bg-neutral-light rounded-xl p-5 group">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-primary-deep list-none">
                    {f.q}
                    <ChevronDown className="w-5 h-5 text-accent-teal group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-text-secondary leading-relaxed text-sm">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
