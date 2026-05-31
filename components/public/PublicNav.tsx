"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavkarLogo from "@/components/NavkarLogo";

const NAV_LINKS = [
  { label: "SERVICES", href: "#services" },
  { label: "HOW IT WORKS", href: "#process" },
  { label: "ABOUT", href: "#about" },
];

export default function PublicNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dashHref = session?.user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      bg-surface/80 backdrop-blur-md border-b border-outline-variant/30
      ${scrolled ? "shadow-sm py-4" : "py-5"}`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2.5">
            <NavkarLogo variant="symbol" symbolSize={48} />
            <NavkarLogo variant="wordmark" className="h-11 w-auto" />
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="font-mono text-[11px] tracking-[0.12em] text-on-surface-variant hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-5">
          {session ? (
            <Link href={dashHref}
              className="bg-primary text-on-primary font-mono text-[11px] tracking-[0.12em] px-7 py-3 hover:opacity-80 transition-opacity">
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="font-mono text-[11px] tracking-[0.12em] text-on-surface-variant hover:text-primary transition-colors">
                LOGIN
              </Link>
              <Link href="/signup"
                className="bg-primary text-on-primary font-mono text-[11px] tracking-[0.12em] px-7 py-3 hover:opacity-80 transition-opacity active:scale-95">
                GET QUOTE
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden font-mono text-[11px] tracking-widest text-primary"
          onClick={() => setOpen(o => !o)}>
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface border-t border-outline-variant px-5 py-6 space-y-4">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="block font-mono text-[11px] tracking-[0.12em] text-on-surface-variant hover:text-primary py-2"
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
            {session ? (
              <Link href={dashHref}
                className="font-mono text-[11px] tracking-widest bg-primary text-on-primary px-6 py-3 text-center"
                onClick={() => setOpen(false)}>
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="font-mono text-[11px] tracking-widest border border-outline text-on-surface-variant px-6 py-3 text-center"
                  onClick={() => setOpen(false)}>
                  LOGIN
                </Link>
                <Link href="/signup"
                  className="font-mono text-[11px] tracking-widest bg-primary text-on-primary px-6 py-3 text-center"
                  onClick={() => setOpen(false)}>
                  GET QUOTE
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
