import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-28 bg-surface-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[800px] h-[300px] bg-gold/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Start Today</p>
        <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light text-ink mb-4 leading-tight">
          Ready to Move<br />
          <span className="gold-text italic">Your Cargo?</span>
        </h2>
        <div className="gold-line max-w-[140px] mx-auto mb-6" />
        <p className="text-ink-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join 500+ businesses that trust Navkar Impex for seamless freight. Sign up free — get your first quote in minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup"
            className="btn-gold text-base px-10 py-3.5 shadow-gold">
            Create Free Account
          </Link>
          <a href="#contact"
            className="btn-ghost text-base px-10 py-3.5">
            Talk to an Expert
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-ink-muted">
          {["No credit card required", "Setup in 2 minutes", "Dedicated account manager"].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold/50" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
