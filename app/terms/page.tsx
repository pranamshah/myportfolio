import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

const LAST_UPDATED = "1 May 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 py-4"
        style={{
          backgroundColor: "rgba(249,249,249,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(198,198,205,0.3)",
        }}>
        <Link href="/" className="flex items-center gap-3">
          <NavkarLogo variant="symbol" symbolSize={40} />
          <NavkarLogo variant="wordmark" className="h-9 w-auto" />
        </Link>
        <Link
          href="/login"
          className="font-mono text-[11px] tracking-[0.1em] border border-outline px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300">
          LOGIN
        </Link>
      </nav>

      <main className="pt-40 pb-32 px-6 md:px-20 max-w-[860px] mx-auto">
        <span className="font-mono text-[11px] tracking-[0.2em] block mb-5" style={{ color: "#735c00" }}>
          LEGAL
        </span>
        <h1
          className="font-display text-primary mb-4"
          style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 600, lineHeight: "112%", letterSpacing: "-0.02em" }}>
          Terms of Service
        </h1>
        <p className="font-mono text-[11px] tracking-widest text-on-surface-variant/60 mb-16">
          LAST UPDATED: {LAST_UPDATED}
        </p>

        <div className="space-y-14 font-sans text-base leading-relaxed text-on-surface-variant">

          <Section title="1. Acceptance of Terms">
            By accessing or using the Navkar Impex platform (&quot;Platform&quot;), registering an account,
            or engaging our freight forwarding services, you (&quot;User&quot;) agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you do not agree, you must not use the Platform.
            These Terms govern both Client accounts (importers/exporters) and Business accounts
            (logistics partners and document management users).
          </Section>

          <Section title="2. Services Provided">
            Navkar Impex provides:
            <ul className="mt-4 space-y-3 list-none pl-0">
              {[
                "Sea freight forwarding (FCL and LCL) between India and international ports.",
                "Air freight services for time-sensitive cargo.",
                "Customs clearance and documentation assistance at Indian ports.",
                "Door-to-door logistics coordination.",
                "A digital portal for shipment tracking, invoice management, and document exchange.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Services are provided subject to availability, applicable regulations, and execution
              of a formal service agreement or purchase order.
            </p>
          </Section>

          <Section title="3. Account Registration">
            To use the Platform you must register with accurate and complete information. You are
            responsible for maintaining the confidentiality of your credentials and for all
            activity under your account. Navkar Impex reserves the right to suspend or terminate
            accounts that violate these Terms or provide false information.
          </Section>

          <Section title="4. User Obligations">
            <ul className="space-y-3 list-none pl-0">
              {[
                "Provide accurate cargo descriptions, declared values, and documentation as required by Indian Customs and destination country regulations.",
                "Comply with all applicable export control laws, trade sanctions, and embargoes.",
                "Not ship prohibited goods, hazardous materials without prior disclosure, or items banned under Indian EXIM policy.",
                "Pay all freight charges, duties, taxes, and ancillary fees within the agreed payment terms.",
                "Not misuse the Platform for unlawful purposes or attempt to gain unauthorised access to any system.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Freight Charges and Payment">
            Freight quotations are valid for 48 hours unless otherwise stated. Final charges are
            confirmed upon booking and are subject to surcharges (fuel, port congestion, currency
            adjustments) communicated at the time of booking. Payment is due within 7 days of
            invoice date unless a credit account has been established. Late payments attract
            interest at 2% per month on the outstanding balance.
          </Section>

          <Section title="6. Liability and Cargo Claims">
            <p className="mb-4">Navkar Impex acts as a freight forwarder and is not a carrier. Our liability for cargo
            loss or damage is limited to the lesser of:</p>
            <ul className="space-y-3 list-none pl-0 mb-4">
              <li className="flex gap-3"><span style={{ color: "#735c00", flexShrink: 0 }}>—</span><span>INR 5,000 per shipment, or</span></li>
              <li className="flex gap-3"><span style={{ color: "#735c00", flexShrink: 0 }}>—</span><span>The amount recoverable from the actual carrier under their bill of lading.</span></li>
            </ul>
            <p>
              Cargo insurance is strongly recommended. Claims must be submitted in writing within
              14 days of delivery (or expected delivery date for lost shipments).
            </p>
          </Section>

          <Section title="7. Transit Times and Delays">
            Transit times provided are estimates only and are not guaranteed. Navkar Impex is not
            liable for delays caused by customs examination, port congestion, force majeure events
            (including natural disasters, strikes, or pandemics), or carrier schedule changes.
          </Section>

          <Section title="8. Intellectual Property">
            All content on the Platform — including software, design, text, logos, and data — is
            the property of Navkar Impex or its licensors. You may not reproduce, modify,
            distribute, or create derivative works without prior written consent.
          </Section>

          <Section title="9. Indemnification">
            You agree to indemnify and hold Navkar Impex, its officers, employees, and agents
            harmless from any claims, losses, or expenses (including legal fees) arising from
            your breach of these Terms, your shipments, or your violation of any applicable law.
          </Section>

          <Section title="10. Termination">
            Either party may terminate the account relationship with 30 days&apos; written notice.
            Navkar Impex may terminate or suspend access immediately for material breach, fraud,
            or non-payment. Outstanding charges remain payable on termination.
          </Section>

          <Section title="11. Governing Law and Disputes">
            These Terms are governed by the laws of India. Any dispute shall first be
            attempted to be resolved by good-faith negotiation. If unresolved within 30 days,
            disputes shall be submitted to arbitration in Chennai under the Arbitration and
            Conciliation Act, 1996, with proceedings conducted in English.
          </Section>

          <Section title="12. Modifications">
            Navkar Impex may update these Terms at any time. Updated Terms are posted on this
            page with a revised &quot;Last Updated&quot; date and take effect 14 days after publication.
            Continued use of the Platform constitutes acceptance.
          </Section>

          <Section title="13. Contact">
            <p>For any questions regarding these Terms:</p>
            <div className="mt-4 p-6 border" style={{ borderColor: "rgba(198,198,205,0.5)", backgroundColor: "#f9f9f9" }}>
              <p className="font-sans font-semibold text-primary">Navkar Impex — Legal</p>
              <p>Anna Salai, Chennai — 600 002, India</p>
              <a href="mailto:legal@navkarimpex.com" className="text-primary underline underline-offset-4 decoration-1">
                legal@navkarimpex.com
              </a>
            </div>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 md:px-20 py-12" style={{ borderColor: "#c6c6cd", backgroundColor: "#f9f9f9" }}>
        <div className="max-w-[860px] mx-auto flex flex-col md:flex-row justify-between gap-6 items-center">
          <span className="font-mono text-[10px] tracking-widest text-on-surface-variant/50">
            © {new Date().getFullYear()} NAVKAR IMPEX. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8">
            <Link href="/privacy" className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              PRIVACY
            </Link>
            <Link href="/network" className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              NETWORK
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans font-bold text-primary text-lg mb-4" style={{ letterSpacing: "0.01em" }}>
        {title}
      </h2>
      <div className="font-sans text-base leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </div>
  );
}
