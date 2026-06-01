"use client";
import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

/* eslint-disable @next/next/no-img-element */

const HERO_IMG =
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&fit=crop&q=80";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused,  setPassFocused]  = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!imgRef.current) return;
      const x = (e.clientX - window.innerWidth  / 2) * 0.012;
      const y = (e.clientY - window.innerHeight / 2) * 0.012;
      imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

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
      if (res?.error) setError("Invalid email or password. Please try again.");
      else router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">

      {/* ── Logo — fixed top-left ── */}
      <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 flex items-center gap-3">
        <NavkarLogo variant="symbol" symbolSize={40} />
        <NavkarLogo variant="wordmark" className="h-9 w-auto" />
      </div>

      {/* ── Left visual side: 3/5 width ── */}
      <section
        className="hidden md:flex md:w-3/5 relative items-center justify-center overflow-hidden p-20"
        style={{ backgroundColor: "#f9f9f9" }}>

        {/* Giant watermark */}
        <div
          className="absolute -left-10 bottom-0 pointer-events-none select-none overflow-hidden leading-none"
          style={{ opacity: 0.03 }}>
          <span
            className="font-display font-bold"
            style={{ fontSize: "clamp(160px, 18vw, 320px)", letterSpacing: "-0.04em", lineHeight: 1 }}>
            NAVKAR
          </span>
        </div>

        {/* Floating 3D logistics sphere */}
        <div className="login-float relative w-full max-w-[520px] aspect-square z-10">
          <img
            ref={imgRef}
            src={HERO_IMG}
            alt="Global Logistics Network"
            className="w-full h-full object-contain"
            style={{ filter: "grayscale(100%) brightness(108%) contrast(120%)" }}
          />
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-20 left-20 max-w-xs z-10">
          <p
            className="font-mono text-[10px] tracking-[0.28em] mb-4"
            style={{ color: "#76777d" }}>
            EST. 2026
          </p>
          <h3
            className="font-sans font-bold text-primary mb-3"
            style={{ fontSize: "17px", letterSpacing: "0.06em" }}>
            PRECISION REFINED.
          </h3>
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: "rgba(69,70,77,0.7)" }}>
            Empowering global trade through surgical logistics execution and
            unshakeable freight architecture.
          </p>
        </div>
      </section>

      {/* ── Right form side: 2/5 width ── */}
      <section className="w-full md:w-2/5 min-h-screen bg-white flex flex-col justify-center px-6 md:px-20 py-20 relative">
        <div className="max-w-[380px] w-full mx-auto md:mx-0">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-10 mt-24">
            <NavkarLogo variant="symbol" symbolSize={40} />
            <NavkarLogo variant="wordmark" className="h-9 w-auto" />
          </div>

          {/* Heading */}
          <header className="mb-12">
            <span
              className="font-mono text-[11px] tracking-widest block mb-3"
              style={{ color: "#735c00" }}>
              PORTAL ACCESS
            </span>
            <h2
              className="font-display text-primary"
              style={{
                fontSize: "clamp(44px, 5.5vw, 64px)",
                fontWeight: 600,
                lineHeight: "115%",
                letterSpacing: "-0.02em",
              }}>
              Sign In
            </h2>
          </header>

          {/* Form */}
          <form onSubmit={login} className="space-y-10">

            {/* Email */}
            <div className="relative">
              <label
                className="font-mono text-[11px] tracking-[0.1em] block mb-2 transition-colors duration-200"
                style={{ color: emailFocused ? "#000000" : "#c6c6cd" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="username@domain.com" required autoFocus
                className="w-full bg-transparent border-0 border-b py-4 px-0 text-lg text-primary focus:ring-0 focus:outline-none font-sans placeholder:opacity-30"
                style={{ borderBottom: "1px solid #c6c6cd", borderRadius: 0 }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <div
                className="absolute bottom-0 left-0 h-px bg-primary"
                style={{ width: emailFocused ? "100%" : "0%", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] transition-colors duration-200"
                  style={{ color: passFocused ? "#000000" : "#c6c6cd" }}>
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="font-mono text-[11px] tracking-widest underline underline-offset-4 decoration-1 hover:text-primary transition-colors"
                  style={{ color: "#735c00" }}>
                  FORGOT?
                </Link>
              </div>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full bg-transparent border-0 border-b py-4 px-0 text-lg text-primary focus:ring-0 focus:outline-none font-sans placeholder:opacity-30"
                style={{ borderBottom: "1px solid #c6c6cd", borderRadius: 0 }}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
              />
              <div
                className="absolute bottom-0 left-0 h-px bg-primary"
                style={{ width: passFocused ? "100%" : "0%", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="pl-4 py-2.5 text-sm font-sans"
                style={{ borderLeft: "2px solid #ba1a1a", backgroundColor: "#fff8f8", color: "#ba1a1a" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit" disabled={loading}
                className="inline-flex items-center gap-4 bg-primary text-on-primary py-4 px-12 font-mono text-[11px] transition-all duration-300 hover:tracking-[0.18em] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ letterSpacing: "0.08em" }}>
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SIGNING IN
                  </>
                ) : (
                  <><span>LOG IN</span><span>→</span></>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <footer
            className="mt-20 pt-10"
            style={{ borderTop: "1px solid rgba(198,198,205,0.3)" }}>
            <p className="font-sans text-sm mb-4" style={{ color: "#45464d" }}>
              New to the network?
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 group">
              <span className="font-sans font-bold text-xl text-primary transition-all duration-200 group-hover:pr-2">
                Create an account
              </span>
              <span style={{ color: "#735c00", fontSize: "18px" }}>↗</span>
            </Link>
          </footer>
        </div>

        {/* Ghost watermark bottom-right */}
        <div
          className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.025 }}>
          <span
            className="font-display font-bold"
            style={{ fontSize: "300px", lineHeight: 1, letterSpacing: "-0.04em" }}>
            G
          </span>
        </div>
      </section>
    </main>
  );
}
