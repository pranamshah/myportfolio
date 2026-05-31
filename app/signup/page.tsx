"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  const inputCls = "w-full border-0 border-b bg-transparent pb-2.5 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none transition-colors font-sans";
  const inputStyle = { borderBottom: "1px solid #c6c6cd", borderRadius: 0 };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderBottomColor = "#000000");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderBottomColor = "#c6c6cd");

  return (
    <div className="min-h-screen flex items-center justify-center canvas-bg py-12 px-5"
      style={{ backgroundColor: "#f9f9f9" }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <NavkarLogo variant="symbol" symbolSize={32} />
          <NavkarLogo variant="wordmark" className="h-6 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white border border-outline-variant p-10 shadow-sm">

          <p className="font-mono text-[11px] tracking-[0.2em] mb-3 uppercase" style={{ color: "#735c00" }}>
            New Account
          </p>
          <h1 className="font-display mb-2" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Create your account.
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mb-8">Choose your account type to get started</p>

          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {(["business", "client"] as const).map(type => (
              <button key={type} type="button" onClick={() => setAccountType(type)}
                className="p-4 text-left transition-all border-2"
                style={{
                  borderColor: accountType === type ? "#735c00" : "#c6c6cd",
                  backgroundColor: accountType === type ? "rgba(115,92,0,0.03)" : "#fafafa",
                }}>
                <div className="w-8 h-8 flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: accountType === type ? "rgba(115,92,0,0.1)" : "#eeeeee",
                  }}>
                  {type === "business" ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="5" width="14" height="10" stroke={accountType === "business" ? "#735c00" : "#76777d"} strokeWidth="1.5" fill="none"/>
                      <path d="M5 5V3a3 3 0 016 0v2" stroke={accountType === "business" ? "#735c00" : "#76777d"} strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke={accountType === "client" ? "#735c00" : "#76777d"} strokeWidth="1.5"/>
                      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={accountType === "client" ? "#735c00" : "#76777d"} strokeWidth="1.5"/>
                    </svg>
                  )}
                </div>
                <div className="font-sans text-sm font-semibold mb-0.5 capitalize"
                  style={{ color: accountType === type ? "#1a1c1c" : "#45464d" }}>
                  {type}
                </div>
                <div className="font-sans text-[11px] text-on-surface-variant leading-snug">
                  {type === "business" ? "Manage shipments, invoices & clients" : "Track cargo, view invoices & docs"}
                </div>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Full Name *</label>
                <input className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  placeholder="John Doe" required value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Company *</label>
                <input className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  placeholder="ACME Pvt Ltd" required value={form.company} onChange={e => set("company", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Email Address *</label>
              <input type="email" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                placeholder="you@company.com" required value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Phone Number *</label>
              <input type="tel" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                placeholder="+91 98765 43210" required value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Password *</label>
                <input type="password" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  placeholder="Min 8 chars" required value={form.password} onChange={e => set("password", e.target.value)} />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-on-surface-variant mb-2">Confirm *</label>
                <input type="password" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  placeholder="Repeat" required value={form.confirm} onChange={e => set("confirm", e.target.value)} />
              </div>
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
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> CREATING ACCOUNT</>
              ) : `CREATE ${accountType.toUpperCase()} ACCOUNT →`}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-on-surface-variant mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>

        <p className="text-center font-mono text-[10px] tracking-widest text-on-surface-variant/40 uppercase mt-6">
          © {new Date().getFullYear()} Navkar Impex
        </p>
      </div>
    </div>
  );
}
