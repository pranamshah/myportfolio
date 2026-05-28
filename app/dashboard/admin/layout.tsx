import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-light">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary-deep">{session.user?.name}</p>
              <p className="text-xs text-text-secondary">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-accent-teal rounded-full flex items-center justify-center text-white font-bold text-sm">
              {session.user?.name?.[0] || "A"}
            </div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
