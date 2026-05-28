"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, FolderOpen, Receipt, MessageSquare, LogOut, Ship } from "lucide-react";

const navItems = [
  { href: "/dashboard/client", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/client/shipments", icon: Package, label: "My Shipments" },
  { href: "/dashboard/client/documents", icon: FolderOpen, label: "Documents" },
  { href: "/dashboard/client/invoices", icon: Receipt, label: "Invoices" },
  { href: "/dashboard/client/support", icon: MessageSquare, label: "Support" },
];

export function ClientSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary-deep flex flex-col min-h-screen fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-teal rounded-lg flex items-center justify-center">
            <Ship className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-heading font-bold text-sm">
            Navkar <span className="text-accent-teal">Exim</span>
          </span>
        </Link>
      </div>

      <div className="px-6 py-4 border-b border-white/10">
        <p className="text-xs text-accent-teal font-semibold uppercase tracking-wider mb-1">Client Portal</p>
        <p className="text-white text-sm font-medium truncate">{userName}</p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard/client" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-accent-teal text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link href="/quote" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors mb-1">
          Get New Quote
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
