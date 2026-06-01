/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBOWUNg4gfFC7CfoJ67-on9sCPY9mB8GER9Fu5b0a_ZwIHThHtCU8EH95zI0WWrt9Y1-4DM06iFlecjT59EihpEmRn7QKvPWtP-A-xyQVJYSlZ8Eol1vHTkHTY5e_O9lPUQQ0SaUl7QXUXcoPnnuWCJJQVW2hcbSIGKXKmLoWWAMhAqhbk6iu5dsR2NRWNBHWfBjKqP0gqqUspuw2L8_CDORRuzQSFo05c26i0wm5hqa1GvP0DamfiMCZFvXuG9opqFHIxjZsPs0g";
const STACK_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAEd_JaYE_lx3vPu7S8Nrbxl_YFo5qG1zFU-2I6QAWIYIJSw2EOnG2qTPwP7zWlmEX0s3K5XEelLlYruTOFUWiNs6xXSZms-4W9p2hl4ehg_sdVff3g_infB9YzBpOp2Cl34gNqZzd7E-s6V1XOZC6Ikbe9NlO4BTYFAWUuszJiVPacx29LPb2Rq2D_IpBz8Bo9uobxWAPoherKVXvbTxozgdciO4bJW2r45xjGxGE1H9ym64gpRomS3u0-V73B0Fnrgn0i5Bw";
const MAP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBibzptQ7JAxyrOYInUACDi4chhLcA9Oj81FLOcSlGijbN6_HatEWcIju9hWpvxBAORvwqXq09MMlVRefVZes3j5feBsGdqwdjFLo1gisJEzRJ7_1aYzVBMxibe1MUDwGVXz-lzG3u7QcjHPNYjQ9QHSr5y4oVAinS7Ra3mLF-tDTTm4e-84QLboyuB1SC7g4XtvVCZditPzzPh10AY_RWB4zHc9sS7QSlSpilvSPL7g060Ock1NDf-Xvxjj1-jhdworXAGQed_Ww";

const PORTS = [
  { region: "REGION 01", name: "Rotterdam",       role: "PRIMARY HUB" },
  { region: "REGION 02", name: "Singapore",        role: "GLOBAL FEEDER" },
  { region: "REGION 03", name: "Dubai (Jebel Ali)",role: "CENTRAL LINK" },
  { region: "REGION 04", name: "Antwerp",          role: "EUROPE GATEWAY" },
  { region: "REGION 05", name: "Hamburg",          role: "NORTH EUROPE" },
  { region: "REGION 06", name: "Chennai",          role: "INDIA GATEWAY" },
  { region: "REGION 07", name: "Mumbai (JNPT)",    role: "VOLUME LEADER" },
  { region: "REGION 08", name: "Colombo",          role: "TRANSSHIPMENT" },
];

export const metadata = { title: "Sea Freight — Navkar Impex" };

export default function SeaFreightPage() {
  return (
    <div className="bg-surface min-h-screen">
      <PublicNav />

      <main className="relative pt-28">
        {/* Watermark */}
        <div className="absolute top-40 left-10 select-none pointer-events-none font-display text-on-surface leading-none z-0"
          style={{ fontSize: "280px", opacity: 0.02, fontWeight: 700, letterSpacing: "-0.04em" }}>
          MARITIME
        </div>

        {/* Hero */}
        <section className="px-5 md:px-20 mb-40 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-12">
          <div className="md:col-span-7">
            <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase block mb-6">Sea Logistics</span>
            <h1 className="font-display text-on-surface mb-8 max-w-2xl"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Surgical Precision in{" "}
              <em className="not-italic" style={{ color: "#735c00" }}>Global Logistics</em>
            </h1>
            <p className="font-sans text-on-surface-variant text-lg max-w-xl mb-12 leading-relaxed">
              We bridge continents through high-frequency ocean routes. Navkar Impex redefines the standard for maritime reliability with real-time transparency and avant-garde operational efficiency.
            </p>
            <div className="flex gap-8 flex-wrap items-center">
              <Link href="/signup"
                className="bg-primary text-white font-mono text-[11px] tracking-widest px-12 py-4 hover:opacity-80 transition-opacity">
                GET QUOTE
              </Link>
              <a href="#solutions" className="font-mono text-[11px] tracking-widest flex items-center gap-2 transition-colors"
                style={{ color: "#735c00" }}>
                EXPLORE SERVICES <span className="material-symbols-outlined text-[16px]">north_east</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden border border-outline-variant/30">
              <img src={HERO_IMG} alt="Container vessel at sea"
                className="w-full h-full object-cover grayscale opacity-80 hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-8 -left-12 bg-surface p-6 border border-outline-variant/30 max-w-[240px] hidden md:block">
              <span className="font-mono text-[10px] uppercase text-outline block mb-2">Technical Specs</span>
              <p className="font-mono text-[11px] leading-tight">Vessel capacity: 24,000 TEU optimised for trans-oceanic routes.</p>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="py-40 px-5 md:px-20 relative overflow-hidden"
          style={{ backgroundColor: "#f3f3f4" }}>
          <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
            <div className="max-w-xl">
              <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase block mb-4">01 / Logistics</span>
              <h2 className="font-display text-on-surface"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                Global Sea Freight Solutions
              </h2>
            </div>
            <p className="font-sans text-on-surface-variant max-w-md text-base leading-relaxed">
              Our network covers over 40+ countries, providing a seamless arterial system for your cargo. We move weight with the lightness of modern digital systems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "public",    title: "Trans-Continental",  desc: "Dedicated routes for high-volume trade between Asia, Europe, and the Middle East.", tag: "FREQ: WEEKLY DEPARTURES" },
              { icon: "security",  title: "Cargo Security",     desc: "End-to-end insurance and high-grade physical security protocols for high-value machinery and electronics.", tag: "GRADE: CLASS A-1", dark: true },
              { icon: "monitoring",title: "Smart Tracking",     desc: "Real-time container location updates via our proprietary NAV-STREAM tracking portal.", tag: "TECH: NAV-STREAM V2", offset: true },
            ].map(card => (
              <div key={card.title}
                className={`p-12 border border-outline-variant/30 flex flex-col h-[440px] transition-transform duration-300 hover:-translate-y-1 ${card.offset ? "md:-mt-12" : ""}`}
                style={{ backgroundColor: card.dark ? "#000000" : "#ffffff", color: card.dark ? "#ffffff" : undefined }}>
                <span className="material-symbols-outlined text-[48px] mb-8"
                  style={{ color: card.dark ? "#fed65b" : "#735c00" }}>
                  {card.icon}
                </span>
                <h3 className="font-sans font-bold text-2xl mb-6">{card.title}</h3>
                <p className={`font-sans text-sm leading-relaxed mb-auto ${card.dark ? "opacity-70" : "text-on-surface-variant"}`}>
                  {card.desc}
                </p>
                <div className={`font-mono text-[10px] mt-8 border-t pt-4 ${card.dark ? "border-white/20 opacity-60" : "border-outline-variant/30 text-outline"}`}>
                  {card.tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FCL & LCL */}
        <section className="px-5 md:px-20 py-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-video overflow-hidden border border-outline-variant/30">
                <img src={STACK_IMG} alt="Stacked shipping containers"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 border border-secondary opacity-20 pointer-events-none hidden md:block" />
            </div>
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase block mb-4">02 / Expertise</span>
              <h2 className="font-display text-on-surface mb-8"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                FCL &amp; LCL Expertise
              </h2>
              <div className="space-y-12">
                {[
                  { title: "Full Container Load (FCL)", desc: "Exclusive container use for maximised security and transit speed across major oceanic corridors. Ideal for large shipments — machinery, transformers, industrial equipment." },
                  { title: "Less than Container Load (LCL)", desc: "Cost-effective consolidation solutions for smaller shipments without compromising on delivery timelines. Perfect for sample shipments and part-loads." },
                ].map(item => (
                  <div key={item.title} className="group">
                    <h4 className="font-sans font-bold text-xl mb-2 group-hover:italic transition-all" style={{ color: "#000000" }}>
                      {item.title}
                    </h4>
                    <p className="font-sans text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
                <div className="pt-8">
                  <Link href="/signup"
                    className="border font-mono text-[11px] tracking-widest px-10 py-4 hover:bg-secondary hover:text-white hover:border-secondary transition-all inline-block"
                    style={{ borderColor: "#735c00", color: "#735c00" }}>
                    REQUEST FREIGHT QUOTE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Port Connectivity */}
        <section className="py-40 px-5 md:px-20 relative">
          <div className="absolute bottom-0 right-0 select-none pointer-events-none font-display leading-none"
            style={{ fontSize: "180px", opacity: 0.03, fontWeight: 700 }}>PORTS</div>
          <div className="text-center mb-24">
            <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase block mb-4">03 / Connectivity</span>
            <h2 className="font-display text-on-surface mb-4"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Direct Port-to-Port Connectivity
            </h2>
            <p className="font-sans text-on-surface-variant max-w-2xl mx-auto text-lg">
              Eliminating transit friction through a curated network of premier global ports.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-outline-variant/30">
            {PORTS.map(port => (
              <div key={port.name}
                className="p-10 border-r border-b border-outline-variant/30 hover:bg-secondary/5 transition-colors">
                <span className="font-mono text-[10px] text-outline block mb-4">{port.region}</span>
                <h5 className="font-sans font-bold text-lg mb-1">{port.name}</h5>
                <p className="font-mono text-[11px]" style={{ color: "#735c00" }}>{port.role}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="mt-20 h-[400px] border border-outline-variant/30 overflow-hidden relative"
            style={{ filter: "grayscale(100%) contrast(1.25) brightness(1.1)" }}>
            <img src={MAP_IMG} alt="Global shipping route map" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(115,92,0,0.05)", mixBlendMode: "overlay" }} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-primary text-white">
          <div className="px-5 md:px-20 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-xl">
              <h2 className="font-display text-white mb-6"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                Stay Ahead of the <em className="not-italic" style={{ color: "#fed65b" }}>Tide</em>
              </h2>
              <p className="font-sans text-white/60 text-lg leading-relaxed">
                Subscribe to our Maritime Market Insights for weekly analysis of freight rates and global shipping trends.
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[400px]">
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="EMAIL@DOMAIN.COM"
                  className="bg-transparent border-0 border-b border-white/30 text-white py-4 px-0 font-mono text-[11px] tracking-widest placeholder:text-white/40 focus:outline-none focus:border-secondary"
                />
                <button className="font-sans font-bold py-4 px-12 self-start hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#fed65b", color: "#241a00" }}>
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
