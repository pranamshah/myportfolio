"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Ship, FileText, FolderOpen, MessageSquare, LogOut, ChevronRight } from "lucide-react";
import NavkarLogo from "@/components/NavkarLogo";

const nav = [
  { label: "Overview", href: "/dashboard/client", icon: LayoutDashboard },
  { label: "My Shipments", href: "/dashboard/client/shipments", icon: Ship },
  { label: "Request Quote", href: "/dashboard/client/quotes", icon: MessageSquare },
  { label: "Invoices", href: "/dashboard/client/invoices", icon: FileText },
  { label: "Documents", href: "/dashboard/client/documents", icon: FolderOpen },
];

export default function ClientSidebar() {
  const path = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-60 bg-surface-primary border-r border-surface-hover flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="px-5 py-5 border-b border-surface-hover">
        <NavkarLogo variant="symbol" symbolSize={38} className="mb-2" />
        <NavkarLogo variant="wordmark" className="h-7 w-auto mb-1" />
        <div className="text-xs text-ink-muted mt-1 truncate max-w-[140px]">{session?.user?.name}</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="section-heading px-2 mb-2">Client Portal</p>
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href || (href !== "/dashboard/client" && path.startsWith(href));
          return (
            <Link key={href} href={href} className={`sidebar-link ${active ? "active" : ""}`}>
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={12} className="text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-surface-hover">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link w-full text-left text-danger/80 hover:text-danger hover:bg-danger/10"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
