import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ravi Kumar",
    company: "Swasthik Impex, Chennai",
    text: "Navkar Exim handled our entire import clearance process seamlessly. BL to delivery in record time, and the portal kept us informed at every step.",
    rating: 5,
  },
  {
    name: "Priya Sundaram",
    company: "Chennai Auto Parts Pvt Ltd",
    text: "Exceptional service for our FCL imports from Germany. Their documentation management is flawless — no more chasing papers.",
    rating: 5,
  },
  {
    name: "Mohammed Farhan",
    company: "Gulf Spices Export",
    text: "We trust Navkar Exim for all our export documentation. Professional, always reachable on WhatsApp, and zero errors.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Client Stories</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-deep mt-2">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-neutral-light rounded-2xl p-6 hover:shadow-card transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                ))}
              </div>
              <p className="text-text-primary leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-primary-deep">{t.name}</p>
                <p className="text-text-secondary text-sm">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
