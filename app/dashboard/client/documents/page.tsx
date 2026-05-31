"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const DOC_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCD6xI2H1ix8rqEBTvnrWSJbglxU98lAg6Asge0r2BMf-8VSL108a0uL4PhwAaeBJ8Tt9yhFjmqRSi0F9YGaLz2KU3fmnuEbTEvnWa3S6VVfSK2BvCNuP4VuF5FzEWOpXT71ZpYqiPs2dBSpg4oL4jQyrUy8iJkqbRT8S7KBB3RwblA2hOuTlVc2BpijmwNobrCNpeSQWuEDtdmfPHj9GCQOMq6NLlVxvW2lheO3nn-VCTkBih6MLKbAK76M9Wmqw0POQyaWbQvDg";

const SAMPLE_DOCS = [
  { id: "d1", name: "HBL_HLCUHAM.pdf",        job: "JOB-2025-001", type: "Bill of Lading",        by: "Agent", date: "03 Oct 2025", icon: "description" },
  { id: "d2", name: "Packing_List_JOB001.pdf", job: "JOB-2025-001", type: "Packing List",           by: "Agent", date: "03 Oct 2025", icon: "receipt_long" },
  { id: "d3", name: "Bill_Entry_5747465.pdf",  job: "JOB-2025-001", type: "Bill of Entry",          by: "Agent", date: "10 Oct 2025", icon: "verified" },
  { id: "d4", name: "Cert_Origin_HAM.pdf",     job: "JOB-2025-001", type: "Certificate of Origin",  by: "Agent", date: "28 Sep 2025", icon: "verified" },
  { id: "d5", name: "HBL_HBG2062373.pdf",      job: "JOB-2025-002", type: "Bill of Lading",         by: "Agent", date: "15 Oct 2025", icon: "description" },
  { id: "d6", name: "Invoice_INV2026001.pdf",  job: "JOB-2025-001", type: "Commercial Invoice",     by: "Client", date: "14 Oct 2025", icon: "analytics" },
];

const DRAWER_DOC = {
  name: "HBL_HLCUHAM.pdf", job: "JOB-2025-001",
  container: "TCNU 449281-0", vessel: "Maersk Gibraltar",
  note: "This document has been verified by Customs Agent #912 and is ready for port clearance.",
};

interface ApiDoc {
  _id: string; name: string; category: string; createdAt: string;
  shipment?: { shipmentId?: string };
}

export default function ClientDocumentsPage() {
  const [filterTab, setFilterTab] = useState("All Documents");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDoc, setDrawerDoc] = useState(DRAWER_DOC);
  const [dbDocs, setDbDocs] = useState<ApiDoc[]>([]);

  useEffect(() => {
    fetch("/api/documents").then(r => r.json()).then(d => setDbDocs(Array.isArray(d) ? d : []));
  }, []);

  const combined = [
    ...SAMPLE_DOCS,
    ...dbDocs.map(d => ({
      id: d._id, name: d.name,
      job: d.shipment?.shipmentId ?? "—",
      type: d.category ?? "Document",
      by: "Agent", date: new Date(d.createdAt).toLocaleDateString("en-IN"),
      icon: "description" as const,
    })),
  ];

  const filtered = combined.filter(d => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.job.toLowerCase().includes(q)) return false;
    if (filterTab === "My Uploads") return d.by === "Client";
    if (filterTab === "Agent Uploads") return d.by === "Agent";
    return true;
  });

  function openDrawer(doc: typeof SAMPLE_DOCS[0]) {
    setDrawerDoc({
      name: doc.name, job: doc.job,
      container: "TCNU 449281-0", vessel: "Maersk Gibraltar",
      note: "This document has been verified by the Navkar Impex agent team.",
    });
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="pt-16 px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
          <div className="absolute -top-8 right-0 pointer-events-none select-none font-display text-on-surface leading-none"
            style={{ fontSize: "180px", opacity: 0.02, fontWeight: 700, letterSpacing: "-0.04em" }}>
            Archive
          </div>
          <div className="relative z-10">
            <h1 className="font-display text-on-surface" style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Documents Center
            </h1>
            <p className="font-sans text-on-surface-variant max-w-xl mt-3 text-base leading-relaxed">
              Centralized repository for all your shipping documentation, compliance certificates, and commercial invoices.
            </p>
          </div>
          <button className="bg-primary text-white font-mono text-[11px] tracking-widest px-10 py-4 hover:opacity-80 transition-opacity flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            UPLOAD NEW DOCUMENT
          </button>
        </div>
      </header>

      {/* Controls */}
      <section className="mt-16 px-10 border-b border-outline-variant/30 pb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex gap-1 bg-surface-container-low p-1">
            {["All Documents", "My Uploads", "Agent Uploads"].map(t => (
              <button
                key={t}
                onClick={() => setFilterTab(t)}
                className="px-6 py-2 font-mono text-[11px] tracking-widest transition-all"
                style={{
                  backgroundColor: filterTab === t ? "#ffffff" : "transparent",
                  color: filterTab === t ? "#000000" : "#45464d",
                  border: filterTab === t ? "1px solid rgba(198,198,205,0.2)" : "1px solid transparent",
                }}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by document name or job ID..."
              className="w-full bg-white border-b-2 border-outline-variant/30 py-3 pl-12 pr-4 font-sans text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="px-10 mt-8 pb-24">
        <div className="bg-white border border-outline-variant/30 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/30" style={{ backgroundColor: "#f9f9f9" }}>
                {["Document Name", "Shipment ID", "Type", "Uploaded By", "Date", "Actions"].map((h, i) => (
                  <th key={h} className={`px-8 py-5 font-mono text-[10px] tracking-widest text-on-surface-variant uppercase ${i === 5 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => openDrawer(doc)}
                  className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: "#735c00" }}>{doc.icon}</span>
                      <span className="font-sans font-bold">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono text-[10px] px-2 py-1" style={{ backgroundColor: "#eeeeee" }}>{doc.job}</span>
                  </td>
                  <td className="px-8 py-6 font-sans text-sm text-on-surface-variant">{doc.type}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center text-[10px] text-white font-bold"
                        style={{ backgroundColor: doc.by === "Agent" ? "#000000" : "#735c00" }}>
                        {doc.by === "Agent" ? "NI" : "CL"}
                      </div>
                      <span className="font-sans text-sm">{doc.by}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-sans text-sm text-on-surface-variant">{doc.date}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center font-mono text-[11px] tracking-widest text-on-surface-variant">
                    NO DOCUMENTS FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">
            SHOWING {filtered.length} DOCUMENT{filtered.length !== 1 ? "S" : ""}
          </span>
          <div className="flex gap-4">
            <button className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all opacity-30" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
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

      {/* Preview Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[60] border-l border-outline-variant/30 transition-transform duration-500 overflow-y-auto"
        style={{ transform: drawerOpen ? "translateX(0)" : "translateX(100%)" }}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-sans font-bold text-2xl">Document Preview</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-12 h-12 rounded-full hover:bg-surface-container flex items-center justify-center transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-[3/4] overflow-hidden" style={{ filter: "grayscale(100%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOC_IMG} alt="Document preview"
                className="w-full h-full object-cover opacity-80 mix-blend-multiply hover:grayscale-0 transition-all duration-700 cursor-zoom-in"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}>
                <span className="material-symbols-outlined text-white text-5xl">zoom_in</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-outline-variant/30 pt-8">
              {[
                { label: "Reference", value: drawerDoc.name },
                { label: "Job ID", value: drawerDoc.job },
                { label: "Container", value: drawerDoc.container },
                { label: "Vessel", value: drawerDoc.vessel },
              ].map(item => (
                <div key={item.label}>
                  <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1 uppercase">{item.label}</p>
                  <p className="font-sans font-bold" style={item.label === "Container" ? { color: "#735c00" } : {}}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-primary text-white py-4 font-mono text-[11px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90">
                <span className="material-symbols-outlined text-[18px]">download</span> DOWNLOAD PDF
              </button>
              <button className="flex-1 border border-primary py-4 font-mono text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">print</span> PRINT
              </button>
            </div>

            <div className="p-6 border-l-4 border-secondary" style={{ backgroundColor: "#f9f9f9" }}>
              <p className="font-mono text-[10px] tracking-widest font-bold mb-2" style={{ color: "#735c00" }}>COMPLIANCE NOTE</p>
              <p className="font-sans text-sm italic">{drawerDoc.note}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[55] transition-opacity duration-500"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
