import { Users, Building2, Ship, Bell, FolderOpen, User } from "lucide-react";

const reasons = [
  {
    icon: Users,
    title: "CHA Network",
    desc: "Tied up with 20+ experienced Customs House Agents across all major ports.",
  },
  {
    icon: Building2,
    title: "CFS Connections",
    desc: "Direct relationships with top Container Freight Stations for faster turnaround.",
  },
  {
    icon: Ship,
    title: "Shipping Line Tie-ups",
    desc: "Partnerships with Hapag-Lloyd, CMA CGM, MSC, and more for competitive rates.",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    desc: "Track your shipment at every stage via our portal, WhatsApp, or email.",
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    desc: "All your BLs, BEs, invoices, and gatepasses stored securely and accessible anytime.",
  },
  {
    icon: User,
    title: "Personal Agent",
    desc: "One dedicated point of contact who knows your business and cargo requirements.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Why Navkar Exim</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-deep mt-2">
            The Navkar Exim Advantage
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            We are your coordination layer — so you never have to chase shipping lines, CHAs, or CFS stations again.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl hover:bg-neutral-light transition-colors">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <r.icon className="w-6 h-6 text-accent-teal" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary-deep mb-1">{r.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
