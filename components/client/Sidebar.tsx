"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Ship, FileText, FolderOpen, MessageSquare, LogOut, Package, ChevronRight } from "lucide-react";

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
      <div className="px-5 py-6 border-b border-surface-hover">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-gold/40 flex items-center justify-center flex-shrink-0">
            <Package size={14} className="text-gold" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-ink leading-tight">Navkar Impex</div>
            <div className="text-xs text-ink-muted truncate max-w-[120px]">{session?.user?.name}</div>
          </div>
        </div>
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
