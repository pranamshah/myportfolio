"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const MAP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuC_CmcAXuh9KQZncxPOF5zyRPyDVop6wm58GDu6EjDs_iuOMxX12_U6_IDOrlkN9Ykn7ypr907GGTKhAP18x0WAMxrR14ZObs4Wc328y35wssaB3TCW51hzUY72RZCyCXT5T1j2dEPNl_JtXKrekZbAZIb_Lxs4fr9ozltueoTvLi2hmhm5CuPDH6giSgo6bDL8fcmjX-Vji9BjrVXMSGtMYr1WCdryqFSOSM49TDvXEaZ_d_xbfR6CyDw7yuSIIJon9VwATBDLdQ";

const STATIC_JOBS: Record<string, object> = {
  "job-2025-001": {
    id: "job-2025-001", job: "JOB-2025-001", status: "Customs Cleared (OOC)",
    mode: "Sea Freight", container: "FCL | 40FT HIGH CUBE",
    commodity: "Parts of Transformer",
    origin: "Antwerp, BE", originPort: "Port of Antwerp-Bruges",
    destination: "Chennai, IN", destPort: "Chennai Port Trust",
    grossWeight: "102,691.00 KG", packages: "04 CONTAINERS", incoterms: "CIF",
    vessel: "Maersk Gibraltar", imo: "9748681",
    shippingLine: "Maersk Line Ltd.", voyage: "441E",
    masterBL: "HLCUHAM2510BMO27", hbl: "HLCUHAM2510BMO27",
    eta: "Arrived Oct 2025", etaFull: "15 OCT 2025 AT 14:30 GMT",
    beNo: "5747465 / 10 OCT 2025",
    currentLocation: "Chennai Port — Cleared",
    lastUpdated: "12 OCT 2025 09:14 IST",
    timeline: [
      { date: "12 OCT 2025", event: "Customs Cleared (OOC)", note: "Bill of Entry 5747465 assessed" },
      { date: "10 OCT 2025", event: "Arrived at Port", note: "Vessel berthed at Chennai Port Trust" },
      { date: "05 SEP 2025", event: "On Vessel", note: "Maersk Gibraltar departed Antwerp" },
      { date: "28 AUG 2025", event: "Booking Confirmed", note: "HBL issued by Hapag-Lloyd" },
    ],
    containers: [
      { no: "TCNU 4492810", type: "40 HC", seal: "SL9929181", weight: "25,672 KG" },
      { no: "TCNU 4492811", type: "40 HC", seal: "SL9929182", weight: "25,673 KG" },
      { no: "TCNU 4492812", type: "40 HC", seal: "SL9929183", weight: "25,673 KG" },
      { no: "TCNU 4492813", type: "40 HC", seal: "SL9929184", weight: "25,673 KG" },
    ],
    charges: [
      { desc: "Ocean Freight (FCL 4×40HC)", amount: "₹3,14,200.00" },
      { desc: "Customs Clearance Fee", amount: "₹18,000.00" },
      { desc: "Terminal Handling (THC)", amount: "₹24,800.00" },
      { desc: "Documentation Fee", amount: "₹4,500.00" },
      { desc: "IGST (18%)", amount: "₹64,894.00" },
    ],
    docs: [
      { name: "HBL_HLCUHAM.pdf", type: "Bill of Lading", by: "Agent" },
      { name: "Packing_List_JOB2025001.pdf", type: "Packing List", by: "Agent" },
      { name: "Bill_Entry_5747465.pdf", type: "Bill of Entry", by: "Agent" },
      { name: "Cert_Origin_HAM.pdf", type: "Certificate of Origin", by: "Agent" },
    ],
  },
  "job-2025-002": {
    id: "job-2025-002", job: "JOB-2025-002", status: "In Transit",
    mode: "Sea Freight", container: "FCL | 20FT STANDARD",
    commodity: "Industrial Machinery",
    origin: "Hamburg, DE", originPort: "Port of Hamburg",
    destination: "Chennai, IN", destPort: "Chennai Port Trust",
    grossWeight: "18,450.00 KG", packages: "24 CRATES", incoterms: "FOB",
    vessel: "Zhong Gu Tai Yuan", imo: "9812345",
    shippingLine: "CMA CGM", voyage: "HBG202E",
    masterBL: "HBG2062373", hbl: "HBG2062373",
    eta: "Nov 2025", etaFull: "20 NOV 2025 AT 10:00 GMT",
    beNo: "—",
    currentLocation: "Red Sea — En Route",
    lastUpdated: "28 OCT 2025 11:00 IST",
    timeline: [
      { date: "15 OCT 2025", event: "On Vessel", note: "Zhong Gu Tai Yuan departed Hamburg" },
      { date: "10 OCT 2025", event: "Booking Confirmed", note: "HBL issued by CMA CGM" },
    ],
    containers: [
      { no: "CMAU 1023456", type: "20 ST", seal: "SL8821001", weight: "18,450 KG" },
    ],
    charges: [
      { desc: "Ocean Freight (FCL 1×20ST)", amount: "₹78,500.00" },
      { desc: "Documentation Fee", amount: "₹2,500.00" },
      { desc: "IGST (18%)", amount: "₹14,580.00" },
    ],
    docs: [
      { name: "HBL_HBG2062373.pdf", type: "Bill of Lading", by: "Agent" },
    ],
  },
};

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

const TABS = ["OVERVIEW", "TIMELINE", "DOCUMENTS", "CHARGES", "CONTAINERS"];

interface DbShipment {
  _id: string; shipmentId: string; status: string; origin: string; destination: string;
  vessel?: string; blNo?: string; eta?: string; portOfLoading?: string; portOfDischarge?: string;
  grossWeight?: number; packages?: number; incoterms?: string; voyageNo?: string; commodity?: string;
  timeline?: { status: string; date: string; note?: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JobData = Record<string, any>;

export default function ClientShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("OVERVIEW");
  const [job, setJob] = useState<JobData | null>(null);

  const load = useCallback(async () => {
    if (id && STATIC_JOBS[id as string]) {
      setJob(STATIC_JOBS[id as string] as JobData);
      return;
    }
    try {
      const s: DbShipment = await fetch(`/api/shipments/${id}`).then(r => r.json());
      if (s && s._id) {
        setJob({
          id: s._id, job: s.shipmentId, status: s.status,
          mode: "Sea Freight", container: "—",
          commodity: s.commodity ?? "—",
          origin: s.origin, originPort: s.portOfLoading ?? "—",
          destination: s.destination, destPort: s.portOfDischarge ?? "—",
          grossWeight: s.grossWeight ? `${s.grossWeight} KG` : "—",
          packages: s.packages ? String(s.packages) : "—",
          incoterms: s.incoterms ?? "—",
          vessel: s.vessel ?? "—", imo: "—",
          shippingLine: "—", voyage: s.voyageNo ?? "—",
          masterBL: s.blNo ?? "—", hbl: s.blNo ?? "—",
          eta: s.eta ?? "—", etaFull: s.eta ?? "—",
          beNo: "—", currentLocation: "—",
          lastUpdated: new Date().toLocaleString(),
          timeline: s.timeline ?? [],
          containers: [], charges: [], docs: [],
        });
      }
    } catch {
      /* show empty state */
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!job) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-mono text-[11px] tracking-widest text-on-surface-variant">LOADING...</p>
    </div>
  );

  const st = STATUS_TAGS[job.status] ?? { bg: "#f3f4f6", color: "#374151" };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="px-10 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/client/shipments"
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            ALL SHIPMENTS
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-on-surface-variant mb-2 block">LOGISTICS DETAIL</span>
            <h1 className="font-display text-on-surface flex flex-wrap items-center gap-4"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {job.job}
              <span className="inline-flex items-center px-4 py-1 font-mono text-[10px] tracking-widest"
                style={{ backgroundColor: st.bg, color: st.color }}>
                {job.status.toUpperCase()}
              </span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="border border-outline px-6 py-2 font-mono text-[11px] tracking-widest hover:bg-surface-container transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">share</span> SHARE
            </button>
            <button className="border border-outline px-6 py-2 font-mono text-[11px] tracking-widest hover:bg-surface-container transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span> EXPORT PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex gap-10 border-b border-outline-variant/30 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-4 font-mono text-[11px] tracking-widest whitespace-nowrap transition-colors"
              style={{
                color: tab === t ? "#000000" : "#45464d",
                borderBottom: tab === t ? "2px solid #000000" : "2px solid transparent",
              }}>
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-10 pb-24">

        {/* OVERVIEW TAB */}
        {tab === "OVERVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left */}
            <section className="lg:col-span-7 space-y-8">
              {/* Main info card */}
              <div className="bg-white border border-outline-variant/30 p-10 relative overflow-hidden
                hover:-translate-y-1 transition-all duration-400">
                <span className="absolute -bottom-10 -right-10 font-display text-[160px] opacity-[0.03]
                  pointer-events-none select-none leading-none">CARGO</span>

                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[32px]" style={{ color: "#735c00" }}>
                      {job.mode === "Air Freight" ? "flight_takeoff" : "directions_boat"}
                    </span>
                    <div>
                      <h3 className="font-sans font-bold text-2xl text-on-surface">{job.mode}</h3>
                      <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mt-1">{job.container}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Commodity</p>
                    <p className="font-sans font-bold text-lg">{job.commodity}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-8 border-y border-outline-variant/30">
                  <div className="flex-1">
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">POL</p>
                    <h4 className="font-sans font-bold text-2xl">{job.origin}</h4>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{job.originPort}</p>
                  </div>
                  <div className="flex-none px-8 flex flex-col items-center">
                    <span className="material-symbols-outlined text-outline-variant">arrow_right_alt</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">POD</p>
                    <h4 className="font-sans font-bold text-2xl">{job.destination}</h4>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{job.destPort}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-12">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">Gross Weight</p>
                    <p className="font-mono text-[12px]">{job.grossWeight}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">Package Count</p>
                    <p className="font-mono text-[12px]">{job.packages}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">Incoterms</p>
                    <p className="font-mono text-[12px] font-bold">{job.incoterms}</p>
                  </div>
                </div>
              </div>

              {/* Customs BE card */}
              <div className="bg-surface border border-outline-variant/30 p-8 flex items-center justify-between
                hover:-translate-y-1 transition-all duration-400">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Customs Entry (BE)</p>
                    <h5 className="font-sans font-bold text-lg mt-1 tracking-wider">{job.beNo}</h5>
                  </div>
                </div>
                <button className="font-mono text-[11px] tracking-widest flex items-center gap-2 hover:underline"
                  style={{ color: "#735c00" }}>
                  VIEW STATUS <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>
              </div>
            </section>

            {/* Right */}
            <aside className="lg:col-span-5 space-y-8">
              {/* Vessel info */}
              <div className="bg-white border border-outline-variant/30 p-8
                hover:-translate-y-1 transition-all duration-400">
                <h3 className="font-mono text-[10px] tracking-[0.2em] text-on-surface-variant mb-8 border-b border-outline-variant/30 pb-4">
                  VESSEL INFORMATION
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-mono text-[10px] text-on-surface-variant">VESSEL NAME</p>
                      <p className="font-sans font-bold text-2xl mt-1">{job.vessel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-on-surface-variant">IMO</p>
                      <p className="font-mono text-[12px]">{job.imo}</p>
                    </div>
                  </div>

                  <div className="p-6 border-l-4" style={{ backgroundColor: "#f3f3f4", borderColor: "#735c00" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: "#735c00" }}>schedule</span>
                      <span className="font-mono text-[10px] tracking-widest font-bold">ESTIMATED ARRIVAL</span>
                    </div>
                    <p className="font-display text-[40px] leading-none" style={{ fontWeight: 600 }}>
                      {job.eta}
                    </p>
                    <p className="font-mono text-[10px] mt-2 opacity-60">{job.etaFull}</p>
                  </div>

                  <div className="space-y-4 pt-4">
                    {[
                      { label: "Shipping Line", value: job.shippingLine },
                      { label: "Voyage No", value: job.voyage },
                      { label: "Master B/L", value: job.masterBL },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between font-mono text-[11px] py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">{row.label}</span>
                        <span className="font-bold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map card */}
              <div className="h-[280px] w-full border border-outline-variant/30 relative overflow-hidden group"
                style={{ filter: "grayscale(100%) contrast(1.25) brightness(0.75)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MAP_IMG} alt="Shipping route" className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#735c00" }} />
                    <span className="font-mono text-[10px] text-white tracking-widest font-bold">
                      CURRENT LOCATION: {job.currentLocation}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* TIMELINE TAB */}
        {tab === "TIMELINE" && (
          <div className="max-w-2xl">
            <div className="relative space-y-0">
              {(job.timeline as { date: string; event: string; note?: string }[]).map((item, i) => (
                <div key={i} className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: i === 0 ? "#000000" : "#c6c6cd" }} />
                    {i < job.timeline.length - 1 && <div className="w-px flex-1 mt-2" style={{ backgroundColor: "#c6c6cd" }} />}
                  </div>
                  <div className="pb-8">
                    <p className="font-mono text-[10px] tracking-widest text-on-surface-variant">{item.date}</p>
                    <p className="font-sans font-bold text-on-surface mt-1">{item.event}</p>
                    {item.note && <p className="font-sans text-sm text-on-surface-variant mt-1">{item.note}</p>}
                  </div>
                </div>
              ))}
              {job.timeline.length === 0 && (
                <p className="font-mono text-[11px] tracking-widest text-on-surface-variant">NO TIMELINE DATA AVAILABLE</p>
              )}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {tab === "DOCUMENTS" && (
          <div className="bg-white border border-outline-variant/30 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface">
                  {["Document Name", "Type", "Uploaded By", "Actions"].map(h => (
                    <th key={h} className="px-8 py-5 font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(job.docs as { name: string; type: string; by: string }[]).map((doc, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]" style={{ color: "#735c00" }}>description</span>
                        <span className="font-sans font-bold">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-on-surface-variant font-sans text-sm">{doc.type}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary flex items-center justify-center text-[10px] text-white font-bold">NI</div>
                        <span className="font-sans text-sm">{doc.by}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {job.docs.length === 0 && (
                  <tr><td colSpan={4} className="px-8 py-12 text-center font-mono text-[11px] tracking-widest text-on-surface-variant">
                    NO DOCUMENTS AVAILABLE
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CHARGES TAB */}
        {tab === "CHARGES" && (
          <div className="max-w-2xl bg-white border border-outline-variant/30 p-10">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-outline-variant/30 pb-4">
                <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">DESCRIPTION</span>
                <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">TOTAL</span>
              </div>
              {(job.charges as { desc: string; amount: string }[]).map((c, i) => (
                <div key={i} className="flex justify-between font-sans text-sm py-1">
                  <span>{c.desc}</span>
                  <span>{c.amount}</span>
                </div>
              ))}
              {job.charges.length > 0 && (
                <div className="flex justify-between pt-8 border-t-2 border-primary mt-4">
                  <span className="font-sans font-bold">NET PAYABLE AMOUNT</span>
                  <span className="font-display text-[20px]" style={{ fontWeight: 600 }}>
                    {job.charges.reduce((acc: number, c: { desc: string; amount: string }) => {
                      const n = parseFloat(c.amount.replace(/[₹,]/g, ""));
                      return acc + (isNaN(n) ? 0 : n);
                    }, 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </span>
                </div>
              )}
              {job.charges.length === 0 && (
                <p className="font-mono text-[11px] tracking-widest text-on-surface-variant py-8 text-center">NO CHARGES DATA AVAILABLE</p>
              )}
            </div>
          </div>
        )}

        {/* CONTAINERS TAB */}
        {tab === "CONTAINERS" && (
          <div className="bg-white border border-outline-variant/30 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface">
                  {["Container No", "Type", "Seal No", "Gross Weight"].map(h => (
                    <th key={h} className="px-8 py-5 font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(job.containers as { no: string; type: string; seal: string; weight: string }[]).map((c, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-5 font-mono text-[12px] font-bold">{c.no}</td>
                    <td className="px-8 py-5 font-sans text-sm text-on-surface-variant">{c.type}</td>
                    <td className="px-8 py-5 font-mono text-[11px]">{c.seal}</td>
                    <td className="px-8 py-5 font-sans text-sm">{c.weight}</td>
                  </tr>
                ))}
                {job.containers.length === 0 && (
                  <tr><td colSpan={4} className="px-8 py-12 text-center font-mono text-[11px] tracking-widest text-on-surface-variant">
                    NO CONTAINER DATA AVAILABLE
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit trail */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="font-mono text-[10px]">LAST UPDATED: {job.lastUpdated}</p>
          <p className="font-mono text-[10px]">JOB ID: {job.job}</p>
        </div>
      </div>

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
