import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Navkar Impex</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-4">
              Chennai's trusted customs broker and freight forwarder since 2009. Moving cargo across
              sea, air and land — anywhere in the world.
            </p>
            <p className="text-xs text-gray-400">
              Licensed CHA · DGFT Registered · FIATA Member
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Sea Freight", "Air Freight", "Customs Clearance", "Door-to-Door", "Warehousing"].map(s => (
                <li key={s}>
                  <a href="#services" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Portal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Create Account", href: "/signup" },
                { label: "Login", href: "/login" },
                { label: "Track Shipment", href: "/login" },
                { label: "View Invoices", href: "/login" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1.5">
              <p className="text-xs text-gray-400">📞 +91 98765 43210</p>
              <p className="text-xs text-gray-400">✉️ info@navkarimpex.com</p>
              <p className="text-xs text-gray-400">📍 Chennai, Tamil Nadu</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Navkar Impex. All rights reserved.</p>
          <p>Freight Forwarding · Customs Clearance · Chennai, India</p>
        </div>
      </div>
    </footer>
  );
}
