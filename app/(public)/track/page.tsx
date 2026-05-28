"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Search, Package, CheckCircle, Circle, Loader2 } from "lucide-react";
import { STATUS_LABELS } from "@/lib/utils";

const ALL_STATUSES = [
  "BOOKING_CONFIRMED",
  "CARGO_PICKED_UP",
  "AT_CFS",
  "ON_VESSEL",
  "ARRIVED_AT_PORT",
  "CUSTOMS_CLEARED",
  "DELIVERED",
];

interface TrackResult {
  jobNo: string;
  mode: string;
  movement: string;
  status: string;
  vessel?: string;
  eta?: string;
  portLoading?: string;
  portDischarge?: string;
  liner?: string;
  client?: { name: string };
  trackingUpdates?: { status: string; note?: string; createdAt: string }[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(searchParams.get("ref") || "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("ref");
    if (q) { setRef(q); handleSearch(q); }
  }, []);

  async function handleSearch(query?: string) {
    const q = query || ref;
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("No shipment found with this reference number.");
    } finally {
      setLoading(false);
    }
  }

  const statusIdx = result ? ALL_STATUSES.indexOf(result.status) : -1;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-neutral-light">
        <section className="bg-primary-deep py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Real-Time Tracking</span>
            <h1 className="text-4xl font-heading font-bold text-white mt-3 mb-4">Track Your Shipment</h1>
            <p className="text-gray-300 mb-8">Enter your BL No, AWB No, Job No, or BE No to track your shipment.</p>

            <div className="flex gap-3 max-w-xl mx-auto">
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="BL No / Job No / AWB No..."
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-5 py-3 focus:outline-none focus:border-accent-teal"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-accent-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">{error}</div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-6 h-6 text-accent-teal" />
                      <span className="font-mono text-lg font-bold text-primary-deep">{result.jobNo}</span>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {result.portLoading || "—"} → {result.portDischarge || "—"}
                    </p>
                    {result.liner && <p className="text-text-secondary text-sm">Liner: {result.liner}</p>}
                    {result.vessel && <p className="text-text-secondary text-sm">Vessel: {result.vessel}</p>}
                    {result.eta && <p className="text-text-secondary text-sm">ETA: {new Date(result.eta).toLocaleDateString("en-IN")}</p>}
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold">
                      {STATUS_LABELS[result.status] || result.status}
                    </span>
                    <p className="text-text-secondary text-sm mt-2">{result.mode} • {result.movement}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-heading font-bold text-primary-deep mb-6">Shipment Timeline</h3>
                <div className="space-y-4">
                  {ALL_STATUSES.map((s, i) => {
                    const done = i <= statusIdx;
                    const active = i === statusIdx;
                    const update = result.trackingUpdates?.find((u) => u.status === s);
                    return (
                      <div key={s} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {done ? (
                            <CheckCircle className={`w-6 h-6 ${active ? "text-accent-teal" : "text-green-500"}`} />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-200" />
                          )}
                          {i < ALL_STATUSES.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${i < statusIdx ? "bg-green-300" : "bg-gray-100"}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`font-medium ${done ? "text-primary-deep" : "text-gray-300"}`}>
                            {STATUS_LABELS[s]}
                          </p>
                          {update && (
                            <p className="text-text-secondary text-sm">
                              {new Date(update.createdAt).toLocaleDateString("en-IN")}
                              {update.note && ` — ${update.note}`}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
