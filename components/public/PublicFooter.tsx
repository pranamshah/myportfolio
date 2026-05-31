import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

export default function PublicFooter() {
  return (
    <footer className="bg-surface border-t border-outline-variant">

      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 mb-16">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <NavkarLogo variant="symbol" symbolSize={40} />
              <NavkarLogo variant="wordmark" className="h-9 w-auto" />
            </div>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs mb-4">
              Chennai-based freight forwarding agency. Sea freight, air freight, customs clearance
              and door-to-door delivery for importers and exporters across India.
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-on-surface-variant/60 uppercase">
              Freight Forwarding · Chennai, India
            </p>
          </div>

          {/* Operations */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="font-mono text-[11px] tracking-[0.12em] font-bold text-on-surface mb-5 uppercase">Operations</p>
            <ul className="space-y-3">
              {["Sea Freight", "Air Freight", "Customs Clearance", "Door-to-Door", "Warehousing"].map(s => (
                <li key={s}>
                  <a href="#services" className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant hover:text-secondary transition-colors uppercase">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal */}
          <div className="md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.12em] font-bold text-on-surface mb-5 uppercase">Portal</p>
            <ul className="space-y-3">
              {[
                { label: "Create Account", href: "/signup" },
                { label: "Login", href: "/login" },
                { label: "Track Shipment", href: "/login" },
                { label: "View Invoices", href: "/login" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant hover:text-secondary transition-colors uppercase">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.12em] font-bold text-on-surface mb-5 uppercase">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919080767398" className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant hover:text-secondary transition-colors">
                  +91 90807 67398
                </a>
              </li>
              <li>
                <a href="mailto:navkarimpex.co@gmail.com" className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant hover:text-secondary transition-colors break-all">
                  navkarimpex.co@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/919080767398" target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.08em] text-secondary hover:underline transition-colors uppercase">
                  WhatsApp →
                </a>
              </li>
              <li className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant/60">
                Chennai, Tamil Nadu
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-on-surface-variant/50 uppercase">
            © {new Date().getFullYear()} Navkar Impex · Logistics Redefined
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-on-surface-variant/40 uppercase">
            Sea Freight · Air Freight · Customs · Chennai
          </p>
        </div>
      </div>

    </footer>
  );
}
