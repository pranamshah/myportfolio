"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavkarLogo from "@/components/NavkarLogo";

const CLIENT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdXiAjl_EjpNF8lnYDuwBokv1R2XjMewOQp3Ldz-NwyvHF2yH3p6kM8BPQWrOV9sZLB6MiqdwsvGzw7xlVdoMy6uKwjekypdZGPmKwNKvT04zALg_EfDELX-IYoiJbDMgraxcTbAzCl_Cf_9bmRRihtX7ZuKp6Z9bVwoYRBGy5e4Iqn85e5_vhEuEwdyn5-YMZc_6wzioC-5Tf-uewInXHmX-o0IWUQbK75b1AncUC9Tdz1em860Ypo4JI_7Dl2yuVhxCqolpU5A";

const BUSINESS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDhR2lpaWCELavN4mNvTfLR-EOiuTMEohPcG37TcCtSodOHd-lG1VpchUgsstMaJIUYqyU0AMZ9iPd7xG1OxLNhc5x81D2_VJnR3Ieqnt_a0-6gkijVwhyrizoAd13bOs9jYQ_8iQjUzIY-8yMwA0OM5FMTPHbaxnBofOt1xzhYAsPqSe4m5rnUDvP0UywhcJVdbEAc3hpNmsmmKeKqUzihZxB_mKW64osZyuXke3qhn0M5Dpq5NGgO__y3pfOgiThUDtzEAfXD3g";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"business" | "client" | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", password: "", confirm: "",
  });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function selectType(type: "business" | "client") {
    setAccountType(type);
    if (!formVisible) setFormVisible(true);
    setTimeout(() => {
      document.getElementById("reg-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountType) return;
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8)       { setError("Password must be at least 8 characters."); return; }

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
      router.push(
        signInRes?.error
          ? "/login"
          : accountType === "business" ? "/dashboard/admin" : "/dashboard/client"
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldCls =
    "w-full bg-transparent border-0 border-b py-4 px-0 text-base text-primary focus:ring-0 focus:outline-none font-sans placeholder:opacity-30";
  const fieldStyle = { borderBottom: "1px solid #c6c6cd", borderRadius: 0 };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderBottomColor = "#000000");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderBottomColor = "#c6c6cd");

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 py-4"
        style={{
          backgroundColor: "rgba(249,249,249,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(198,198,205,0.3)",
        }}>
        <Link href="/" className="flex items-center gap-2.5">
          <NavkarLogo variant="symbol" symbolSize={28} />
          <NavkarLogo variant="wordmark" className="h-5 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["SEA", "AIR", "CUSTOMS", "TRACKING", "ABOUT"].map(l => (
            <a
              key={l}
              href={`/#${l.toLowerCase()}`}
              className="font-mono text-[11px] tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors">
              {l}
            </a>
          ))}
        </div>
        <Link
          href="/login"
          className="font-mono text-[11px] tracking-[0.1em] border border-outline px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300">
          LOGIN
        </Link>
      </nav>

      {/* ── Main ── */}
      <main className="pt-36 pb-24 px-6 md:px-20 max-w-[1440px] mx-auto">

        {/* Hero header */}
        <header className="mb-20">
          <span
            className="font-mono text-[11px] tracking-[0.2em] block mb-5"
            style={{ color: "#735c00" }}>
            ESTABLISHED 2026
          </span>
          <h1
            className="font-display text-primary mb-6"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              fontWeight: 600,
              lineHeight: "115%",
              letterSpacing: "-0.02em",
              maxWidth: "680px",
            }}>
            Precision Logistics Starts Here.
          </h1>
          <p className="font-sans text-lg text-on-surface-variant leading-relaxed max-w-lg">
            Join the global network of Navkar Impex. Select your account type to
            begin your journey with surgical freight accuracy.
          </p>
        </header>

        {/* ── Account type cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

          {/* CLIENT */}
          <div
            onClick={() => selectType("client")}
            className="group cursor-pointer border flex flex-col items-center text-center p-10 transition-all duration-500"
            style={{
              borderColor: accountType === "client" ? "#000000" : "rgba(198,198,205,0.5)",
              backgroundColor: accountType === "client" ? "#ffffff" : "#f3f3f4",
              transform: accountType === "client" ? "scale(1.02)" : "scale(1)",
              boxShadow: accountType === "client" ? "0 20px 48px rgba(0,0,0,0.07)" : "none",
            }}>
            <div className="w-48 h-48 mb-8 overflow-hidden">
              <img
                src={CLIENT_IMG}
                alt="Client — Import / Export Freight"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3
              className="font-sans font-bold text-primary mb-2"
              style={{ fontSize: "26px", letterSpacing: "0.05em" }}>
              CLIENT
            </h3>
            <p
              className="font-mono text-[11px] tracking-[0.15em] mb-4"
              style={{ color: "#735c00" }}>
              IMPORT / EXPORT FREIGHT
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Global supply chain solutions for enterprises requiring sea, air,
              and land logistics.
            </p>
          </div>

          {/* BUSINESS */}
          <div
            onClick={() => selectType("business")}
            className="group cursor-pointer border flex flex-col items-center text-center p-10 transition-all duration-500"
            style={{
              borderColor: accountType === "business" ? "#000000" : "rgba(198,198,205,0.5)",
              backgroundColor: accountType === "business" ? "#ffffff" : "#f3f3f4",
              transform: accountType === "business" ? "scale(1.02)" : "scale(1)",
              boxShadow: accountType === "business" ? "0 20px 48px rgba(0,0,0,0.07)" : "none",
            }}>
            <div className="w-48 h-48 mb-8 overflow-hidden">
              <img
                src={BUSINESS_IMG}
                alt="Business — Invoicing & Documents"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3
              className="font-sans font-bold text-primary mb-2"
              style={{ fontSize: "26px", letterSpacing: "0.05em" }}>
              BUSINESS
            </h3>
            <p
              className="font-mono text-[11px] tracking-[0.15em] mb-4"
              style={{ color: "#735c00" }}>
              INVOICING &amp; DOCUMENTS
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs">
              For partners focusing on document management, customs clearance,
              and fiscal logistics.
            </p>
          </div>
        </section>

        {/* ── Registration form (expands after card selection) ── */}
        <div
          id="reg-form"
          style={{
            maxHeight: formVisible ? "1400px" : "0px",
            opacity:   formVisible ? 1 : 0,
            overflow:  "hidden",
            transition: "max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
          }}>
          <div className="border-t pt-16 max-w-4xl" style={{ borderColor: "#c6c6cd" }}>

            <div className="mb-12">
              <h2
                className="font-sans font-bold text-primary mb-2"
                style={{ fontSize: "26px", letterSpacing: "0.02em" }}>
                Complete Registration
              </h2>
              <p className="font-sans text-sm text-on-surface-variant">
                {accountType === "client"
                  ? "Streamline your import/export operations with our specialised tools."
                  : "Manage global invoicing and customs documentation with surgical precision."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">

              {/* Full Name */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  FULL NAME
                </label>
                <input
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="John Doe" required
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </div>

              {/* Email */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="john@example.com" required
                  value={form.email} onChange={e => set("email", e.target.value)} />
              </div>

              {/* Company */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  COMPANY NAME
                </label>
                <input
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="Navkar Global Ltd." required
                  value={form.company} onChange={e => set("company", e.target.value)} />
              </div>

              {/* Phone */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="+91 98765 43210" required
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>

              {/* Password */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="Min 8 characters" required
                  value={form.password} onChange={e => set("password", e.target.value)} />
              </div>

              {/* Confirm password */}
              <div className="relative pt-5">
                <label
                  className="font-mono text-[11px] tracking-[0.1em] absolute top-0 left-0"
                  style={{ color: "#735c00" }}>
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  className={fieldCls} style={fieldStyle}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="Repeat password" required
                  value={form.confirm} onChange={e => set("confirm", e.target.value)} />
              </div>

              {/* Error + submit row */}
              <div className="col-span-full pt-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="flex-1">
                  {error ? (
                    <div
                      className="pl-4 py-2.5 text-sm font-sans"
                      style={{ borderLeft: "2px solid #ba1a1a", backgroundColor: "#fff8f8", color: "#ba1a1a" }}>
                      {error}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-md">
                      By creating an account you agree to our{" "}
                      <a href="#" className="text-primary underline underline-offset-4 decoration-1">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-primary underline underline-offset-4 decoration-1">Privacy Policy</a>.
                    </p>
                  )}
                </div>
                <button
                  type="submit" disabled={loading}
                  className="shrink-0 inline-flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.15em] py-4 px-12 transition-all duration-300 hover:opacity-80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#000000", color: "#ffffff" }}>
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      CREATING ACCOUNT
                    </>
                  ) : (
                    `CREATE ${(accountType ?? "").toUpperCase()} ACCOUNT`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Already have account */}
        <p className="mt-16 font-sans text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in →
          </Link>
        </p>
      </main>

      {/* Fixed watermark */}
      <div
        className="fixed bottom-0 right-0 pointer-events-none select-none overflow-hidden z-0"
        style={{ opacity: 0.03 }}>
        <span
          className="font-display font-bold"
          style={{ fontSize: "clamp(160px, 18vw, 260px)", lineHeight: 1, letterSpacing: "-0.04em" }}>
          NAVKAR
        </span>
      </div>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 border-t"
        style={{ backgroundColor: "#f9f9f9", borderColor: "#c6c6cd" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-20 pt-20 pb-10 max-w-[1440px] mx-auto">

          <div className="md:col-span-6">
            <div className="mb-6 opacity-10">
              <NavkarLogo variant="wordmark" className="h-14 w-auto" />
            </div>
            <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Global logistics redefined through surgical precision and
              avant-garde architectural efficiency.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "#735c00" }}>
              NETWORK
            </span>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
              GLOBAL NETWORK
            </a>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
              CAREERS
            </a>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "#735c00" }}>
              LEGAL
            </span>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
              PRIVACY
            </a>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
              TERMS
            </a>
          </div>

          <div
            className="col-span-full mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderTop: "1px solid rgba(198,198,205,0.2)" }}>
            <span className="font-mono text-[10px] tracking-widest text-on-surface-variant/50">
              © {new Date().getFullYear()} NAVKAR IMPEX. LOGISTICS REDEFINED.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
