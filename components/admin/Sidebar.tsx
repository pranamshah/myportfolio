"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Overview",  href: "/dashboard/admin",            icon: "dashboard" },
  { label: "Shipments", href: "/dashboard/admin/shipments",  icon: "local_shipping" },
  { label: "Clients",   href: "/dashboard/admin/clients",    icon: "groups" },
  { label: "Invoices",  href: "/dashboard/admin/invoices",   icon: "receipt_long" },
  { label: "Documents", href: "/dashboard/admin/documents",  icon: "folder_open" },
  { label: "Quotes",    href: "/dashboard/admin/quotes",     icon: "request_quote" },
  { label: "Partners",  href: "/dashboard/admin/partners",   icon: "handshake" },
  { label: "Finance",   href: "/dashboard/admin/accounting", icon: "account_balance" },
  { label: "Settings",  href: "/dashboard/admin/settings",   icon: "settings" },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-black text-white border-r border-black flex flex-col py-8 z-50">
      <div className="px-6 mb-12">
        <h1 className="font-display text-white font-bold tracking-tight" style={{ fontSize: "24px" }}>
          Navkar Impex
        </h1>
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase mt-1" style={{ color: "#735c00" }}>
          Global Logistics
        </p>
      </div>

      <nav className="flex-1">
        {NAV.map(({ label, href, icon }) => {
          const active = path === href || (href !== "/dashboard/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ${
                active
                  ? "font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              style={active ? { backgroundColor: "#735c00", color: "#000000" } : undefined}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
              <span className="font-mono uppercase tracking-widest text-[11px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto pt-8 space-y-3">
        <Link
          href="/dashboard/admin/shipments"
          className="w-full py-4 font-mono font-bold uppercase tracking-widest text-[11px] transition-colors duration-300 flex items-center justify-center gap-2 hover:bg-white hover:text-black"
          style={{ backgroundColor: "#735c00", color: "#000000" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          New Shipment
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full py-3 font-mono text-[11px] tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
