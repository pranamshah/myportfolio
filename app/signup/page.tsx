"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, ArrowRight, Check } from "lucide-react";

const BENEFITS = [
  "Real-time shipment tracking",
  "Instant invoice & document access",
  "Quick quote requests online",
  "Dedicated relationship manager",
  "Automated customs status alerts",
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Registration failed. Please try again."); setLoading(false); return; }

    // Auto sign-in after registration
    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (signInRes?.error) { router.push("/login"); return; }
    router.push("/dashboard/client");
  }

  return (
    <div className="min-h-screen bg-surface-deep flex">
      {/* ── Left panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-surface-primary flex-col justify-between p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }} />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gold/[0.05] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-navy/20 rounded-full blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 border border-gold/40 rounded flex items-center justify-center">
            <Anchor size={18} className="text-gold" />
          </div>
          <span className="font-display text-2xl font-light text-ink tracking-wide">
            Navkar <span className="text-gold">Impex</span>
          </span>
        </div>

        {/* Copy */}
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-4">Join 500+ Businesses</p>
          <h2 className="font-display text-[2.8rem] font-light text-ink leading-[1.08] mb-4">
            Ship Smarter.<br />Track Faster.<br />
            <span className="gold-text italic">Grow Bigger.</span>
          </h2>
          <div className="gold-line max-w-[90px] mb-7" />

          <ul className="space-y-3.5">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-3 text-sm text-ink-secondary">
                <div className="w-5 h-5 rounded-full bg-gold/15 border border-gold/30 flex items-center
                                justify-center flex-shrink-0">
                  <Check size={11} className="text-gold" />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in →
          </Link>
        </div>
      </div>

      {/* ── Right: form ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-[460px] animate-fade-up py-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 border border-gold/40 rounded flex items-center justify-center">
              <Anchor size={15} className="text-gold" />
            </div>
            <span className="font-display text-xl font-light text-ink">
              Navkar <span className="text-gold">Impex</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-light text-ink mb-1">Create your account</h1>
          <p className="text-ink-muted text-sm mb-8">
            Free client portal access — get started in minutes
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Full Name *</label>
                <input className="input-luxury" placeholder="John Doe" required
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label className="label-luxury">Company Name *</label>
                <input className="input-luxury" placeholder="ACME Exports Pvt Ltd" required
                  value={form.company} onChange={e => set("company", e.target.value)} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label-luxury">Email Address *</label>
              <input type="email" className="input-luxury" placeholder="you@company.com" required
                value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

            {/* Phone */}
            <div>
              <label className="label-luxury">Phone Number *</label>
              <input type="tel" className="input-luxury" placeholder="+91 98765 43210" required
                value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Password *</label>
                <input type="password" className="input-luxury" placeholder="Min. 8 characters" required
                  value={form.password} onChange={e => set("password", e.target.value)} />
              </div>
              <div>
                <label className="label-luxury">Confirm Password *</label>
                <input type="password" className="input-luxury" placeholder="Repeat password" required
                  value={form.confirm} onChange={e => set("confirm", e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded px-3 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3
                         disabled:opacity-60 disabled:cursor-not-allowed text-base mt-1">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface-deep/30 border-t-surface-deep
                                   rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-center text-[11px] text-ink-muted pt-1">
              By creating an account you agree to our{" "}
              <span className="text-gold cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-gold cursor-pointer">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-center text-ink-muted text-sm mt-7">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
