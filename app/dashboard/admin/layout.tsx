import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />

      {/* Fixed top header */}
      <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-black z-40 px-10 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]" style={{ color: "rgba(0,0,0,0.35)" }}>
              search
            </span>
            <input
              className="w-full bg-white border border-black/10 py-2.5 pl-10 pr-4 font-mono text-[11px] focus:outline-none focus:border-black transition-all"
              placeholder="Search clients, invoices, shipments..."
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-black/50 hover:text-black transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#735c00" }} />
          </button>
          <div className="w-px h-8 bg-black/10" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-mono text-[11px] font-bold text-black leading-tight">{session.user.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest leading-tight" style={{ color: "#735c00" }}>
                Super Admin
              </p>
            </div>
            <div className="w-9 h-9 border border-black bg-black flex items-center justify-center flex-shrink-0">
              <span className="font-mono font-bold text-white text-xs">{initials}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 pt-20">
        {children}
      </main>
    </div>
  );
}
