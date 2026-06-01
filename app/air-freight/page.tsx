/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCSSaK0oihnFU53wdQq3ssmoJuFX00zE3mVxHb_zfOfr1uOGAI0CEPBoQXDOpWvR9-Wz0bg5PmirIahGE2ZlcQLsmHIIA-ustqgM_IPrnqm-ddSwq9xHUGpWBxXS3-A6U0VABK_8ro8DcJAtfAJtFdTN0zVse7D-g5n4tMKvkoMtgSDxwI18FEy353rkEjZM4nKZG4WdmYdn8yWyipZOUMwF7Vj_Vc8t95rK8B6gJwgy1Unk7evxUqNCZJpCxWF_1oD6L-V7XLBBg";

export const metadata = { title: "Air Freight — Navkar Impex" };

export default function AirFreightPage() {
  return (
    <div className="bg-surface min-h-screen overflow-x-hidden">
      <PublicNav />

      <main className="relative">
        {/* Watermark */}
        <div className="fixed top-1/4 -right-20 rotate-90 select-none pointer-events-none font-display leading-none whitespace-nowrap z-0"
          style={{ fontSize: "220px", opacity: 0.02, fontWeight: 700 }}>
          FLIGHT PATH
        </div>

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center px-5 md:px-20 pt-32 pb-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 z-10">
              <span className="font-mono text-[11px] tracking-widest text-secondary uppercase block mb-6">Air Logistics Intelligence</span>
              <h1 className="font-display text-on-surface mb-8 leading-none"
                style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                Time-Critical<br />
                <em className="not-italic" style={{ color: "#735c00" }}>Air Cargo</em>
              </h1>
              <p className="font-sans text-on-surface-variant text-lg max-w-xl mb-12 leading-relaxed">
                Precision-engineered logistics for when every second translates to revenue. Our air freight ecosystem combines technical speed with strategic customs clearance protocols.
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                <Link href="/signup"
                  className="bg-primary text-white font-mono text-[11px] tracking-widest px-12 py-4 hover:opacity-80 transition-opacity">
                  SCHEDULE SHIPMENT
                </Link>
                <a href="#services" className="font-mono text-[11px] tracking-widest hover:underline transition-colors"
                  style={{ color: "#735c00" }}>
                  EXPLORE NETWORK
                </a>
              </div>
            </div>
            <div className="md:col-span-5 relative mt-12 md:mt-0">
              <div className="relative overflow-hidden aspect-[4/5] border border-outline-variant/30">
                <img src={HERO_IMG} alt="Aircraft wing in flight"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent" />
              </div>
              <div className="absolute -bottom-10 -left-10 md:-left-20 p-8 hidden md:block"
                style={{ backgroundColor: "#735c00" }}>
                <span className="font-mono text-[10px] text-white tracking-widest">01 // GLOBAL REACH</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services bento */}
        <section id="services" className="py-40 px-5 md:px-20 overflow-hidden" style={{ backgroundColor: "#f9f9f9" }}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="font-display text-on-surface max-w-2xl"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Architecting the <em className="not-italic">Atmospheric</em> Supply Chain.
            </h2>
            <div className="text-right flex-shrink-0">
              <span className="font-mono text-[10px] text-outline block">VERIFIED ON-TIME RATE</span>
              <span className="font-sans font-bold text-4xl" style={{ color: "#735c00" }}>99.8%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "speed", title: "Express Clearing",
                desc: "Proprietary pre-clearance protocols ensure your cargo moves through customs as fast as it moves through the air. No bottlenecks, just transit.",
                link: "VIEW PROTOCOLS",
              },
              {
                icon: "hub", title: "Global Airport Network",
                desc: "Direct access to 140+ international hubs. We prioritise direct routes to minimise ground-handling risks and total transit duration.",
                link: "MAP NETWORK",
              },
              {
                icon: "inventory_2", title: "Sensitive Cargo",
                desc: "Bespoke climate-controlled solutions for pharmaceuticals and high-value electronics. Security is woven into every mile of flight.",
                link: "SENSITIVE TECH",
              },
            ].map(card => (
              <div key={card.title}
                className="group border border-outline-variant/30 p-12 hover:border-secondary transition-colors duration-500 bg-white">
                <div className="mb-12">
                  <span className="material-symbols-outlined text-[48px]" style={{ color: "#735c00" }}>{card.icon}</span>
                </div>
                <h3 className="font-sans font-bold text-2xl mb-6">{card.title}</h3>
                <p className="font-sans text-on-surface-variant text-sm leading-relaxed mb-10">{card.desc}</p>
                <a href="#" className="font-mono text-[11px] tracking-widest uppercase border-b border-primary pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors">
                  {card.link}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking section */}
        <section className="py-40 px-5 md:px-20 bg-primary text-white relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <h2 className="font-display leading-[0.9] opacity-20 mb-10" style={{ fontSize: "80px", fontWeight: 700 }}>TRACK</h2>
              <p className="font-sans text-white/60 text-lg mb-12 leading-relaxed">
                Real-time manifest tracking for all active Navkar Impex air shipments. Enter your reference number to retrieve live shipment data.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MANIFEST ID / TRACKING #"
                  className="w-full bg-transparent border-0 border-b border-white/30 p-4 font-mono text-[11px] tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-secondary transition-colors"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-white transition-colors"
                  style={{ color: "#fed65b" }}>
                  <span className="material-symbols-outlined text-[32px]">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-8 mt-16 md:mt-0 border-l border-white/10 pl-8 md:pl-20">
              <div className="space-y-12">
                {[
                  { stat: "140+",    label: "International Airport Hubs" },
                  { stat: "48 HRS",  label: "Average Transit Time (Europe→India)" },
                  { stat: "100%",    label: "Live Track & Trace Visibility" },
                  { stat: "24/7",    label: "Dedicated Air Freight Operations Team" },
                ].map(item => (
                  <div key={item.stat} className="flex justify-between items-end border-b border-white/10 pb-6">
                    <p className="font-sans text-white/60 text-sm max-w-xs">{item.label}</p>
                    <p className="font-display text-white text-right flex-shrink-0" style={{ fontSize: "36px", fontWeight: 600 }}>
                      {item.stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 px-5 md:px-20 text-center relative overflow-hidden" style={{ backgroundColor: "#f3f3f4" }}>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-display text-on-surface mb-12"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Ready to Fly?
            </h2>
            <div className="inline-flex flex-col md:flex-row gap-8 w-full md:w-auto">
              <Link href="/signup"
                className="bg-primary text-white font-mono text-[11px] tracking-widest px-16 py-6 hover:opacity-90 transition-opacity block text-center">
                SCHEDULE SHIPMENT
              </Link>
              <Link href="/network"
                className="border border-primary text-primary font-mono text-[11px] tracking-widest px-16 py-6 hover:bg-primary hover:text-white transition-all block text-center">
                VIEW GLOBAL NETWORK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
