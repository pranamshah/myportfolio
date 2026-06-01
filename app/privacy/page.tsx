import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

const LAST_UPDATED = "1 May 2026";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] tracking-widest text-on-surface-variant/60 mb-16">
          LAST UPDATED: {LAST_UPDATED}
        </p>

        <div className="space-y-14 font-sans text-base leading-relaxed text-on-surface-variant">

          <Section title="1. Overview">
            Navkar Impex (&quot;we&quot;, &quot;our&quot;, &quot;the Company&quot;) operates the freight forwarding and logistics
            management platform available at navkarimpex.com (&quot;Platform&quot;). This Privacy Policy
            explains how we collect, use, store, and protect personal data when you use our Platform
            or engage our services. By registering or using the Platform you consent to this Policy.
          </Section>

          <Section title="2. Information We Collect">
            <p className="mb-4">We collect the following categories of information:</p>
            <ul className="space-y-3 list-none pl-0">
              {[
                "Account details: full name, company name, email address, phone number, account type (Client / Business).",
                "Shipment data: cargo descriptions, consignee/shipper details, port information, bill of lading numbers, customs declarations.",
                "Financial data: invoice references and payment confirmations (no card numbers are stored on our servers).",
                "Usage data: pages visited, actions taken within the Portal, browser type, IP address, and session timestamps.",
                "Communications: support tickets, email correspondence, and chat messages.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="space-y-3 list-none pl-0">
              {[
                "To provide, operate, and improve the Platform and our logistics services.",
                "To process shipments, generate shipping documents, and communicate status updates.",
                "To send transactional emails (booking confirmations, invoices, tracking alerts).",
                "To comply with Indian customs regulations, EXIM policies, and applicable international law.",
                "To detect fraud and ensure the security of user accounts.",
                "To respond to support requests and feedback.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            We do not sell your personal data. We share information only with:
            <ul className="mt-4 space-y-3 list-none pl-0">
              {[
                "Shipping lines, airlines, and port authorities — to execute booked shipments.",
                "Customs and government authorities — as required by law (Indian Customs Act, EXIM regulations).",
                "Cloud infrastructure providers (server hosting, database, email delivery) — under confidentiality agreements.",
                "Payment processors — to collect freight charges; they operate under their own privacy policies.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Data Retention">
            Account data is retained for the duration of your relationship with Navkar Impex
            and for seven (7) years thereafter, as required by Indian tax and customs regulations.
            You may request deletion of non-statutory data at any time by emailing
            <a href="mailto:privacy@navkarimpex.com" className="text-primary underline underline-offset-4 decoration-1 mx-1">
              privacy@navkarimpex.com
            </a>.
          </Section>

          <Section title="6. Data Security">
            We implement industry-standard security measures including TLS encryption in transit,
            hashed password storage (bcrypt), role-based access controls, and regular security
            audits. No system is completely secure; we will notify affected users of any
            confirmed data breach within 72 hours.
          </Section>

          <Section title="7. Your Rights">
            Depending on your jurisdiction, you may have the right to:
            <ul className="mt-4 space-y-3 list-none pl-0">
              {[
                "Access a copy of your personal data.",
                "Correct inaccurate or incomplete data.",
                "Request erasure of data we are not legally obligated to retain.",
                "Object to or restrict certain processing activities.",
                "Data portability — receive your data in a machine-readable format.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "#735c00", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any right, email{" "}
              <a href="mailto:privacy@navkarimpex.com" className="text-primary underline underline-offset-4 decoration-1">
                privacy@navkarimpex.com
              </a>.
            </p>
          </Section>

          <Section title="8. Cookies">
            We use strictly necessary cookies for authentication sessions and optional analytics
            cookies (first-party only) to understand how users navigate the Platform. You may
            disable cookies in your browser settings; doing so will prevent login functionality.
          </Section>

          <Section title="9. International Transfers">
            Data may be transferred to servers located outside India. We ensure adequate
            safeguards (standard contractual clauses or equivalent) are in place for any
            cross-border transfer.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Policy periodically. Changes become effective 14 days after
            publication on this page. Your continued use of the Platform after that date
            constitutes acceptance of the revised Policy.
          </Section>

          <Section title="11. Contact">
            <p>For privacy-related queries:</p>
            <div className="mt-4 p-6 border" style={{ borderColor: "rgba(198,198,205,0.5)", backgroundColor: "#f9f9f9" }}>
              <p className="font-sans font-semibold text-primary">Navkar Impex — Privacy Officer</p>
              <p>Anna Salai, Chennai — 600 002, India</p>
              <a href="mailto:privacy@navkarimpex.com" className="text-primary underline underline-offset-4 decoration-1">
                privacy@navkarimpex.com
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
            <Link href="/terms" className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              TERMS
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
