"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, User } from "lucide-react";
import GlobeCanvas from "@/components/public/GlobeCanvas";
import NavkarLogo from "@/components/NavkarLogo";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"business" | "client">("client");
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
          email: form.email, phone: form.phone,
          password: form.password, accountType,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed."); setLoading(false); return; }

      const signInRes = await signIn("credentials", {
        email: form.email, password: form.password, redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created! Please sign in.");
        router.push("/login");
      } else {
        router.push(accountType === "business" ? "/dashboard/admin" : "/dashboard/client");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "linear-gradient(160deg, #080d1a 0%, #0d1630 100%)" }}>
      {/* Globe background */}
      <div className="absolute inset-0">
        <GlobeCanvas cx={0.5} cy={0.45} radiusFactor={0.38} opacity={0.7} />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(8,13,26,0.6) 100%)" }} />
      <div className="w-full max-w-lg relative z-10">

        {/* Logo */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 mb-8 mx-auto">
          <NavkarLogo variant="symbol" symbolSize={34} />
          <NavkarLogo variant="wordmark" className="h-7 w-auto" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Create your account</h1>
          <p className="text-sm text-gray-500 mb-8 text-center">Choose your account type to get started</p>

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                accountType === "business"
                  ? "border-[#C9A452] bg-[#C9A452]/5"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                accountType === "business" ? "bg-[#C9A452]/15" : "bg-gray-200"
              }`}>
                <Building2 size={18} className={accountType === "business" ? "text-[#C9A452]" : "text-gray-500"} />
              </div>
              <div className={`text-sm font-semibold mb-0.5 ${accountType === "business" ? "text-gray-900" : "text-gray-600"}`}>
                Business
              </div>
              <div className="text-[11px] text-gray-400 leading-snug">
                Manage shipments, invoices & clients
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("client")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                accountType === "client"
                  ? "border-[#C9A452] bg-[#C9A452]/5"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                accountType === "client" ? "bg-[#C9A452]/15" : "bg-gray-200"
              }`}>
                <User size={18} className={accountType === "client" ? "text-[#C9A452]" : "text-gray-500"} />
              </div>
              <div className={`text-sm font-semibold mb-0.5 ${accountType === "client" ? "text-gray-900" : "text-gray-600"}`}>
                Client
              </div>
              <div className="text-[11px] text-gray-400 leading-snug">
                Track cargo, view invoices & docs
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name *</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                             focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="John Doe" required
                  value={form.name} onChange={e => set("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Company *</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                             focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="ACME Pvt Ltd" required
                  value={form.company} onChange={e => set("company", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address *</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                           focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="you@company.com" required
                value={form.email} onChange={e => set("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                           focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="+91 98765 43210" required
                value={form.phone} onChange={e => set("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Password *</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                             focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="Min 8 chars" required
                  value={form.password} onChange={e => set("password", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Confirm *</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                             focus:border-[#C9A452]/50 bg-white transition-all"
                  placeholder="Repeat" required
                  value={form.confirm} onChange={e => set("confirm", e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center
                         justify-center gap-2 text-sm"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : (
                <>Create {accountType === "business" ? "Business" : "Client"} Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C9A452] font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
