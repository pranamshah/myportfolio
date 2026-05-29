"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const BENEFITS = [
  "Real-time shipment tracking",
  "Instant invoice & document access",
  "Online quote requests",
  "Automated status alerts",
  "Dedicated account manager",
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, company: form.company,
          email: form.email, phone: form.phone, password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed."); setLoading(false); return; }

      // Auto sign-in
      const signInRes = await signIn("credentials", {
        email: form.email, password: form.password, redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created! Please sign in.");
        router.push("/login");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gray-900 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #C9A452 0%, transparent 60%)" }} />

        <div className="relative flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-semibold">Navkar Impex</span>
        </div>

        <div className="relative">
          <p className="text-[#C9A452] text-xs font-semibold uppercase tracking-widest mb-4">Join 500+ Businesses</p>
          <h2 className="font-display text-4xl font-light text-white leading-tight mb-4">
            Ship Smarter.<br />Track Faster.<br />
            <span style={{ color: "#C9A452" }}>Grow Bigger.</span>
          </h2>
          <div className="w-10 h-px bg-[#C9A452] mb-7" />

          <ul className="space-y-3">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-5 h-5 rounded-full bg-[#C9A452]/15 border border-[#C9A452]/30
                                flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-[#C9A452]" />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C9A452] hover:underline">Sign in →</Link>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Navkar Impex</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-8">Free portal access — set up in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Company */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                  focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="John Doe" required value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Company *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                  focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="ACME Pvt Ltd" required value={form.company} onChange={e => set("company", e.target.value)} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address *</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="you@company.com" required value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Phone Number *</label>
              <input type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="+91 98765 43210" required value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Password *</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                  focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="Min 8 chars" required value={form.password} onChange={e => set("password", e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Confirm *</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                                  focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="Repeat" required value={form.confirm} onChange={e => set("confirm", e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center
                         justify-center gap-2 text-sm">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-400 pt-1">
              By signing up you agree to our{" "}
              <span className="text-[#C9A452] cursor-pointer">Terms</span> and{" "}
              <span className="text-[#C9A452] cursor-pointer">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C9A452] font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
