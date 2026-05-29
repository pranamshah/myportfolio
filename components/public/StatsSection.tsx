const WHY = [
  {
    title: "Full-Service Freight",
    desc: "We handle sea freight, air freight, and land transport — all under one roof, end to end.",
  },
  {
    title: "Real-Time Tracking",
    desc: "Live shipment status updates at every milestone through your secure client portal.",
  },
  {
    title: "Transparent Billing",
    desc: "Detailed invoices with itemised charges — no surprises, no hidden fees.",
  },
  {
    title: "Dedicated Support",
    desc: "One point of contact for all your logistics queries — always available when you need us.",
  },
];

export default function StatsSection() {
  return (
    <section id="about" className="py-24 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A452] mb-3">Why Choose Us</p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-light text-gray-900 mb-3">
            Your Freight, Handled<br />From Start to Finish
          </h2>
          <div className="w-10 h-px bg-[#C9A452] mx-auto mb-5" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Navkar Impex is a freight forwarding agency based in Chennai. We coordinate every step
            of your cargo's journey — from booking to final delivery — including customs, CHA, and documentation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY.map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
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
  );
}
