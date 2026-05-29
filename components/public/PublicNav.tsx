"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, Anchor } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function PublicNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashHref = session?.user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-surface-deep/95 backdrop-blur-lg border-b border-surface-hover/80 shadow-2xl"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 border border-gold/40 rounded flex items-center justify-center
                          group-hover:border-gold/70 transition-colors duration-300">
            <Anchor size={15} className="text-gold" />
          </div>
          <span className="font-display text-xl font-light text-ink tracking-wide">
            Navkar <span className="text-gold">Impex</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm text-ink-secondary hover:text-ink transition-colors duration-200 relative group">
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link href={dashHref} className="btn-gold text-sm px-5 py-2">
              My Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="text-sm text-ink-secondary border border-surface-hover px-4 py-2 rounded
                           hover:border-gold/40 hover:text-ink transition-all duration-200">
                Login
              </Link>
              <Link href="/signup" className="btn-gold text-sm px-5 py-2">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface-primary/95 backdrop-blur-lg border-t border-surface-hover px-6 py-5 space-y-4">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="block text-ink-secondary hover:text-ink text-sm py-1.5 transition-colors"
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-4 border-t border-surface-hover flex flex-col gap-3">
            {session ? (
              <Link href={dashHref} className="btn-gold text-sm text-center">My Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm text-center">Login</Link>
                <Link href="/signup" className="btn-gold text-sm text-center">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
