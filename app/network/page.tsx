import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

const OFFICES = [
  { city: "Chennai", country: "India", role: "Headquarters", detail: "Anna Salai, Chennai — 600 002" },
  { city: "Mumbai", country: "India", role: "Regional Hub", detail: "BKC, Mumbai — 400 051" },
  { city: "Dubai", country: "UAE", role: "Middle-East Gateway", detail: "Jebel Ali Free Zone, Dubai" },
  { city: "Singapore", country: "Singapore", role: "Asia-Pacific Hub", detail: "Tanjong Pagar, Singapore 088000" },
  { city: "Rotterdam", country: "Netherlands", role: "Europe Gateway", detail: "Maasvlakte, 3199 Rotterdam" },
];

const ROUTES = [
  { from: "Chennai / Mumbai", to: "Dubai / Jebel Ali", mode: "SEA + AIR", transit: "4–6 days" },
  { from: "India (All Ports)", to: "Singapore / HK", mode: "SEA", transit: "10–14 days" },
  { from: "India", to: "Rotterdam / Hamburg", mode: "SEA", transit: "22–26 days" },
  { from: "Chennai", to: "New York / LA", mode: "SEA", transit: "28–32 days" },
  { from: "India", to: "Mombasa / Cape Town", mode: "SEA", transit: "18–22 days" },
  { from: "Mumbai / Chennai", to: "Sydney / Melbourne", mode: "SEA", transit: "20–24 days" },
];

const JOBS = [
  {
    id: "ops-exec",
    title: "Operations Executive — Sea Freight",
    location: "Chennai, India",
    type: "Full-time",
    dept: "Operations",
    desc: "Coordinate end-to-end sea freight shipments, liaise with shipping lines, and ensure timely documentation and customs clearance.",
  },
  {
    id: "sales-mgr",
    title: "Sales Manager — Freight Forwarding",
    location: "Mumbai, India",
    type: "Full-time",
    dept: "Sales",
    desc: "Drive new business development, manage key accounts, and pitch customised freight solutions to importers and exporters.",
  },
  {
    id: "customs-agent",
    title: "Customs & Documentation Specialist",
    location: "Chennai, India",
    type: "Full-time",
    dept: "Compliance",
    desc: "Handle import/export customs documentation, HS code classification, and regulatory compliance across Indian ports.",
  },
  {
    id: "tech-lead",
    title: "Full-Stack Developer — Logistics Platform",
    location: "Remote (India)",
    type: "Full-time",
    dept: "Technology",
    desc: "Build and maintain Navkar's client portal, tracking integrations, and internal dashboard using Next.js and TypeScript.",
  },
];

export default function NetworkPage() {
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
        <div className="flex items-center gap-6">
          <Link href="/signup#careers" className="font-mono text-[11px] tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors">
            CAREERS
          </Link>
          <Link
            href="/login"
            className="font-mono text-[11px] tracking-[0.1em] border border-outline px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300">
            LOGIN
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <span className="font-mono text-[11px] tracking-[0.2em] block mb-5" style={{ color: "#735c00" }}>
          GLOBAL NETWORK
        </span>
        <h1
          className="font-display text-primary mb-6"
          style={{
            fontSize: "clamp(44px, 6vw, 88px)",
            fontWeight: 600,
            lineHeight: "112%",
            letterSpacing: "-0.02em",
            maxWidth: "780px",
          }}>
          Connecting Every Port, Every Continent.
        </h1>
        <p className="font-sans text-lg text-on-surface-variant leading-relaxed max-w-2xl">
          Navkar Impex operates a precision freight network spanning 40+ countries, 120+ shipping
          lanes, and offices on five continents — built to move your cargo with surgical accuracy.
        </p>
      </section>

      {/* Stats strip */}
      <section style={{ backgroundColor: "#1a1c1c" }} className="py-16 px-6 md:px-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { value: "40+", label: "COUNTRIES SERVED" },
            { value: "120+", label: "SHIPPING LANES" },
            { value: "5", label: "CONTINENTS" },
            { value: "98.4%", label: "ON-TIME DELIVERY" },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-white mb-2" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "#735c00" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Office locations */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <span className="font-mono text-[11px] tracking-[0.2em] block mb-4" style={{ color: "#735c00" }}>
            OFFICE LOCATIONS
          </span>
          <h2 className="font-display text-primary" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Where We Operate
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OFFICES.map(o => (
            <div
              key={o.city}
              className="border p-8"
              style={{ borderColor: "rgba(198,198,205,0.4)", backgroundColor: "#f9f9f9" }}>
              <p className="font-mono text-[10px] tracking-widest mb-3" style={{ color: "#735c00" }}>
                {o.role.toUpperCase()}
              </p>
              <h3 className="font-display text-primary mb-1" style={{ fontSize: "28px", fontWeight: 600 }}>
                {o.city}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant mb-4">{o.country}</p>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{o.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key routes */}
      <section className="py-24 px-6 md:px-20" style={{ backgroundColor: "#f3f3f4" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <span className="font-mono text-[11px] tracking-[0.2em] block mb-4" style={{ color: "#735c00" }}>
              KEY CORRIDORS
            </span>
            <h2 className="font-display text-primary" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Primary Trade Routes
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(198,198,205,0.5)" }}>
            {ROUTES.map((r, i) => (
              <div key={i} className="py-6 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <p className="font-sans font-semibold text-primary text-base">{r.from}</p>
                  <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/60 mt-1">ORIGIN</p>
                </div>
                <div className="col-span-12 md:col-span-1 flex md:justify-center">
                  <span className="font-sans text-on-surface-variant/40">→</span>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <p className="font-sans font-semibold text-primary text-base">{r.to}</p>
                  <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/60 mt-1">DESTINATION</p>
                </div>
                <div className="col-span-6 md:col-span-2 text-right md:text-center">
                  <span className="font-mono text-[10px] tracking-widest px-3 py-1 border" style={{ borderColor: "#735c00", color: "#735c00" }}>
                    {r.mode}
                  </span>
                </div>
                <div className="col-span-6 md:col-span-1 text-right">
                  <p className="font-sans text-sm text-on-surface-variant">{r.transit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto scroll-mt-24">
        <div className="mb-16">
          <span className="font-mono text-[11px] tracking-[0.2em] block mb-4" style={{ color: "#735c00" }}>
            JOIN THE TEAM
          </span>
          <h2 className="font-display text-primary mb-4" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Careers at Navkar
          </h2>
          <p className="font-sans text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            We are building the future of freight forwarding. Join a team that combines
            deep logistics expertise with modern technology to redefine global trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {JOBS.map(job => (
            <div
              key={job.id}
              className="border p-8 flex flex-col gap-4 group hover:border-primary transition-colors duration-300"
              style={{ borderColor: "rgba(198,198,205,0.5)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "#735c00" }}>
                    {job.dept.toUpperCase()} · {job.type.toUpperCase()}
                  </p>
                  <h3 className="font-sans font-bold text-primary text-lg leading-tight">
                    {job.title}
                  </h3>
                </div>
              </div>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {job.desc}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid rgba(198,198,205,0.4)" }}>
                <span className="font-mono text-[10px] tracking-widest text-on-surface-variant/60">
                  📍 {job.location}
                </span>
                <a
                  href={`mailto:careers@navkarimpex.com?subject=Application: ${encodeURIComponent(job.title)}`}
                  className="font-mono text-[10px] tracking-widest text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
                  APPLY →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 border" style={{ borderColor: "rgba(198,198,205,0.4)", backgroundColor: "#f9f9f9" }}>
          <p className="font-sans text-base text-on-surface-variant mb-4">
            Don&apos;t see a role that fits? We&apos;re always looking for exceptional logistics talent.
          </p>
          <a
            href="mailto:careers@navkarimpex.com"
            className="inline-flex items-center gap-3 bg-primary text-white font-mono text-[11px] tracking-[0.12em] px-8 py-3 hover:opacity-80 transition-opacity">
            SEND OPEN APPLICATION →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 md:px-20 py-16" style={{ borderColor: "#c6c6cd", backgroundColor: "#f9f9f9" }}>
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <div className="mb-4 opacity-10">
              <NavkarLogo variant="wordmark" className="h-12 w-auto" />
            </div>
            <p className="font-sans text-sm text-on-surface-variant">© {new Date().getFullYear()} NAVKAR IMPEX. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "#735c00" }}>PLATFORM</span>
              <Link href="/login" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">LOGIN</Link>
              <Link href="/signup" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">REGISTER</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "#735c00" }}>LEGAL</span>
              <Link href="/privacy" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">PRIVACY</Link>
              <Link href="/terms" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">TERMS</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
