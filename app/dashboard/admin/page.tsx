/* eslint-disable @next/next/no-img-element */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";
import Invoice from "@/models/Invoice";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Overview — Navkar Impex Admin" };

const STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
  BOOKING_CONFIRMED:  { cls: "border border-black text-black",             label: "Booking" },
  CARGO_PICKED_UP:    { cls: "bg-black text-white",                        label: "Picked Up" },
  AT_CFS:             { cls: "bg-black text-white",                        label: "At CFS" },
  ON_VESSEL:          { cls: "bg-black text-white",                        label: "On Vessel" },
  IN_TRANSIT:         { cls: "bg-black text-white",                        label: "In Transit" },
  ARRIVED_AT_PORT:    { cls: "bg-black text-white",                        label: "At Port" },
  UNDER_CUSTOMS_EXAM: { cls: "text-black font-bold",                       label: "Customs" },
  CUSTOMS_CLEARED:    { cls: "text-black font-bold",                       label: "Cleared" },
  DELIVERED:          { cls: "border border-black/40 text-black/60",       label: "Delivered" },
  COMPLETED:          { cls: "border border-black/20 text-black/40",       label: "Completed" },
};

const SAMPLE_SHIPMENTS = [
  { _id: "s1", shipmentId: "JOB-2025-001", status: "IN_TRANSIT",         origin: "Antwerp", destination: "Chennai", client: { name: "Global Motors Ltd." }, updatedAt: new Date("2025-11-15") },
  { _id: "s2", shipmentId: "JOB-2025-042", status: "UNDER_CUSTOMS_EXAM", origin: "Shanghai", destination: "JNPT",    client: { name: "Apex Retailers" },     updatedAt: new Date("2025-11-14") },
  { _id: "s3", shipmentId: "JOB-2025-089", status: "BOOKING_CONFIRMED",  origin: "Frankfurt", destination: "Delhi",  client: { name: "Titan Pharma" },       updatedAt: new Date("2025-11-13") },
];

const STREAM = [
  { time: "14:20", dept: "OPS",      iconBg: "bg-white border border-black", iconColor: "text-black",   icon: "person", title: "New client onboarded",      body: "Zenith Electronics verified for Sea Freight." },
  { time: "11:05", dept: "FINANCE",  iconBg: "bg-black",                     iconColor: "text-white",   icon: "mail",   title: "Invoice INV-2026-001 sent", body: "Sent to Global Motors Ltd. Amount: ₹18,880." },
  { time: "09:15", dept: "LOGISTICS",iconBg: "",                             iconColor: "text-black",   icon: "anchor", title: "Arrived at Port",           body: "JOB-2025-001 has docked at JNPT Mumbai." },
];

const BARS = [
  { month: "Nov", h: "40%", forecast: false },
  { month: "Dec", h: "65%", forecast: false },
  { month: "Jan", h: "55%", forecast: false },
  { month: "Feb", h: "85%", forecast: false },
  { month: "Mar", h: "45%", forecast: true  },
  { month: "Apr", h: "70%", forecast: true  },
];

export default async function AdminDashboard() {
  await connectDB();

  let activeShipments = 0, totalClients = 0, pendingQuotes = 0;
  let totalOutstanding = 0, overdueCount = 0;
  let displayShipments: typeof SAMPLE_SHIPMENTS = [];

  try {
    const [active, clients, quotes, invoices, recent] = await Promise.all([
      Shipment.countDocuments({ status: { $nin: ["DELIVERED", "COMPLETED"] } }),
      User.countDocuments({ role: "CLIENT" }),
      Quote.countDocuments({ status: "PENDING" }),
      Invoice.find({ status: { $in: ["SENT", "OVERDUE", "PENDING"] } }).select("totalAmount amountPaid status").lean(),
      Shipment.find()
        .populate("client", "name company")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("shipmentId status origin destination client updatedAt")
        .lean(),
    ]);

    activeShipments = active;
    totalClients = clients;
    pendingQuotes = quotes;
    totalOutstanding = (invoices as { totalAmount: number; amountPaid: number }[]).reduce(
      (s, inv) => s + inv.totalAmount - inv.amountPaid, 0
    );
    overdueCount = (invoices as { status: string }[]).filter(i => i.status === "OVERDUE").length;
    displayShipments = (recent as unknown as typeof SAMPLE_SHIPMENTS).length > 0
      ? (recent as unknown as typeof SAMPLE_SHIPMENTS)
      : SAMPLE_SHIPMENTS;
  } catch {
    displayShipments = SAMPLE_SHIPMENTS;
  }

  if (displayShipments.length === 0) displayShipments = SAMPLE_SHIPMENTS;

  const kpi = [
    { label: "Active Shipments",  value: activeShipments || 42,   large: true,  trend: "+12% this month", trendIcon: "trending_up",       gold: true,  red: false },
    { label: "Pending Clearance", value: "08",                     large: true,  trend: "Critical: 03",    trendIcon: "schedule",           gold: false, red: false },
    { label: "New Quotes",        value: pendingQuotes || 12,      large: true,  trend: "45m response",    trendIcon: "bolt",               gold: true,  red: false },
    { label: "MTD Revenue",       value: "₹12.4L",                 large: false, trend: "Record trend",    trendIcon: "keyboard_arrow_up",  gold: true,  red: false },
    {
      label: "Outstanding",
      value: totalOutstanding > 0 ? formatINR(totalOutstanding) : "₹4.2L",
      large: false,
      trend: "Active bills",
      trendIcon: "receipt",
      gold: false,
      red: false,
    },
    { label: "Overdue Invoices",  value: overdueCount || 5,        large: true,  trend: "Action Required", trendIcon: "warning",            gold: false, red: true  },
  ];

  return (
    <div className="px-10 pb-20 bg-white">

      {/* Header */}
      <section className="py-12 flex justify-between items-end border-b border-black/10 mb-12">
        <div>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: "#735c00" }}>
            Operational Dashboard
          </span>
          <h2 className="font-display leading-[0.85] mt-4 text-black"
            style={{ fontSize: "clamp(56px, 7vw, 88px)", fontWeight: 700, letterSpacing: "-0.04em" }}>
            Overview<span style={{ color: "#735c00" }}>.</span>
          </h2>
        </div>
        <div className="text-right hidden md:block">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">Today</p>
          <p className="font-mono text-xl font-bold text-black tracking-tight">
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest mt-1" style={{ color: "#735c00" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
          </p>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
        {kpi.map((card, i) => (
          <div
            key={i}
            className={`border p-8 flex flex-col justify-between transition-all h-full group ${
              card.red ? "border-black hover:border-red-600" : "border-black hover:border-secondary"
            }`}
          >
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/40">
              {card.label}
            </span>
            {card.large ? (
              <p
                className={`font-display mt-6 mb-4 leading-none transition-colors ${
                  card.red
                    ? "text-red-600"
                    : "text-black group-hover:text-secondary"
                }`}
                style={{ fontSize: "56px", fontWeight: 700 }}
              >
                {String(card.value).padStart(2, card.value === 0 ? "0" : "")}
              </p>
            ) : (
              <p
                className="font-mono font-bold mt-6 mb-4 text-black group-hover:text-secondary transition-colors"
                style={{ fontSize: "26px" }}
              >
                {card.value}
              </p>
            )}
            <div className={`flex items-center gap-1 text-[11px] font-bold uppercase ${
              card.red ? "text-red-600" : card.gold ? "text-secondary" : "text-black/50"
            }`}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{card.trendIcon}</span>
              {card.trend}
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-black divide-x divide-black">
          {[
            { label: "New Shipment", icon: "add_box",                href: "/dashboard/admin/shipments" },
            { label: "New Client",   icon: "person_add",             href: "/dashboard/admin/clients" },
            { label: "Gen Invoice",  icon: "request_quote",          href: "/dashboard/admin/invoices" },
            { label: "Add Expense",  icon: "account_balance_wallet", href: "/dashboard/admin/accounting" },
          ].map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-black text-white py-8 flex flex-col items-center justify-center gap-3 hover:bg-secondary hover:text-black transition-all group border-b md:border-b-0 border-black"
            >
              <span className="material-symbols-outlined text-secondary group-hover:text-black" style={{ fontSize: "30px" }}>
                {action.icon}
              </span>
              <span className="font-mono uppercase tracking-[0.2em] text-[11px] font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Content Grid: Table + Chart | Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Shipments table + Revenue chart */}
        <div className="lg:col-span-8 space-y-16">

          {/* Shipments Table */}
          <div>
            <div className="flex justify-between items-center border-b border-black pb-4 mb-8">
              <h3 className="font-display italic uppercase tracking-tight text-black" style={{ fontSize: "28px", fontWeight: 700 }}>
                Recent Shipments
              </h3>
              <Link href="/dashboard/admin/shipments"
                className="font-mono text-[11px] font-bold uppercase tracking-widest hover:text-black transition-colors"
                style={{ color: "#735c00" }}>
                FULL MANIFEST
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/10">
                    {["Job ID", "Client", "Route", "Status", ""].map(h => (
                      <th key={h} className="pb-6 font-mono text-[10px] text-black/40 uppercase tracking-widest font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {displayShipments.map(s => {
                    const cfg = STATUS_CONFIG[s.status] ?? { cls: "border border-black/20 text-black/50", label: s.status };
                    const isCustoms = s.status === "UNDER_CUSTOMS_EXAM" || s.status === "CUSTOMS_CLEARED";
                    return (
                      <tr key={s._id.toString()} className="hover:bg-black/5 transition-colors group">
                        <td className="py-6 font-mono text-black font-bold text-[13px]">{s.shipmentId}</td>
                        <td className="py-6 text-black text-sm">{s.client?.name}</td>
                        <td className="py-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[12px]">{s.origin?.slice(0, 3).toUpperCase()}</span>
                            <span className="material-symbols-outlined text-[14px]" style={{ color: "#735c00" }}>east</span>
                            <span className="font-mono font-bold text-[12px]">{s.destination?.slice(0, 3).toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-6">
                          <span
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cfg.cls}`}
                            style={isCustoms ? { backgroundColor: "#735c00" } : undefined}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-6 text-right">
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
          </div>

          {/* Revenue Bar Chart */}
          <div className="border-t border-black/10 pt-12">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="font-display italic uppercase tracking-tight text-black" style={{ fontSize: "28px", fontWeight: 700 }}>
                  Revenue Analysis
                </h3>
                <p className="font-mono text-[10px] text-black/40 mt-2 uppercase tracking-[0.2em] font-bold">
                  Growth Trend — H2 FY2025
                </p>
              </div>
              <div className="flex gap-6 font-mono text-[11px] font-bold uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-black inline-block" />
                  Actual
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block" style={{ backgroundColor: "#735c00" }} />
                  Forecast
                </div>
              </div>
            </div>
            <div className="h-56 flex items-end justify-between gap-4 border-b border-black relative px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ opacity: 0.04 }}>
                {[0,1,2,3].map(i => <div key={i} className="border-b border-black w-full" />)}
              </div>
              {BARS.map(bar => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-3 group">
                  <div
                    className="w-full transition-colors"
                    style={{
                      height: bar.h,
                      backgroundColor: bar.forecast ? "#735c00" : "#000000",
                      opacity: bar.forecast ? 1 : 1,
                    }}
                  />
                  <span
                    className="font-mono text-[10px] uppercase font-bold tracking-widest"
                    style={{ color: bar.forecast ? "#735c00" : "rgba(0,0,0,0.4)" }}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity stream + image */}
        <div className="lg:col-span-4 sticky top-24 space-y-10">

          {/* Stream */}
          <div className="border border-black p-8 bg-white">
            <h3 className="font-display italic uppercase tracking-tight text-black mb-8" style={{ fontSize: "24px", fontWeight: 700 }}>
              Stream
            </h3>
            <div className="space-y-10 relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-black/10" />
              {STREAM.map((item, i) => (
                <div key={i} className="relative pl-10">
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 border border-black flex items-center justify-center ${item.iconBg}`}
                    style={i === 2 ? { backgroundColor: "#735c00" } : undefined}
                  >
                    <span className={`material-symbols-outlined ${item.iconColor}`} style={{ fontSize: "12px" }}>
                      {item.icon}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: "#735c00" }}>
                    {item.time} • {item.dept}
                  </p>
                  <p className="font-sans font-bold text-black text-sm">{item.title}</p>
                  <p className="text-[12px] text-black/60 mt-1 italic leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-4 border border-black font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Audit Logs
            </button>
          </div>

          {/* Decorative image */}
          <div className="relative overflow-hidden h-64 border border-black group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaWvClY8D_Dx8DUg6M8EDgZKpiF_LJO8nsPzhvsJOoLeseejqRjKoyyOmeC6XpcV3Eim8mMAaJaFiP796GEoWaB5Ue50EgbUdK-lzf9kJ1HXEvxMuDhJ8SuC-S-WRVd2wUac1re5SiTHuZuapcChM3t2QF7tog2BWSg1zZBO-fTLUdj-dQxcEzrEXo46kQ2WmckKksjSJUxwWgZI3oyk1IXuSX_DXmWkvTKh62XWKERBAgwxokR1q9bljzC8fkYp8x-JgfQtnMAg"
              alt="Global shipping network"
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-mono text-[10px] text-white uppercase tracking-[0.5em] mb-1 font-bold">Global Network</p>
              <p className="font-display text-white italic leading-none" style={{ fontSize: "24px", fontWeight: 700 }}>
                Navkar Fleet 01
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
