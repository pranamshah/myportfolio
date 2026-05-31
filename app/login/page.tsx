"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

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
    <div className="min-h-screen flex canvas-bg" style={{ backgroundColor: "#f9f9f9" }}>

      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-16 relative overflow-hidden"
        style={{ backgroundColor: "#000000" }}>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-end justify-start overflow-hidden pointer-events-none select-none">
          <span className="font-display text-white leading-none"
            style={{ fontSize: "240px", opacity: 0.025, fontStyle: "italic", fontWeight: 700, lineHeight: 0.85 }}>
            Navkar
          </span>
        </div>

        {/* Logo */}
        <div className="relative inline-flex items-center gap-2 px-3 py-2 self-start"
          style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
          <NavkarLogo variant="symbol" symbolSize={30} />
          <NavkarLogo variant="wordmark" className="h-6 w-auto" />
        </div>

        {/* Quote */}
        <div className="relative">
          <p className="font-mono text-[11px] tracking-[0.2em] mb-6 uppercase"
            style={{ color: "#735c00" }}>
            Portal Access
          </p>
          <h2 className="font-display text-white mb-6"
            style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, lineHeight: 1.3, fontStyle: "italic" }}>
            Your Cargo.<br />Always in<br />
            <span style={{ color: "#fed65b", fontStyle: "normal", fontWeight: 600 }}>Safe Hands.</span>
          </h2>
          <div className="mb-6" style={{ height: "1px", width: "48px", backgroundColor: "#735c00" }} />
          <p className="font-sans text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            Track shipments, view invoices, download documents and request quotes — all in one portal.
          </p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {[["500+", "CLIENTS"], ["CHA", "LICENSED"], ["2026", "EST."]].map(([v, l]) => (
            <div key={l} className="p-4 text-center"
              style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}>
              <div className="font-display text-xl" style={{ color: "#fed65b", fontStyle: "italic" }}>{v}</div>
              <div className="font-mono mt-0.5" style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <NavkarLogo variant="symbol" symbolSize={30} />
            <NavkarLogo variant="wordmark" className="h-6 w-auto" />
          </div>

          <p className="font-mono text-[11px] tracking-[0.2em] mb-3 uppercase" style={{ color: "#735c00" }}>
            Client Portal
          </p>
          <h1 className="font-display mb-10" style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Welcome<br />back.
          </h1>

          {/* Quick demo access */}
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.12em] text-on-surface-variant mb-3 uppercase">Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin("admin")} disabled={loading}
                className="border border-outline-variant p-3 text-left hover:border-primary transition-all disabled:opacity-50 group"
                style={{ backgroundColor: "#ffffff" }}>
                <div className="font-mono text-[9px] text-on-surface-variant mb-0.5 uppercase tracking-wide">Business</div>
                <div className="font-sans text-xs font-semibold text-primary flex items-center gap-1">
                  Quick Login <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                </div>
              </button>
              <button onClick={() => quickLogin("client")} disabled={loading}
                className="border border-outline-variant p-3 text-left hover:border-outline transition-all disabled:opacity-50 group"
                style={{ backgroundColor: "#ffffff" }}>
                <div className="font-mono text-[9px] text-on-surface-variant mb-0.5 uppercase tracking-wide">Client</div>
                <div className="font-sans text-xs font-semibold text-on-surface flex items-center gap-1">
                  Quick Login <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">OR</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* Form */}
          <form onSubmit={login} className="space-y-8">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">
                Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border-0 border-b bg-transparent pb-3 text-sm text-on-surface
                           placeholder-on-surface-variant/40 focus:outline-none transition-colors font-sans"
                style={{ borderBottom: "1px solid #c6c6cd", borderRadius: 0 }}
                onFocus={e => (e.target.style.borderBottomColor = "#000000")}
                onBlur={e => (e.target.style.borderBottomColor = "#c6c6cd")}
                placeholder="you@company.com" required autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant">
                  Password
                </label>
                <Link href="/forgot-password" className="font-mono text-[10px] tracking-widest hover:underline" style={{ color: "#735c00" }}>
                  FORGOT?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border-0 border-b bg-transparent pb-3 text-sm text-on-surface
                           placeholder-on-surface-variant/40 focus:outline-none transition-colors font-sans"
                style={{ borderBottom: "1px solid #c6c6cd", borderRadius: 0 }}
                onFocus={e => (e.target.style.borderBottomColor = "#000000")}
                onBlur={e => (e.target.style.borderBottomColor = "#c6c6cd")}
                placeholder="••••••••" required />
            </div>

            {error && (
              <div className="pl-4 py-2.5 text-sm font-sans"
                style={{ borderLeft: "2px solid #ba1a1a", backgroundColor: "#fff0f0", color: "#ba1a1a" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full font-mono text-[11px] tracking-[0.12em] py-4 flex items-center justify-center gap-2
                         hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SIGNING IN</>
              ) : "SIGN IN →"}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-on-surface-variant mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>

          <p className="text-center font-mono text-[10px] tracking-widest text-on-surface-variant/40 uppercase mt-8">
            © {new Date().getFullYear()} Navkar Impex
          </p>
        </div>
      </div>
    </div>
  );
}
