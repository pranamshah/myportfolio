/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAy3bytRSP7ozBY9rEu_eYKNU_OiD1oc0IOqgfh2_9HtAbAKeEcXJDYpvefbYf3suZ_NV8s5IA4ah9qioJDuA84JtS---v8W6kLUD3BmTYzHzf8soyFnGJghjnOHJkwJ_HMVXN2ihnuDzZvrA8jevPezI-A4w37ytMltRGxzTjYrsPXPWubpeAVPdQm2i0t2HR27a3VvRoWjtHttC5jl4byhFe5Lvcxs2MmK43GOqPLeizv1FO3MhNPnElTlwV1HqCgKRK4YG6QNg";

const PHILOSOPHY = [
  {
    label: "01. INVISIBLE ARCHITECTURE",
    text: "Logistics should be felt, never seen. We build the invisible infrastructure that allows global trade to flow without friction. Our systems are designed to be as elegant as they are unshakeable.",
  },
  {
    label: "02. RADICAL TRANSPARENCY",
    text: "In an industry defined by complexity, we choose clarity. Every milestone, every movement, and every cost is laid bare through our proprietary tracking ecosystem.",
  },
  {
    label: "03. BEYOND THE GRID",
    text: "Standard routes are for standard businesses. Navkar Impex pioneers bespoke freight corridors that bypass traditional bottlenecks, leveraging our global network for extreme speed.",
  },
];

export const metadata = { title: "About — Navkar Impex" };

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen">
      <PublicNav />

      <main className="pt-32">

        {/* Hero */}
        <section className="px-5 md:px-20 max-w-[1440px] mx-auto mb-40 relative">
          <div className="absolute -top-20 -left-10 select-none pointer-events-none font-display leading-none z-0"
            style={{ fontSize: "200px", opacity: 0.02, fontWeight: 700 }}>PRECISION</div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-[11px] tracking-widest mb-6 flex items-center gap-2" style={{ color: "#735c00" }}>
                <span className="w-12 h-px inline-block" style={{ backgroundColor: "#735c00" }} />
                GLOBAL LOGISTICS REDEFINED
              </p>
              <h1 className="font-display text-on-surface leading-none mb-12"
                style={{ fontSize: "clamp(60px, 8vw, 120px)", fontWeight: 600, letterSpacing: "-0.04em" }}>
                Surgical<br />Precision.
              </h1>
              <p className="font-sans text-on-surface-variant text-lg max-w-xl leading-relaxed">
                Navkar Impex operates at the intersection of raw industrial power and surgical logistical accuracy. We don&apos;t just move freight — we orchestrate global movement with zero margin for error.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <div className="w-full aspect-[3/4] border border-outline-variant overflow-hidden relative group">
                <img src={HERO_IMG} alt="Navkar Impex — Precision in Logistics"
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-40 mb-40" style={{ backgroundColor: "#f3f3f4" }}>
          <div className="px-5 md:px-20 max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h2 className="font-display text-on-surface sticky top-40"
                  style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                  Our<br />Philosophy
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-24">
                {PHILOSOPHY.map(item => (
                  <div key={item.label} className="border-l-2 border-outline-variant pl-8">
                    <span className="font-mono text-[11px] tracking-widest block mb-4" style={{ color: "#735c00" }}>
                      {item.label}
                    </span>
                    <p className="font-sans text-on-surface text-lg leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Established */}
        <section className="px-5 md:px-20 max-w-[1440px] mx-auto mb-40">
          <div className="border-y border-outline-variant py-32 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="font-display text-on-surface mb-4 italic"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                Established 2026
              </h2>
              <p className="font-sans text-on-surface-variant text-base leading-relaxed max-w-prose">
                Born from the necessity of modern speed. Navkar Impex was founded to challenge the lethargy of legacy logistics. We are a new breed of freight forwarding, built for a fast-moving global economy — headquartered in Chennai, reaching every corner of the world.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-end">
              <div className="text-right">
                <div className="font-display leading-none" style={{ fontSize: "80px", fontWeight: 700, color: "#735c00", opacity: 0.2 }}>
                  2026
                </div>
                <p className="font-mono text-[11px] tracking-widest text-primary uppercase">The Year of Disruption</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-5 md:px-20 max-w-[1440px] mx-auto mb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-l border-t border-outline-variant/30">
            {[
              { stat: "40+",    label: "Countries Served" },
              { stat: "120+",   label: "Shipping Lanes" },
              { stat: "5",      label: "Continents Active" },
              { stat: "98.4%",  label: "On-Time Delivery" },
            ].map(item => (
              <div key={item.stat}
                className="border-r border-b border-outline-variant/30 p-12 hover:bg-secondary/5 transition-colors">
                <p className="font-display text-on-surface mb-2"
                  style={{ fontSize: "48px", fontWeight: 600, color: "#735c00" }}>
                  {item.stat}
                </p>
                <p className="font-mono text-[11px] tracking-widest text-on-surface-variant uppercase">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Offices */}
        <section className="py-40 px-5 md:px-20 max-w-[1440px] mx-auto mb-20">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <h2 className="font-display text-on-surface"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Our Presence
            </h2>
            <div className="hidden md:block w-32 h-px" style={{ backgroundColor: "#fed65b" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: "Chennai", role: "HEADQUARTERS", detail: "No. 7 Customs Road, George Town, Chennai 600001, Tamil Nadu, India" },
              { city: "Mumbai", role: "WEST INDIA", detail: "Freight Hub — JNPT Operations Office, Navi Mumbai 400703" },
              { city: "Dubai", role: "UAE OFFICE", detail: "Jebel Ali Free Zone, Dubai, United Arab Emirates" },
            ].map(office => (
              <div key={office.city}
                className="border border-outline-variant/30 p-10 hover:border-secondary transition-colors duration-300 group">
                <span className="font-mono text-[10px] tracking-widest text-outline block mb-4">{office.role}</span>
                <h3 className="font-sans font-bold text-3xl text-on-surface mb-4 group-hover:italic transition-all">{office.city}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{office.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 md:px-20 max-w-[1440px] mx-auto mb-40 text-center">
          <div className="bg-primary py-32 px-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center pointer-events-none select-none">
              <span className="font-display text-white leading-none" style={{ fontSize: "300px", fontWeight: 700 }}>NAV</span>
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-white mb-8"
                style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                Ready for Precision?
              </h2>
              <p className="font-sans text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience logistics handled with the finesse your cargo deserves. Join the network that redefines global movement.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <Link href="/signup"
                  className="font-mono text-[11px] tracking-widest px-12 py-5 hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#735c00", color: "#ffffff" }}>
                  START SHIPPING
                </Link>
                <a href="mailto:navkarimpex.co@gmail.com"
                  className="border border-white text-white font-mono text-[11px] tracking-widest px-12 py-5 hover:bg-white hover:text-primary transition-colors">
                  CONTACT SALES
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
