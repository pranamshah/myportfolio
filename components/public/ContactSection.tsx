import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

const CONTACT_ITEMS = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, label: "Email", value: "info@navkarimpex.com", href: "mailto:info@navkarimpex.com" },
  { icon: MapPin, label: "Office", value: "Chennai, Tamil Nadu — 600 001", href: undefined },
  { icon: MessageSquare, label: "WhatsApp", value: "+91 98765 43210", href: "https://wa.me/919876543210" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-28 bg-surface-deep relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Get In Touch</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-ink leading-tight mb-4">
              Let's Talk About<br />
              <span className="gold-text">Your Shipment</span>
            </h2>
            <div className="gold-line max-w-[120px] mb-8" />
            <p className="text-ink-secondary leading-relaxed mb-10 text-[15px]">
              Have a shipment to move or a question about our services? Our team of freight experts
              is ready to assist you within 2 hours.
            </p>

            <div className="space-y-5">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-gold/8 border border-gold/15 flex items-center
                                  justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted mb-0.5">{label}</div>
                    {href ? (
                      <a href={href}
                        className="text-sm text-ink-secondary hover:text-gold transition-colors">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-ink-secondary">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: contact form */}
          <div className="card-luxury p-8">
            <h3 className="font-display text-xl font-light text-ink mb-1">Send a Message</h3>
            <p className="text-ink-muted text-sm mb-6">We'll respond within 2 business hours.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Your Name</label>
                  <input className="input-luxury" placeholder="John Doe" />
                </div>
                <div>
                  <label className="label-luxury">Company</label>
                  <input className="input-luxury" placeholder="ACME Exports" />
                </div>
              </div>
              <div>
                <label className="label-luxury">Email Address</label>
                <input type="email" className="input-luxury" placeholder="you@company.com" />
              </div>
              <div>
                <label className="label-luxury">Phone Number</label>
                <input type="tel" className="input-luxury" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="label-luxury">Your Message</label>
                <textarea
                  className="input-luxury h-28 resize-none"
                  placeholder="Tell us about your shipment — origin, destination, cargo type..."
                />
              </div>
              <button className="btn-gold w-full py-3 text-base">
                Send Message →
              </button>
              <p className="text-xs text-ink-muted text-center">
                Or reach us instantly on{" "}
                <a href="https://wa.me/919876543210"
                  className="text-gold hover:text-gold-light">WhatsApp</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
