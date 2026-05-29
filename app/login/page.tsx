"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, ArrowRight } from "lucide-react";

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
    const res = await signIn("credentials", {
      email: ovEmail ?? email,
      password: ovPass ?? password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password. Please try again."); return; }
    router.push("/dashboard");
  }

  function quickLogin(role: "admin" | "client") {
    const creds = {
      admin: { email: "admin@navkarimpex.com", password: "Admin@12345" },
      client: { email: "client@navkarimpex.com", password: "Client@12345" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    login(undefined, creds[role].email, creds[role].password);
  }

  return (
    <div className="min-h-screen bg-surface-deep flex">
      {/* ── Left decorative panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-surface-primary flex-col justify-between p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }} />
          <div className="absolute top-1/4 -left-24 w-[450px] h-[450px] bg-gold/[0.05] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-navy/30 rounded-full blur-[100px]" />
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

        {/* Hero copy */}
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-4">Client Portal</p>
          <h2 className="font-display text-[2.8rem] font-light text-ink leading-[1.08] mb-4">
            Your Cargo.<br />Always in<br />
            <span className="gold-text italic">Safe Hands.</span>
          </h2>
          <div className="gold-line max-w-[90px] mb-6" />
          <p className="text-ink-muted text-sm leading-relaxed max-w-[300px]">
            Access shipment tracking, invoices, customs documents and quotes — all in one secure portal.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative grid grid-cols-3 gap-3">
          {[["500+", "Clients"], ["10K+", "Shipments"], ["50+", "Countries"]].map(([v, l]) => (
            <div key={l} className="card-luxury p-4 text-center">
              <div className="font-display text-2xl gold-text leading-none mb-1">{v}</div>
              <div className="text-[10px] text-ink-muted uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-[420px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 border border-gold/40 rounded flex items-center justify-center">
              <Anchor size={15} className="text-gold" />
            </div>
            <span className="font-display text-xl font-light text-ink">
              Navkar <span className="text-gold">Impex</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-light text-ink mb-1">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">Sign in to continue to your portal</p>

          {/* Demo quick-login */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted mb-3">Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => quickLogin("admin")} disabled={loading}
                className="card-luxury px-4 py-3.5 text-left hover:border-gold/40 transition-all
                           duration-200 disabled:opacity-50 group">
                <div className="text-[10px] text-ink-muted mb-1 uppercase tracking-wider">Admin</div>
                <div className="text-sm font-medium text-gold flex items-center gap-1
                                group-hover:gap-2 transition-all duration-200">
                  Quick Login <ArrowRight size={13} />
                </div>
              </button>
              <button onClick={() => quickLogin("client")} disabled={loading}
                className="card-luxury px-4 py-3.5 text-left hover:border-gold/40 transition-all
                           duration-200 disabled:opacity-50 group">
                <div className="text-[10px] text-ink-muted mb-1 uppercase tracking-wider">Client</div>
                <div className="text-sm font-medium text-ink-secondary flex items-center gap-1
                                group-hover:gap-2 group-hover:text-ink transition-all duration-200">
                  Quick Login <ArrowRight size={13} />
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-hover" />
            <span className="text-[11px] text-ink-muted">or sign in with email</span>
            <div className="flex-1 h-px bg-surface-hover" />
          </div>

          {/* Login form */}
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="label-luxury">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-luxury" placeholder="you@company.com" required autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label-luxury mb-0">Password</label>
                <Link href="/forgot-password"
                  className="text-[11px] text-gold hover:text-gold-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-luxury" placeholder="••••••••" required />
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
                  Signing in…
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-ink-muted text-sm mt-7">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gold hover:text-gold-light transition-colors font-medium">
              Sign up free
            </Link>
          </p>

          <p className="text-center text-ink-muted text-[11px] mt-10">
            © {new Date().getFullYear()} Navkar Impex. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
