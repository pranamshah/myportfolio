"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  company?: string;
}

export default function NewShipmentPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientId: "", mode: "SEA", movement: "IMPORT", status: "BOOKING_CONFIRMED",
    liner: "", vessel: "", voyage: "", blNo: "", mblNo: "", hblNo: "", awbNo: "", beNo: "",
    portLoading: "", portDischarge: "", finalDest: "",
    cargoDesc: "", hsCode: "", packages: "", grossWeight: "", cbm: "",
    chaName: "", examType: "", cfsName: "",
    bookingDate: "", sailDate: "", eta: "", arrivalDate: "", clearanceDate: "", deliveryDate: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/shipments")
      .then(() => {})
      .catch(() => {});
    // Fetch clients
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/admin/shipments/${data.id}`);
      } else {
        alert("Failed to create shipment.");
      }
    } finally {
      setLoading(false);
    }
  }

  const f = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/shipments" className="text-text-secondary hover:text-primary-deep">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-deep">New Shipment</h1>
          <p className="text-text-secondary text-sm">Fill in the shipment details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Client *</label>
              <select className="select" value={form.clientId} onChange={(e) => f("clientId", e.target.value)} required>
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Mode *</label>
              <select className="select" value={form.mode} onChange={(e) => f("mode", e.target.value)}>
                <option value="SEA">Sea Freight</option>
                <option value="AIR">Air Freight</option>
              </select>
            </div>
            <div>
              <label className="label">Movement *</label>
              <select className="select" value={form.movement} onChange={(e) => f("movement", e.target.value)}>
                <option value="IMPORT">Import</option>
                <option value="EXPORT">Export</option>
              </select>
            </div>
          </div>
        </div>

        {/* Routing */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Routing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Port of Loading</label>
              <input className="input" value={form.portLoading} onChange={(e) => f("portLoading", e.target.value)} placeholder="e.g. Shanghai" />
            </div>
            <div>
              <label className="label">Port of Discharge</label>
              <input className="input" value={form.portDischarge} onChange={(e) => f("portDischarge", e.target.value)} placeholder="e.g. Chennai" />
            </div>
            <div>
              <label className="label">Final Destination</label>
              <input className="input" value={form.finalDest} onChange={(e) => f("finalDest", e.target.value)} placeholder="e.g. Coimbatore" />
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Shipping Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Shipping Line / Liner</label>
              <input className="input" value={form.liner} onChange={(e) => f("liner", e.target.value)} placeholder="e.g. Hapag-Lloyd" />
            </div>
            <div>
              <label className="label">Vessel Name</label>
              <input className="input" value={form.vessel} onChange={(e) => f("vessel", e.target.value)} />
            </div>
            <div>
              <label className="label">Voyage No</label>
              <input className="input font-mono" value={form.voyage} onChange={(e) => f("voyage", e.target.value)} />
            </div>
            <div>
              <label className="label">{form.mode === "SEA" ? "BL No" : "AWB No"}</label>
              <input className="input font-mono" value={form.mode === "SEA" ? form.blNo : form.awbNo}
                onChange={(e) => f(form.mode === "SEA" ? "blNo" : "awbNo", e.target.value)} />
            </div>
            <div>
              <label className="label">MBL No</label>
              <input className="input font-mono" value={form.mblNo} onChange={(e) => f("mblNo", e.target.value)} />
            </div>
            <div>
              <label className="label">HBL No</label>
              <input className="input font-mono" value={form.hblNo} onChange={(e) => f("hblNo", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Cargo */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Cargo Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Cargo Description</label>
              <input className="input" value={form.cargoDesc} onChange={(e) => f("cargoDesc", e.target.value)} placeholder="e.g. Steel Components" />
            </div>
            <div>
              <label className="label">HS Code</label>
              <input className="input font-mono" value={form.hsCode} onChange={(e) => f("hsCode", e.target.value)} placeholder="e.g. 73079990" />
            </div>
            <div>
              <label className="label">No. of Packages</label>
              <input type="number" className="input" value={form.packages} onChange={(e) => f("packages", e.target.value)} />
            </div>
            <div>
              <label className="label">Gross Weight (KG)</label>
              <input type="number" step="0.01" className="input" value={form.grossWeight} onChange={(e) => f("grossWeight", e.target.value)} />
            </div>
            <div>
              <label className="label">CBM</label>
              <input type="number" step="0.01" className="input" value={form.cbm} onChange={(e) => f("cbm", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Important Dates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Booking Date</label>
              <input type="date" className="input" value={form.bookingDate} onChange={(e) => f("bookingDate", e.target.value)} />
            </div>
            <div>
              <label className="label">Sailing Date</label>
              <input type="date" className="input" value={form.sailDate} onChange={(e) => f("sailDate", e.target.value)} />
            </div>
            <div>
              <label className="label">ETA</label>
              <input type="date" className="input" value={form.eta} onChange={(e) => f("eta", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Customs */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Customs & CFS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">CHA Name</label>
              <input className="input" value={form.chaName} onChange={(e) => f("chaName", e.target.value)} />
            </div>
            <div>
              <label className="label">BE No</label>
              <input className="input font-mono" value={form.beNo} onChange={(e) => f("beNo", e.target.value)} />
            </div>
            <div>
              <label className="label">Exam Type</label>
              <select className="select" value={form.examType} onChange={(e) => f("examType", e.target.value)}>
                <option value="">Select</option>
                <option value="RMS">RMS (Green)</option>
                <option value="YELLOW">Yellow</option>
                <option value="RED">Red</option>
              </select>
            </div>
            <div>
              <label className="label">CFS Name</label>
              <input className="input" value={form.cfsName} onChange={(e) => f("cfsName", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <label className="label text-base font-heading">Internal Notes</label>
          <textarea
            className="input resize-none mt-1"
            rows={3}
            value={form.notes}
            onChange={(e) => f("notes", e.target.value)}
            placeholder="Any internal notes for this shipment..."
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? "Creating..." : "Create Shipment"}
          </button>
          <Link href="/dashboard/admin/shipments" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
