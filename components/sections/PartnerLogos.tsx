const partners = [
  "Hapag-Lloyd",
  "CMA CGM",
  "MSC",
  "Apollo World Connect",
  "Sanco Trans",
  "Sakthi Trans",
  "Chennai Port Trust",
  "JNPT",
  "Air India Cargo",
  "IndiGo Cargo",
];

export function PartnerLogos() {
  return (
    <section className="py-16 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-text-secondary text-sm font-semibold uppercase tracking-wider">Our Network</span>
          <h2 className="text-2xl font-heading font-bold text-primary-deep mt-2">
            Trusted Partners & Shipping Lines
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map((p, i) => (
            <div
              key={i}
              className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-primary-deep font-semibold text-sm hover:border-accent-teal hover:text-accent-teal transition-colors"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
