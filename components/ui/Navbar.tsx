"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Ship, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Shipment" },
  { href: "/quote", label: "Get Quote" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const dashLink = (session?.user as { role?: string })?.role === "ADMIN"
    ? "/dashboard/admin"
    : "/dashboard/client";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-deep/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent-teal rounded-lg flex items-center justify-center group-hover:bg-accent-gold transition-colors">
              <Ship className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-heading font-bold text-lg">
              Navkar <span className="text-accent-teal">Exim</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-accent-teal text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={dashLink}
                  className="text-sm text-gray-300 hover:text-accent-teal font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-300 hover:text-accent-teal font-medium transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-accent-teal text-sm font-medium py-2 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href={dashLink} className="text-gray-300 hover:text-accent-teal text-sm font-medium py-2">Dashboard</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-primary text-sm w-full">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-accent-teal text-sm font-medium py-2">Login</Link>
                  <Link href="/signup" className="btn-primary text-sm text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
