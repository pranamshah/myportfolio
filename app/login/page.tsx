"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid credentials. Please try again."); return; }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface-deep flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px]" />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative w-full max-w-md mx-4 animate-fade-up">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded border border-gold/40 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <h1 className="font-display text-4xl font-light text-ink tracking-wide">Navkar Impex</h1>
          <div className="gold-line max-w-[120px] mx-auto mt-3 mb-3" />
          <p className="text-ink-secondary text-sm tracking-widest uppercase">Freight Forwarding</p>
        </div>

        {/* Card */}
        <div className="card-luxury p-8">
          <h2 className="font-display text-xl font-light text-ink mb-1">Welcome back</h2>
          <p className="text-ink-muted text-sm mb-7">Sign in to access your portal</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-luxury">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-luxury"
                placeholder="you@company.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label-luxury">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-luxury"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface-deep/30 border-t-surface-deep rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-ink-muted text-xs mt-6">
          © {new Date().getFullYear()} Navkar Impex. All rights reserved.
        </p>
      </div>
    </div>
  );
}
