"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e?: React.FormEvent, ovEmail?: string, ovPass?: string) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: ovEmail ?? email,
        password: ovPass ?? password,
        redirect: false,
      });
      if (res?.error) { setError("Invalid email or password. Please try again."); }
      else { router.push("/dashboard"); }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(role: "admin" | "client") {
    const creds = {
      admin: { email: "admin@navkarimpex.com", password: "Admin@12345" },
      client: { email: "client@navkarimpex.com", password: "Client@12345" },
    };
    login(undefined, creds[role].email, creds[role].password);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gray-900 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A452 0%, transparent 60%)" }} />

        <div className="relative flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-semibold">Navkar Impex</span>
        </div>

        <div className="relative">
          <p className="text-[#C9A452] text-xs font-semibold uppercase tracking-widest mb-4">Portal Access</p>
          <h2 className="font-display text-4xl font-light text-white leading-tight mb-4">
            Your Cargo.<br />Always in<br />
            <span style={{ color: "#C9A452" }}>Safe Hands.</span>
          </h2>
          <div className="w-10 h-px bg-[#C9A452] mb-6" />
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Track shipments, view invoices, download documents and request quotes — all in one portal.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[["500+", "Clients"], ["10K+", "Shipments"], ["50+", "Countries"]].map(([v, l]) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="font-display text-xl text-[#C9A452]">{v}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Navkar Impex</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to continue to your portal</p>

          {/* Quick demo */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin("admin")} disabled={loading}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-left hover:border-[#C9A452]/40
                           hover:bg-[#C9A452]/5 transition-all disabled:opacity-50 group bg-white">
                <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Business</div>
                <div className="text-xs font-semibold text-[#C9A452] flex items-center gap-1
                                group-hover:gap-1.5 transition-all">
                  Quick Login <ArrowRight size={11} />
                </div>
              </button>
              <button onClick={() => quickLogin("client")} disabled={loading}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-left hover:border-gray-300
                           hover:bg-gray-50 transition-all disabled:opacity-50 group bg-white">
                <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Client</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1
                                group-hover:gap-1.5 transition-all">
                  Quick Login <ArrowRight size={11} />
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                           focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="you@company.com" required autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-[#C9A452] hover:underline">
                  Forgot?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A452]/30
                           focus:border-[#C9A452]/50 bg-white transition-all"
                placeholder="••••••••" required />
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
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#C9A452] font-semibold hover:underline">Sign up free</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Navkar Impex
          </p>
        </div>
      </div>
    </div>
  );
}
