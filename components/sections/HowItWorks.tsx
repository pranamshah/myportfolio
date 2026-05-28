const steps = [
  {
    num: "01",
    title: "Request a Quote",
    desc: "Share your shipment details — origin, destination, cargo type, and weight. We respond within 2 hours.",
  },
  {
    num: "02",
    title: "We Coordinate",
    desc: "Our team books with the right CHA, CFS, and shipping line. You get real-time updates throughout.",
  },
  {
    num: "03",
    title: "Door-to-Door Delivery",
    desc: "From port clearance to last-mile delivery — track every step on your client portal.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-primary-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-2">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-accent-teal to-accent-gold" style={{ width: "34%", left: "33%" }} />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-full bg-accent-teal/20 border-2 border-accent-teal flex items-center justify-center mb-5 relative z-10">
                <span className="text-accent-teal font-heading font-bold text-xl">{step.num}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
