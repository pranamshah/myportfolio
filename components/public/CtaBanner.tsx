import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A452] mb-4">Get Started</p>
        <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-light text-white mb-4 leading-tight">
          Ready to Move Your Cargo?
        </h2>
        <div className="w-10 h-px bg-[#C9A452] mx-auto mb-6" />
        <p className="text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto text-sm">
          Join 500+ businesses that trust Navkar Impex for seamless freight forwarding.
          Create your free account and get a quote in minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/signup"
            className="bg-[#C9A452] text-white font-semibold px-8 py-3 rounded-md hover:bg-[#b8922f] transition-colors text-sm">
            Create Free Account
          </Link>
          <Link href="/login"
            className="border border-gray-600 text-gray-300 font-medium px-8 py-3 rounded-md hover:border-gray-400 hover:text-white transition-colors text-sm">
            Login to Portal
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-xs text-gray-500">
          {["Free to sign up", "No credit card", "Setup in 2 minutes"].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A452]/50" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
