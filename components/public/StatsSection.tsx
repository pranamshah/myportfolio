const STATS = [
  { value: "500+", label: "Clients Served" },
  { value: "10,000+", label: "Shipments Delivered" },
  { value: "15+", label: "Years in Business" },
  { value: "50+", label: "Countries Covered" },
];

const WHY = [
  { title: "Licensed CHA", desc: "Customs House Agent certified for all import & export operations." },
  { title: "Real-Time Tracking", desc: "Live shipment status updates through your secure client portal." },
  { title: "Transparent Billing", desc: "Detailed invoices with itemised charges — no hidden fees." },
  { title: "Dedicated Support", desc: "A single point of contact for all your logistics queries." },
];

export default function StatsSection() {
  return (
    <>
      {/* Stats strip */}
      <section id="about" className="bg-gray-900 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-display font-light text-[#C9A452] mb-1">{value}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A452] mb-3">Why Choose Us</p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-light text-gray-900 mb-3">
              Chennai's Most Trusted<br />Freight Partner
            </h2>
            <div className="w-10 h-px bg-[#C9A452] mx-auto mb-5" />
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              Since 2009, Navkar Impex has been the preferred logistics partner for importers,
              exporters and manufacturers across India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-100
                                          hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-[#C9A452]/10 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#C9A452]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
