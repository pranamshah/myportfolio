/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const CONTAINERS_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBEcjFA5FCpw3uzdG9eQCN_Wsh7PDaETZ7sJ63j-ID1rPk4icb2XQ2XUz43diWexqIGG2_o5PsTCftG0ego4NM4ro-7PB53CgG8rT6KvaEQUtlAg-AsgilF5mW39vNbi2upNC-PYv6QIhX55NRGoj-YGGS9SGrC59MUCjpsI-2MAp_eJAYBD0FAEVMEuqL3sxAKsgskSweH5mf3pE3jKvoKRidGDVlJNSgGuVIwXwFeSM65_WcxHfP7RX-cS8DOo3HfEC9fqvSPqg";

const SERVICES_ADM = [
  { no: "01", title: "Digital Customs Entry (BE Filing)" },
  { no: "02", title: "ITC HS Classification" },
  { no: "03", title: "ICEGATE Integration & Filing" },
  { no: "04", title: "Duty Drawback Claims" },
];

const SERVICES_ADV = [
  { no: "05", title: "Bond Underwriting" },
  { no: "06", title: "Risk Mitigation & Examination Handling" },
  { no: "07", title: "IEC & AD Code Registration" },
  { no: "08", title: "GST Refund Assistance" },
];

export const metadata = { title: "Customs Clearance — Navkar Impex" };

export default function CustomsPage() {
  return (
    <div className="bg-surface min-h-screen">
      <PublicNav />

      <main className="pt-24">

        {/* Hero */}
        <section className="relative min-h-[680px] flex items-center px-5 md:px-20 overflow-hidden">
          <div className="z-10 max-w-4xl">
            <span className="font-mono text-[11px] tracking-widest text-secondary uppercase block mb-6">Surgical Accuracy</span>
            <h1 className="font-display text-on-surface mb-8 leading-none"
              style={{ fontSize: "clamp(48px, 7vw, 100px)", fontWeight: 600, letterSpacing: "-0.04em" }}>
              Precision Customs<br />
              <em style={{ color: "#735c00", fontStyle: "italic" }}>Brokerage</em>
            </h1>
            <p className="font-sans text-on-surface-variant text-lg max-w-xl mb-12 leading-relaxed">
              Navigating the friction of international trade with microscopic detail. We architect compliance frameworks that turn regulatory hurdles into competitive advantages.
            </p>
            <div className="flex flex-wrap gap-8">
              <Link href="/signup"
                className="bg-primary text-white font-mono text-[11px] tracking-widest px-12 py-4 hover:opacity-90 transition-opacity">
                CONSULT AN AGENT
              </Link>
              <a href="#services"
                className="border border-outline font-mono text-[11px] tracking-widest px-12 py-4 hover:bg-surface-container transition-all">
                VIEW PROTOCOLS
              </a>
            </div>
          </div>
          {/* Watermark */}
          <div className="absolute -bottom-10 -left-10 select-none pointer-events-none font-display leading-none opacity-[0.04]"
            style={{ fontSize: "220px", fontWeight: 700 }}>COMPLIANCE</div>
        </section>

        {/* Bento value props */}
        <section id="services" className="px-5 md:px-20 py-20" style={{ backgroundColor: "#f3f3f4" }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-white p-12 border border-outline-variant/30 flex flex-col justify-between group overflow-hidden relative hover:-translate-y-1 transition-transform duration-300">
              <div className="z-10">
                <span className="font-mono text-[11px] tracking-widest text-secondary block mb-4">CORE FRAMEWORK</span>
                <h2 className="font-display text-on-surface mb-6"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                  Compliance Architecture
                </h2>
                <p className="font-sans text-on-surface-variant text-lg max-w-lg leading-relaxed">
                  Our system aligns your supply chain with current CBIC regulations, ensuring zero-delay customs clearing and absolute legal transparency across all Indian ports.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-2 group-hover:gap-4 transition-all font-mono text-[11px] tracking-widest font-bold">
                <span>EXPLORE THE ARCHITECTURE</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
              <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: "300px" }}>verified_user</span>
              </div>
            </div>
            <div className="md:col-span-4 bg-primary text-white p-12 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div>
                <span className="font-mono text-[11px] tracking-widest block mb-4" style={{ color: "#fed65b" }}>FISCAL EFFICIENCY</span>
                <h3 className="font-sans font-bold text-2xl mb-4">Tax &amp; Duty Optimisation</h3>
              </div>
              <p className="font-sans text-sm opacity-80 leading-relaxed">
                Identifying legitimate duty drawbacks and tariff reclassifications to recover hidden capital in your existing trade routes.
              </p>
              <div className="pt-8 border-t border-white/20 mt-8">
                <div className="font-display font-bold" style={{ fontSize: "48px", color: "#fed65b" }}>12.4%</div>
                <div className="font-mono text-[10px] tracking-widest opacity-60">AVERAGE CLIENT SAVINGS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services list */}
        <section className="px-5 md:px-20 py-40 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h4 className="font-display text-on-surface mb-10"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Administrative Precision
            </h4>
            <div className="space-y-0">
              {SERVICES_ADM.map(s => (
                <div key={s.no}
                  className="group border-b border-outline-variant py-8 flex justify-between items-center hover:bg-surface-container-lowest px-4 transition-colors cursor-pointer">
                  <div>
                    <span className="font-mono text-[10px] text-outline block mb-1">{s.no}</span>
                    <span className="font-sans font-bold text-xl group-hover:italic transition-all">{s.title}</span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-[20px]">north_east</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-on-surface mb-10"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Advisory Services
            </h4>
            <div className="space-y-0 relative mt-0 md:mt-20">
              {SERVICES_ADV.map(s => (
                <div key={s.no}
                  className="group border-b border-outline-variant py-8 flex justify-between items-center hover:bg-surface-container-lowest px-4 transition-colors cursor-pointer">
                  <div>
                    <span className="font-mono text-[10px] text-outline block mb-1">{s.no}</span>
                    <span className="font-sans font-bold text-xl group-hover:italic transition-all">{s.title}</span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-[20px]">north_east</span>
                </div>
              ))}
              {/* Image overlay */}
              <div className="absolute -top-12 -left-12 hidden md:block z-10">
                <div className="relative w-64">
                  <img src={CONTAINERS_IMG} alt="Containers in port"
                    className="w-full h-48 object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute -top-4 -left-4 p-6" style={{ backgroundColor: "#735c00" }}>
                    <p className="font-mono text-[10px] text-white mb-1">LOGISTICS INSIGHT</p>
                    <p className="font-sans text-sm text-white italic leading-tight">&ldquo;Compliance is not a checkbox. It is the engine of speed.&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 md:px-20 py-40 text-center relative overflow-hidden" style={{ backgroundColor: "#f3f3f4" }}>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-display text-on-surface mb-12"
              style={{ fontSize: "clamp(40px, 5vw, 80px)", fontWeight: 600, letterSpacing: "-0.04em" }}>
              Ready for a Protocol Upgrade?
            </h2>
            <div className="inline-flex flex-col md:flex-row gap-8 w-full md:w-auto">
              <Link href="/signup"
                className="bg-primary text-white font-mono text-[11px] tracking-widest px-16 py-6 hover:opacity-90 transition-opacity block text-center">
                REQUEST AN AUDIT
              </Link>
              <a href="mailto:navkarimpex.co@gmail.com"
                className="border border-primary text-primary font-mono text-[11px] tracking-widest px-16 py-6 hover:bg-primary hover:text-white transition-all block text-center">
                SPEAK TO SPECIALIST
              </a>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
