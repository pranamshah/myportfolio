"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "About", href: "#about" },
];

export default function PublicNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dashHref = session?.user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-gray-900 font-semibold text-base tracking-tight">
            Navkar Impex
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <Link href={dashHref}
              className="text-sm font-semibold bg-[#C9A452] text-white px-4 py-2 rounded-md hover:bg-[#b8922f] transition-colors">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="text-sm font-medium text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                Login
              </Link>
              <Link href="/signup"
                className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1 text-gray-500 hover:text-gray-900 transition-colors"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="block text-sm text-gray-600 hover:text-gray-900 py-1.5 font-medium"
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {session ? (
              <Link href={dashHref}
                className="text-sm font-semibold bg-[#C9A452] text-white px-4 py-2 rounded-md text-center">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-md text-center">
                  Login
                </Link>
                <Link href="/signup"
                  className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-md text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
