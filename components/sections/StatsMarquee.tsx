const stats = [
  "500+ Shipments Handled",
  "50+ Countries Served",
  "99% On-Time Clearance",
  "20+ Partner CHAs",
  "15+ Shipping Line Partners",
  "Chennai • Mumbai • Delhi",
  "ISO Compliant Processes",
  "Real-time Shipment Updates",
];

export function StatsMarquee() {
  return (
    <div className="bg-accent-teal py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stats, ...stats].map((stat, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-8 text-white font-semibold text-sm"
          >
            <span className="w-2 h-2 bg-white/60 rounded-full" />
            {stat}
          </span>
        ))}
      </div>
    </div>
  );
}
