"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";

const SEA_IMG   = "https://lh3.googleusercontent.com/aida-public/AB6AXuBqcwxERBwxWX_lW0vZYiYWIADotEG4PdUgmhlHDrxej1FzP_V1XjqN-vvclqZuxEJozaK5ackqSd-3b8aYrob8dUcStDTONg3ZACMLIXTKjyAgb7fwtXruEFCVqSj99XMoOpdIMsH8V3UgLLj6NjHVodjQHWrklyCh5B7LqAqS46_PBRyp5O33jZjkp0kYrJ16n9U9bxMtwvoXjr4_gJuden2uXpkYNFVat8a1hfb5P6zwd7EdzKaq-l_1QKbm-0UM0Igzy2tDPg";
const DONE_IMG  = "https://lh3.googleusercontent.com/aida-public/AB6AXuBNOymtJF2hCdkJZb5dVql-x3WTaws3lMRbXWQGtUNiIlBC5AHw6qtvDTnFx_-AjZyjw6-1qIGU4HI810hOrIToOv8LIbxiTfclYwfvycoKyxP_xV2yGqtyl7d4BSsp9wYpwY51mVMB8x8PMhpxujJiqHzqpKNOW18YeHOCEHIc7B7jrqEuQftZ-TG7gyBYnfdg9uDxx371_DzfCrc9SICe3wicAq9J-B__sXGi1KcvWqXSKPpsgwQKbq1pgP_Ypqn1jTMfw_hsaw";

const STATUS_TAGS: Record<string, { bg: string; color: string }> = {
  "In Transit":           { bg: "#fef9c3", color: "#92400e" },
  "Customs Cleared (OOC)":{ bg: "#d1fae5", color: "#065f46" },
  "On Vessel":            { bg: "#dbeafe", color: "#1e40af" },
  "Arrived at Port":      { bg: "#e0e7ff", color: "#3730a3" },
  "Delivered":            { bg: "#d1fae5", color: "#065f46" },
  "Completed":            { bg: "#d1fae5", color: "#065f46" },
  "Customs Examination":  { bg: "#fee2e2", color: "#991b1b" },
  "Booking Confirmed":    { bg: "#f3f4f6", color: "#374151" },
};

const SAMPLE = [
  {
    id: "job-2025-001",
    job: "JOB-2025-001",
    bl: "HLCUHAM2510BMO27",
    origin: "Antwerp", destination: "Chennai",
    vessel: "Maersk Gibraltar", carrier: "Hapag-Lloyd",
    mode: "SEA", status: "Customs Cleared (OOC)",
    eta: "Arrived Oct 2025", img: SEA_IMG,
  },
  {
    id: "job-2025-002",
    job: "JOB-2025-002",
    bl: "HBG2062373",
    origin: "Hamburg", destination: "Chennai",
    vessel: "Zhong Gu Tai Yuan", carrier: "CMA CGM",
    mode: "SEA", status: "In Transit",
    eta: "Nov 2025", img: SEA_IMG,
  },
];

const FILTERS = ["ALL", "ACTIVE", "IN TRANSIT", "CUSTOMS", "DELIVERED", "COMPLETED"];

interface ApiShipment {
  _id: string; shipmentId: string; description: string; status: string;
  origin: string; destination: string; eta?: string;
  vessel?: string; blNo?: string;
}

export default function ClientShipmentsPage() {
  const [tab, setTab]       = useState("ALL");
  const [search, setSearch] = useState("");
  const [dbShips, setDbShips] = useState<ApiShipment[]>([]);

  useEffect(() => {
    fetch("/api/shipments").then(r => r.json()).then(d => setDbShips(Array.isArray(d) ? d : []));
  }, []);

  const combined = [
    ...SAMPLE.map(s => ({ ...s, _db: false })),
    ...dbShips.map(s => ({
      id: s._id, job: s.shipmentId, bl: s.blNo ?? "",
      origin: s.origin, destination: s.destination,
      vessel: s.vessel ?? "", carrier: "—",
      mode: "SEA", status: s.status,
      eta: s.eta ?? "—", img: SEA_IMG, _db: true,
    })),
  ];

  const filtered = combined.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.job.toLowerCase().includes(q) && !s.bl.toLowerCase().includes(q) && !s.vessel.toLowerCase().includes(q)) return false;
    if (tab === "ALL") return true;
    if (tab === "IN TRANSIT") return s.status.toUpperCase().includes("IN TRANSIT") || s.status.toUpperCase().includes("ON VESSEL");
    if (tab === "CUSTOMS")    return s.status.toUpperCase().includes("CUSTOM");
    if (tab === "DELIVERED")  return s.status.toUpperCase().includes("DELIVERED");
    if (tab === "COMPLETED")  return s.status.toUpperCase().includes("COMPLETED");
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="pt-16 px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
          <div className="absolute -top-8 -left-2 pointer-events-none select-none font-display text-on-surface leading-none"
            style={{ fontSize: "140px", opacity: 0.02, fontWeight: 700, letterSpacing: "-0.04em" }}>
            Global
          </div>
          <div className="relative z-10">
            <h1 className="font-display text-on-surface" style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              My Shipments
            </h1>
            <p className="font-sans text-on-surface-variant max-w-xl mt-3 text-base leading-relaxed">
              Real-time oversight of your global supply chain. Manage transit states and documentation with surgical precision.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link href="/dashboard/client/quotes"
              className="bg-primary text-white font-mono text-[11px] tracking-widest px-10 py-4 hover:opacity-80 transition-opacity">
              NEW BOOKING
            </Link>
            <button className="border border-outline font-mono text-[11px] tracking-widest px-10 py-4 hover:border-secondary hover:text-secondary transition-all">
              EXPORT REPORT
            </button>
          </div>
        </div>
      </header>

      {/* Filter + Search bar */}
      <section className="mt-16 px-10 sticky top-0 z-40 py-5 border-y border-outline-variant/30"
        style={{ backgroundColor: "rgba(249,249,249,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTab(f)}
                className="px-6 py-2 font-mono text-[11px] tracking-widest transition-all"
                style={{
                  color: tab === f ? "#000000" : "#45464d",
                  borderBottom: tab === f ? "2px solid #000000" : "2px solid transparent",
                }}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH BY JOB, BL OR VESSEL..."
              className="w-full bg-transparent border-b border-outline-variant py-3 pl-11 pr-4 font-mono text-[11px] tracking-widest focus:border-secondary focus:outline-none transition-all placeholder:text-outline"
            />
          </div>
        </div>
      </section>

      {/* Shipment cards */}
      <section className="mt-12 px-10 pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filtered.map((s, i) => {
            const st = STATUS_TAGS[s.status] ?? { bg: "#f3f3f4", color: "#45464d" };
            const imgSrc = i % 2 === 0 ? SEA_IMG : DONE_IMG;
            return (
              <div
                key={s.id}
                className="bg-white group overflow-hidden flex flex-col md:flex-row border border-outline-variant/30 hover:border-secondary transition-all duration-300">
                {/* Image */}
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                  <img
                    src={imgSrc}
                    alt={s.job}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{ filter: "grayscale(100%)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) contrast(1.1)"}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"}
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.2)", mixBlendMode: "multiply" }} />
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest px-3 py-1"
                    style={{ backgroundColor: st.bg, color: st.color }}>
                    {s.status.toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="md:w-2/3 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-mono text-[13px] font-bold" style={{ color: "#735c00" }}>{s.job}</h3>
                        <p className="font-mono text-[10px] opacity-40 mt-1">BL NO: {s.bl}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] opacity-40">ETA</p>
                        <p className="font-mono text-[11px] font-bold">{s.eta}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <p className="font-mono text-[10px] opacity-40">ORIGIN</p>
                        <p className="font-sans font-bold text-on-surface text-xl">{s.origin}</p>
                      </div>
                      <div className="flex-1 border-t border-dashed border-outline-variant relative">
                        <span
                          className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2"
                          style={{ color: "#735c00", fontSize: "20px" }}>
                          {s.mode === "AIR" ? "flight_takeoff" : "directions_boat"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] opacity-40">DESTINATION</p>
                        <p className="font-sans font-bold text-on-surface text-xl">{s.destination}</p>
                      </div>
                    </div>

                    <div className="flex justify-between py-4 border-y border-outline-variant/10">
                      <div>
                        <p className="font-mono text-[10px] opacity-40 uppercase">Vessel</p>
                        <p className="font-sans font-bold text-sm">{s.vessel}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] opacity-40 uppercase">Carrier</p>
                        <p className="font-sans font-bold text-sm">{s.carrier}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[
                      { label: "VIEW DETAILS", href: `/dashboard/client/shipments/${s.id}` },
                      { label: "TRACK", href: `/dashboard/client/shipments/${s.id}` },
                      { label: "DOCUMENTS", href: `/dashboard/client/documents` },
                    ].map(btn => (
                      <Link
                        key={btn.label}
                        href={btn.href}
                        className="py-3 font-mono text-[10px] tracking-widest text-center transition-all hover:bg-primary hover:text-white"
                        style={{ backgroundColor: "#f9f9f9" }}>
                        {btn.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Ghost card */}
          <Link
            href="/dashboard/client/quotes"
            className="bg-surface border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-secondary transition-all min-h-[280px]">
            <div className="w-16 h-16 rounded-full border border-outline-variant/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px] text-outline-variant group-hover:text-secondary">add</span>
            </div>
            <p className="font-sans font-bold text-on-surface text-2xl">New Logistics Job</p>
            <p className="font-mono text-[10px] tracking-widest opacity-40 mt-2">Initialize a new freight forwarding request</p>
            <span className="mt-6 font-mono text-[11px] tracking-widest flex items-center gap-2" style={{ color: "#735c00" }}>
              GET QUOTE <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant px-10 py-10 mt-auto" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display text-on-surface opacity-5 select-none uppercase text-4xl font-bold">NAVKAR IMPEX</p>
          <p className="font-mono text-[10px] tracking-widest text-on-surface-variant">
            © {new Date().getFullYear()} NAVKAR IMPEX. LOGISTICS REDEFINED.
          </p>
          <div className="flex gap-8">
            {[["PRIVACY", "/privacy"], ["TERMS", "/terms"], ["NETWORK", "/network"]].map(([l, h]) => (
              <Link key={l} href={h} className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-secondary transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
