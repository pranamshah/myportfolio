import Link from "next/link";
import { Anchor, Phone, Mail, MapPin } from "lucide-react";

const SERVICES_LINKS = ["Sea Freight", "Air Freight", "Customs Clearance", "Door-to-Door", "Warehousing", "Project Cargo"];
const PORTAL_LINKS = [
  { label: "Create Account", href: "/signup" },
  { label: "Login", href: "/login" },
  { label: "Track Shipment", href: "/login" },
  { label: "View Invoices", href: "/login" },
  { label: "Download Documents", href: "/login" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-surface-deep border-t border-surface-hover/60">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 border border-gold/40 rounded flex items-center justify-center
                              group-hover:border-gold/60 transition-colors">
                <Anchor size={16} className="text-gold" />
              </div>
              <span className="font-display text-xl font-light text-ink tracking-wide">
                Navkar <span className="text-gold">Impex</span>
              </span>
            </Link>

            <p className="text-ink-muted text-sm leading-relaxed max-w-sm mb-5">
              Chennai's trusted customs broker and freight forwarder since 2009. We move cargo
              across sea, air, and land — anywhere in the world.
            </p>

            {/* Contact mini-list */}
            <div className="space-y-2.5">
              {[
                { icon: Phone, text: "+91 98765 43210" },
                { icon: Mail, text: "info@navkarimpex.com" },
                { icon: MapPin, text: "Chennai, Tamil Nadu — 600 001" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-ink-muted">
                  <Icon size={13} className="text-gold/60 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-5">Our Services</h4>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map(s => (
                <li key={s}>
                  <a href="#services"
                    className="text-sm text-ink-secondary hover:text-gold transition-colors duration-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Portal */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-5">Client Portal</h4>
            <ul className="space-y-2.5">
              {PORTAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-sm text-ink-secondary hover:text-gold transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">Certifications</h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Licensed CHA · DGFT Registered<br />
                FIATA Member · ISO 9001:2015
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-6 opacity-30" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Navkar Impex. All rights reserved.</p>
          <p className="text-center">
            Freight Forwarding · Customs Clearance · Logistics · Chennai, India
          </p>
          <div className="flex gap-4">
            <span className="hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
