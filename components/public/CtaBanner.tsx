import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-36 px-5 md:px-20 overflow-hidden relative bg-surface">
      <div className="max-w-[1440px] mx-auto text-center relative z-10 reveal">

        <span className="font-mono text-[11px] tracking-[0.2em] text-secondary block mb-6 uppercase">
          Get Started
        </span>
        <h2 className="font-display mb-8"
          style={{
            fontSize: "clamp(36px, 5.5vw, 80px)",
            fontWeight: 600,
            lineHeight: "1.15",
            letterSpacing: "-0.03em",
          }}>
          Ready for<br />Lift Off?
        </h2>

        <p className="font-sans text-lg text-on-surface-variant max-w-xl mx-auto mb-14 leading-relaxed">
          Whether you&apos;re shipping a single crate or managing a global supply chain,
          Navkar Impex provides the foundation for your success.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/signup"
            className="bg-primary text-on-primary font-mono text-[11px] tracking-[0.12em]
                       px-14 py-5 hover:opacity-80 transition-opacity active:scale-95 shadow-lg">
            GET A QUOTE
          </Link>
          <a href="tel:+919080767398"
            className="border border-secondary text-secondary font-mono text-[11px] tracking-[0.12em]
                       px-14 py-5 hover:bg-secondary hover:text-on-secondary transition-all">
            CALL US NOW
          </a>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 font-mono text-[10px] tracking-[0.12em] text-on-surface-variant">
          {["FREE TO START", "NO HIDDEN FEES", "+91 90807 67398"].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-secondary/60 inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative half-circle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "1000px",
          height: "500px",
          borderRadius: "500px 500px 0 0",
          background: "rgba(254, 214, 91, 0.06)",
          zIndex: 0,
        }} />
    </section>
  );
}
