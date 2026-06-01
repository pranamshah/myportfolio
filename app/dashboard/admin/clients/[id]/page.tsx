import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Shipment from "@/models/Shipment";
import Invoice from "@/models/Invoice";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatINR, formatDate, STATUS_LABEL } from "@/lib/utils";

const STATUS_BADGE: Record<string, { cls: string }> = {
  IN_TRANSIT:         { cls: "bg-black text-white" },
  ON_VESSEL:          { cls: "bg-black text-white" },
  UNDER_CUSTOMS_EXAM: { cls: "text-black font-bold" },
  BOOKING_CONFIRMED:  { cls: "border border-black/30 text-black/70" },
  DELIVERED:          { cls: "border border-black/20 text-black/40" },
  COMPLETED:          { cls: "border border-black/10 text-black/30" },
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: "Client Detail — Navkar Impex Admin" };
}

type ClientData = {
  _id: string; name: string; email: string; company?: string; phone?: string;
  gst?: string; address?: string; isActive: boolean; createdAt: Date;
};
type ShipmentData = {
  _id: string; shipmentId: string; status: string; origin: string;
  destination: string; eta?: Date; updatedAt: Date;
};
type InvoiceData = {
  _id: string; invoiceNo: string; totalAmount: number; amountPaid: number;
  status: string; invoiceDate: Date;
};

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  await connectDB();

  let client: ClientData;
  let shipments: ShipmentData[] = [];
  let invoices: InvoiceData[] = [];

  try {
    const found = await User.findById(params.id).select("-password").lean();
    if (!found) notFound();
    client = found as unknown as ClientData;

    [shipments, invoices] = await Promise.all([
      Shipment.find({ client: params.id })
        .sort({ createdAt: -1 })
        .select("shipmentId status origin destination eta updatedAt")
        .lean() as unknown as ShipmentData[],
      Invoice.find({ client: params.id })
        .sort({ invoiceDate: -1 })
        .select("invoiceNo totalAmount amountPaid status invoiceDate")
        .lean() as unknown as InvoiceData[],
    ]);
  } catch {
    notFound();
  }

  // After notFound() throws, TypeScript needs help narrowing — this is unreachable in practice
  const c = client!;

  const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const outstanding = invoices.reduce((s, i) => s + Math.max(0, i.totalAmount - i.amountPaid), 0);
  const activeShipments = shipments.filter(s => !["DELIVERED", "COMPLETED"].includes(s.status)).length;
  const initials = c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="bg-white min-h-screen">

      {/* Dark hero */}
      <section className="text-white pt-16 pb-24 px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #131b2e 0%, #000000 100%)" }}>
        <div className="absolute right-0 bottom-0 pointer-events-none select-none" style={{ opacity: 0.06 }}>
          <span className="font-display leading-none" style={{ fontSize: "200px", fontWeight: 700 }}>GLOBAL</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 relative z-10 max-w-[1440px] mx-auto">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <Link href="/dashboard/admin" className="font-mono text-[11px] text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                Admin
              </Link>
              <span className="text-white/30">/</span>
              <Link href="/dashboard/admin/clients" className="font-mono text-[11px] text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                Clients
              </Link>
              <span className="text-white/30">/</span>
              <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#735c00" }}>
                Detail
              </span>
            </div>

            {/* Company header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center border border-white/20"
                style={{ backgroundColor: "#735c00" }}>
                <span className="font-display font-bold text-black text-xl">{initials}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "#735c00" }}>
                  {c.isActive ? "Active Client" : "Inactive"}
                </span>
                <h2 className="font-display text-white font-bold leading-tight"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
                  {c.company || c.name}
                </h2>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap gap-10 mt-6 border-t border-white/10 pt-8">
              <div>
                <p className="font-mono text-[10px] text-white/50 mb-1 uppercase tracking-widest">Contact</p>
                <p className="font-sans text-white font-semibold">{c.name}</p>
                <p className="font-sans text-white/60 text-sm">{c.email}</p>
              </div>
              {c.phone && (
                <div>
                  <p className="font-mono text-[10px] text-white/50 mb-1 uppercase tracking-widest">Phone</p>
                  <p className="font-sans text-white font-semibold">{c.phone}</p>
                </div>
              )}
              {c.gst && (
                <div>
                  <p className="font-mono text-[10px] text-white/50 mb-1 uppercase tracking-widest">GSTIN</p>
                  <p className="font-mono text-white font-bold tracking-wider">{c.gst}</p>
                </div>
              )}
              {c.address && (
                <div>
                  <p className="font-mono text-[10px] text-white/50 mb-1 uppercase tracking-widest">Location</p>
                  <p className="font-sans text-white/70 text-sm max-w-[200px]">{c.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link href={`/dashboard/admin/clients`}
              className="bg-white text-black px-7 py-4 font-mono font-bold text-[11px] uppercase tracking-widest hover:bg-secondary hover:text-black transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
              All Clients
            </Link>
            <a href={`mailto:${c.email}`}
              className="border border-white/30 text-white px-7 py-4 font-mono font-bold text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mail</span>
              Email
            </a>
          </div>
        </div>
      </section>

      {/* KPI Cards — overlap the hero */}
      <section className="px-10 -mt-14 relative z-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "inventory_2",    label: "Total Shipments", value: String(shipments.length),    sub: "All time",       err: false },
            { icon: "rocket_launch",  label: "Active Shipments", value: String(activeShipments),    sub: "In progress",    err: false },
            { icon: "payments",       label: "Total Invoiced",   value: formatINR(totalInvoiced),   sub: "All invoices",   err: false },
            { icon: "pending_actions",label: "Outstanding",      value: formatINR(outstanding),     sub: "Pending payment",err: outstanding > 0 },
          ].map(card => (
            <div key={card.label}
              className={`bg-white p-8 border transition-all duration-300 ${
                card.err ? "border-red-200 hover:border-red-500" : "border-black/10 hover:border-secondary"
              }`}>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-[22px]"
                  style={{ color: card.err ? "#dc2626" : "#735c00" }}>
                  {card.icon}
                </span>
              </div>
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-2 font-bold">
                {card.label}
              </p>
              <h3 className="font-display font-bold leading-tight"
                style={{ fontSize: "26px", color: card.err ? "#dc2626" : "#000000" }}>
                {card.value}
              </h3>
              <p className="font-mono text-[10px] text-black/30 uppercase tracking-widest mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipments Section */}
      <section className="px-10 mt-16 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center border-b border-black pb-4 mb-0">
          <h3 className="font-display italic font-bold text-black" style={{ fontSize: "28px" }}>
            Shipment History
          </h3>
          <Link href="/dashboard/admin/shipments"
            className="font-mono text-[11px] font-bold uppercase tracking-widest hover:text-black transition-colors"
            style={{ color: "#735c00" }}>
            All Shipments →
          </Link>
        </div>

        <div className="bg-white border border-black/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/5">
              <tr>
                {["Job ID", "Route", "ETA", "Status", "Last Updated", ""].map(h => (
                  <th key={h} className="px-6 py-4 font-mono text-[10px] text-black/40 uppercase tracking-widest font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {shipments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center font-mono text-[11px] text-black/30 uppercase tracking-widest">
                  No shipments yet
                </td></tr>
              ) : shipments.map(s => {
                const cfg = STATUS_BADGE[s.status] ?? { cls: "border border-black/10 text-black/40" };
                const isCustoms = s.status === "UNDER_CUSTOMS_EXAM" || s.status === "CUSTOMS_CLEARED";
                return (
                  <tr key={s._id.toString()} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-5 font-mono font-bold text-[13px] text-black">{s.shipmentId}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-black">{s.origin}</p>
                      <p className="font-mono text-[11px] text-black/40 uppercase">{s.destination}</p>
                    </td>
                    <td className="px-6 py-5 font-mono text-[11px] text-black/50">{s.eta ? formatDate(s.eta) : "—"}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cfg.cls}`}
                        style={isCustoms ? { backgroundColor: "#735c00" } : undefined}
                      >
                        {STATUS_LABEL[s.status] || s.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-[11px] text-black/40">{formatDate(s.updatedAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/dashboard/admin/shipments/${s._id}`}
                        className="font-mono text-[10px] font-bold uppercase border border-black px-5 py-2 hover:bg-black hover:text-white transition-all tracking-widest"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invoices + Audit sections */}
      <section className="px-10 mt-12 mb-16 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Invoices table — 2/3 */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display italic font-bold text-black" style={{ fontSize: "24px" }}>
              Invoices
            </h3>
            <Link href="/dashboard/admin/invoices"
              className="font-mono text-[11px] font-bold uppercase tracking-widest hover:text-black transition-colors"
              style={{ color: "#735c00" }}>
              All Invoices →
            </Link>
          </div>
          <div className="bg-white border border-black/10">
            <table className="w-full text-left">
              <thead className="bg-black/5">
                <tr>
                  {["Invoice No", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="px-5 py-3 font-mono text-[10px] text-black/40 uppercase tracking-widest font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {invoices.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center font-mono text-[11px] text-black/30 uppercase">No invoices</td></tr>
                ) : invoices.slice(0, 8).map(inv => (
                  <tr key={inv._id.toString()} className="hover:bg-black/5 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[12px] text-black">{inv.invoiceNo}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-black">{formatINR(inv.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        inv.status === "PAID" ? "text-black font-bold border-0" :
                        inv.status === "OVERDUE" ? "border border-red-600 text-red-600" :
                        "border border-black/20 text-black/50"
                      }`}
                        style={inv.status === "PAID" ? { backgroundColor: "#735c00", color: "#000" } : undefined}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-black/40">{formatDate(inv.invoiceDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Account Manager Card — 1/3 */}
        <div className="text-white p-8 flex flex-col justify-between overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #131b2e 0%, #000000 100%)", minHeight: "300px" }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 border border-white/5 rounded-full" style={{ borderRadius: "50%" }} />
          <div>
            <h4 className="font-display italic font-bold text-white mb-1" style={{ fontSize: "22px" }}>Account Manager</h4>
            <p className="font-sans text-white/60 text-sm mb-6">Direct support for {c.company || c.name}.</p>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 border-2 border-secondary flex items-center justify-center bg-secondary text-black font-bold font-mono text-sm">
                PS
              </div>
              <div>
                <p className="font-sans font-bold text-white">Pranam Shah</p>
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#735c00" }}>
                  Sr. Logistics Partner
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <a href="mailto:navkarimpex.co@gmail.com"
              className="w-full bg-white text-black py-3 font-mono font-bold text-[11px] uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>mail</span>
              Direct Email
            </a>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-center">
              Member since {new Date(c.createdAt).getFullYear()}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
