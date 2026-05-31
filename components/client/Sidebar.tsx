"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NavkarLogo from "@/components/NavkarLogo";

const NAV = [
  { label: "Dashboard",  href: "/dashboard/client",            icon: "dashboard" },
  { label: "Shipments",  href: "/dashboard/client/shipments",  icon: "directions_boat" },
  { label: "Documents",  href: "/dashboard/client/documents",  icon: "description" },
  { label: "Invoices",   href: "/dashboard/client/invoices",   icon: "receipt_long" },
  { label: "Get Quote",  href: "/dashboard/client/quotes",     icon: "request_quote" },
];

export default function ClientSidebar() {
  const path = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      className="w-[280px] bg-white border-r border-outline-variant/30 flex flex-col h-screen sticky top-0 flex-shrink-0 z-50"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

      {/* Logo */}
      <div className="px-8 py-8 flex items-center gap-3 border-b border-outline-variant/20">
        <NavkarLogo variant="symbol" symbolSize={36} />
        <NavkarLogo variant="wordmark" className="h-8 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon }) => {
          const active = path === href || (href !== "/dashboard/client" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: active ? "#000000" : "transparent",
                color: active ? "#ffffff" : "#45464d",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f3f4"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-6 border-t border-outline-variant/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
            <span className="font-mono text-[12px] font-bold text-secondary">
              {session?.user?.name?.charAt(0).toUpperCase() ?? "C"}
            </span>
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-on-surface truncate max-w-[140px]">
              {session?.user?.name ?? "Client"}
            </p>
            <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/60 uppercase">
              Client Portal
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low transition-all duration-200">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-mono text-[11px] tracking-widest uppercase">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
