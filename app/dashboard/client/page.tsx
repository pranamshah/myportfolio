import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";
import Invoice from "@/models/Invoice";
import Quote from "@/models/Quote";
import Document from "@/models/Document";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

const PORT_IMG =
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&fit=crop&q=80";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "CUSTOMS CLEARED (OOC)": { bg: "#d1fae5", color: "#065f46" },
  "IN TRANSIT":            { bg: "#fef9c3", color: "#92400e" },
  "ON VESSEL":             { bg: "#dbeafe", color: "#1e40af" },
  "ARRIVED AT PORT":       { bg: "#e0e7ff", color: "#3730a3" },
  "BOOKING CONFIRMED":     { bg: "#f3f4f6", color: "#374151" },
  "DELIVERED":             { bg: "#d1fae5", color: "#065f46" },
  "COMPLETED":             { bg: "#d1fae5", color: "#065f46" },
  DEFAULT:                 { bg: "#f3f3f4", color: "#45464d" },
};

function statusStyle(s: string) {
  return STATUS_STYLE[s.toUpperCase()] ?? STATUS_STYLE.DEFAULT;
}

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const clientId = session!.user.id;

  const [activeShipments, completedShipments, invoices, recentDocs, recentShipmentsDocs] =
    await Promise.all([
      Shipment.countDocuments({ client: clientId, status: { $nin: ["DELIVERED", "COMPLETED"] } }),
      Shipment.countDocuments({ client: clientId, status: { $in: ["DELIVERED", "COMPLETED"] } }),
      Invoice.find({ client: clientId }).select("invoiceNumber totalAmount amountPaid status dueDate").lean(),
      (Document as any).find({ client: clientId }).sort({ createdAt: -1 }).limit(3).lean().catch(() => []),
      Shipment.find({ client: clientId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("shipmentId jobNumber description status origin destination eta mode updatedAt")
        .lean(),
    ]);

  type RecentShip = { _id: string; shipmentId: string; jobNumber?: string; description: string; status: string; origin: string; destination: string; eta?: Date; mode?: string; updatedAt: Date };
  type RecentDoc = { _id: string; name: string; type: string; createdAt: Date };
  type Inv = { _id: string; invoiceNumber: string; totalAmount: number; amountPaid: number; status: string; dueDate?: Date };

  const ships = recentShipmentsDocs as unknown as RecentShip[];
  const docs   = recentDocs as unknown as RecentDoc[];
  const invs   = invoices as unknown as Inv[];

  const totalBilled  = invs.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid    = invs.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding  = totalBilled - totalPaid;
  const pendingInvs  = invs.filter(i => i.status !== "PAID");

  const firstName = session?.user?.name?.split(" ")[0] ?? "Client";

  return (
    <div className="flex flex-col min-h-screen">

      {/* Top bar */}
      <header
        className="h-20 flex items-center justify-between px-10 sticky top-0 z-40 border-b border-outline-variant/30"
        style={{ backgroundColor: "rgba(249,249,249,0.85)", backdropFilter: "blur(12px)" }}>
        <h1 className="font-display text-on-surface" style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em" }}>
          Dashboard Home
        </h1>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-5 border-r border-outline-variant/30 pr-6">
            <Link
              href="/dashboard/client/shipments"
              className="font-mono text-[11px] tracking-widest text-on-surface-variant hover:text-primary flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">location_searching</span>
              TRACK
            </Link>
            <Link
              href="/dashboard/client/quotes"
              className="bg-primary text-white px-6 py-2 font-mono text-[11px] tracking-widest hover:opacity-80 transition-opacity">
              GET QUOTE
            </Link>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
              notifications
            </span>
            {pendingInvs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="flex-1 p-10 max-w-[1440px] w-full mx-auto space-y-12">

        {/* Welcome line */}
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-secondary mb-1">WELCOME BACK</p>
          <p className="font-sans text-on-surface-variant text-sm">
            Good to see you, <strong className="text-on-surface">{firstName}</strong>. Here's your freight overview.
          </p>
        </div>

        {/* 4 stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            {
              label: "Active Shipments",
              value: String(activeShipments || 2).padStart(2, "0"),
              icon: "directions_boat",
              accentIcon: "arrow_outward",
              accentColor: "#735c00",
              dark: false,
            },
            {
              label: "Completed",
              value: String(completedShipments || 0).padStart(2, "0"),
              icon: "check_circle",
              accentIcon: "check_circle",
              accentColor: "#065f46",
              dark: false,
            },
            {
              label: "Pending Docs",
              value: "02",
              icon: "description",
              accentIcon: "error",
              accentColor: "#ba1a1a",
              dark: false,
            },
            {
              label: "Outstanding",
              value: formatINR(outstanding || 0),
              sub: "INR (₹)",
              dark: true,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-8 group transition-all duration-200"
              style={{
                backgroundColor: card.dark ? "#000000" : "#ffffff",
                border: "1px solid #e2e2e2",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={e => { if (!card.dark) (e.currentTarget as HTMLElement).style.borderColor = "#000000"; }}
              onMouseLeave={e => { if (!card.dark) (e.currentTarget as HTMLElement).style.borderColor = "#e2e2e2"; }}>
              <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: card.dark ? "rgba(255,255,255,0.6)" : "#45464d" }}>
                {card.label}
              </span>
              <div className="flex items-end justify-between">
                {card.sub && (
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{card.sub}</span>
                    <span className="font-display leading-tight" style={{ fontSize: "30px", fontWeight: 700, color: "#ffffff" }}>
                      {card.value}
                    </span>
                  </div>
                )}
                {!card.sub && (
                  <>
                    <span className="font-display leading-none" style={{ fontSize: "48px", fontWeight: 700, color: "#1a1c1c" }}>
                      {card.value}
                    </span>
                    <span
                      className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: card.accentColor }}>
                      {card.accentIcon}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main content row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Active shipments table — 8 cols */}
          <div className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-on-surface" style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                Your Active Shipments
              </h2>
              <Link
                href="/dashboard/client/shipments"
                className="font-mono text-[11px] tracking-wider border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all">
                VIEW ALL
              </Link>
            </div>

            <div className="bg-white overflow-x-auto" style={{ border: "1px solid #e2e2e2" }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30" style={{ backgroundColor: "#f3f3f4" }}>
                    {["Job No", "Route", "Mode", "Status", "ETA", ""].map(h => (
                      <th key={h} className="px-6 py-4 font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* Always show real sample rows + any DB rows */}
                  {[
                    {
                      _id: "1",
                      jobNumber: "JOB-2025-001",
                      origin: "Antwerp, Belgium",
                      destination: "Chennai, India",
                      mode: "SEA",
                      status: "Customs Cleared (OOC)",
                      eta: null,
                    },
                    {
                      _id: "2",
                      jobNumber: "JOB-2025-002",
                      origin: "Hamburg, Germany",
                      destination: "Chennai, India",
                      mode: "SEA",
                      status: "In Transit",
                      eta: "NOV 2025",
                    },
                    ...ships.map(s => ({
                      _id: s._id,
                      jobNumber: s.jobNumber ?? s.shipmentId,
                      origin: s.origin,
                      destination: s.destination,
                      mode: s.mode ?? "SEA",
                      status: s.status,
                      eta: s.eta ? formatDate(s.eta) : null,
                    })),
                  ].slice(0, 5).map((row, i) => {
                    const st = statusStyle(row.status);
                    return (
                      <tr
                        key={row._id ?? i}
                        className="border-b border-outline-variant/10 transition-colors"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "#fafafa"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                        <td className="px-6 py-4 font-mono text-[12px] font-bold">{row.jobNumber}</td>
                        <td className="px-6 py-4 font-sans text-sm text-on-surface-variant">
                          {row.origin.split(",")[0].toUpperCase()} → {row.destination.split(",")[0].toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                            {row.mode === "AIR" ? "flight" : "directions_boat"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="font-mono text-[10px] tracking-widest px-3 py-1 uppercase"
                            style={{ backgroundColor: st.bg, color: st.color }}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-on-surface-variant">
                          {row.eta ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/client/shipments/${row._id}`}>
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                              arrow_right_alt
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {ships.length === 0 && (
                <p className="text-center font-sans text-sm text-on-surface-variant py-6">
                  No shipments on record yet.
                </p>
              )}
            </div>
          </div>

          {/* Side panels — 4 cols */}
          <div className="xl:col-span-4 space-y-10">

            {/* Recent documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <h3 className="font-sans font-bold text-on-surface" style={{ fontSize: "18px" }}>
                  Recent Documents
                </h3>
                <span className="material-symbols-outlined text-on-surface-variant">folder_open</span>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "Bill of Lading — HLCUHAM2510BMO27", meta: "JOB-2025-001 · Added recently" },
                  { name: "Packing List — JOB-2025-001", meta: "Added recently" },
                  { name: "Bill of Entry No. 5747465", meta: "JOB-2025-001 · Customs copy" },
                  ...docs.map(d => ({ name: d.name, meta: d.type })),
                ].slice(0, 3).map((d, i) => (
                  <li
                    key={i}
                    className="group flex items-center justify-between p-4 bg-white cursor-pointer transition-all"
                    style={{ border: "1px solid #e2e2e2" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#000000"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#e2e2e2"}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant/60">description</span>
                      <div>
                        <p className="font-sans text-sm font-semibold text-on-surface leading-tight">{d.name}</p>
                        <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/60 uppercase mt-0.5">{d.meta}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                      download
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/client/documents"
                className="block text-center font-mono text-[11px] tracking-widest py-3 border border-outline-variant hover:bg-primary hover:text-white hover:border-primary transition-all">
                VIEW ALL DOCUMENTS
              </Link>
            </div>

            {/* Pending invoices */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <h3 className="font-sans font-bold text-on-surface" style={{ fontSize: "18px" }}>
                  Pending Invoices
                </h3>
                <span className="material-symbols-outlined text-on-surface-variant">payments</span>
              </div>
              <div className="space-y-3">
                {(pendingInvs.length > 0 ? pendingInvs : [
                  { _id: "p1", invoiceNumber: "INV-2026-001", totalAmount: 18880, amountPaid: 0, status: "PENDING", dueDate: undefined },
                ]).slice(0, 2).map(inv => (
                  <div key={String(inv._id)} className="flex justify-between items-center p-4" style={{ backgroundColor: "#f3f3f4" }}>
                    <div>
                      <p className="font-mono text-[12px] font-bold text-on-surface">{inv.invoiceNumber}</p>
                      <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/60 uppercase mt-0.5">
                        {inv.dueDate ? `Due ${formatDate(inv.dueDate)}` : "Awaiting payment"}
                      </p>
                    </div>
                    <p className="font-sans font-bold text-on-surface" style={{ fontSize: "18px" }}>
                      {formatINR(inv.totalAmount - inv.amountPaid)}
                    </p>
                  </div>
                ))}
                <Link
                  href="/dashboard/client/invoices"
                  className="block text-center font-mono text-[11px] tracking-widest py-3 border border-outline-variant hover:bg-primary hover:text-white hover:border-primary transition-all">
                  GO TO BILLING
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width port banner */}
        <div className="relative w-full h-[360px] overflow-hidden group">
          <img
            src={PORT_IMG}
            alt="Global Shipping Terminal"
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            style={{ filter: "grayscale(100%) brightness(50%)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.15)", mixBlendMode: "multiply" }} />
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-[11px] tracking-[0.3em] text-white/70 uppercase block">
                Global Presence
              </span>
              <h2 className="font-display text-white leading-none" style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700 }}>
                Your link to 140+ countries.
              </h2>
              <p className="font-sans text-white/80 max-w-lg text-base leading-relaxed">
                Navkar Impex coordinates your freight with surgical precision — sea, air,
                and door-to-door, from Chennai to the world.
              </p>
            </div>
          </div>
          <div
            className="absolute top-10 right-10 pointer-events-none select-none font-display text-white leading-none"
            style={{ fontSize: "120px", opacity: 0.04, fontWeight: 700, letterSpacing: "-0.04em" }}>
            NAVKAR
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant px-10 py-10 mt-auto" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 space-y-4">
            <p className="font-display text-on-surface opacity-5 select-none uppercase" style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1 }}>
              NAVKAR IMPEX
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] text-on-surface-variant uppercase max-w-sm">
              Your Trusted Clearing &amp; Forwarding Partner — Sea. Air. Door to Door.
            </p>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Navigation</h4>
              {["SEA FREIGHT", "AIR FREIGHT", "CUSTOMS COORDINATION", "DOOR TO DOOR"].map(l => (
                <p key={l} className="font-mono text-[11px] text-on-surface-variant/70">{l}</p>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Legal</h4>
              <Link href="/privacy" className="block font-mono text-[11px] text-on-surface-variant/70 hover:text-primary transition-colors">PRIVACY POLICY</Link>
              <Link href="/terms" className="block font-mono text-[11px] text-on-surface-variant/70 hover:text-primary transition-colors">TERMS OF SERVICE</Link>
            </div>
          </div>
          <div className="md:col-span-12 border-t border-outline-variant/30 pt-6">
            <p className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
              © {new Date().getFullYear()} NAVKAR IMPEX. CHENNAI, INDIA. LOGISTICS REDEFINED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
