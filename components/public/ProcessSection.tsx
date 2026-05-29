const STEPS = [
  { n: "01", title: "Request a Quote", desc: "Share cargo details and get a competitive quote within 2 hours." },
  { n: "02", title: "Booking & Docs", desc: "We handle bookings, BL/AWB, and all customs documentation." },
  { n: "03", title: "Live Tracking", desc: "Monitor every milestone — vessel, port, customs — in your portal." },
  { n: "04", title: "Delivery", desc: "Expert clearance, duty coordination, and last-mile delivery." },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A452] mb-3">How It Works</p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-light text-gray-900 mb-3">
            Simple & Transparent
          </h2>
          <div className="w-10 h-px bg-[#C9A452] mx-auto" />
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="text-center group">
              <div className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center
                              justify-center mx-auto mb-5 group-hover:border-[#C9A452]/40 transition-colors">
                <span className="font-display text-xl font-light text-[#C9A452]">{n}</span>
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
