import Link from "next/link";
import { Ship, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  return (
    <footer className="bg-primary-deep text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-teal rounded-lg flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-heading font-bold text-lg">
                Navkar <span className="text-accent-teal">Exim</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted Clearing & Forwarding partner. Sea. Air. Door to Door.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {["Sea Freight (FCL/LCL)", "Air Freight", "Customs Coordination", "Door to Door", "Import Clearance", "Export Clearance"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="hover:text-accent-teal transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/track", label: "Track Shipment" },
                { href: "/quote", label: "Get a Quote" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/login", label: "Client Login" },
                { href: "/signup", label: "Register" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent-teal transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-accent-teal flex-shrink-0 mt-0.5" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 text-accent-teal flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-accent-teal transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-2">
                <Mail className="w-4 h-4 text-accent-teal flex-shrink-0" />
                <a href="mailto:info@navkarexim.com" className="hover:text-accent-teal transition-colors">info@navkarexim.com</a>
              </li>
              <li className="text-gray-500 text-xs mt-2">
                Mon–Sat: 9:00 AM – 7:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Navkar Exim. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-accent-teal transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-accent-teal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* WhatsApp float button */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 transition-all hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </footer>
  );
}
