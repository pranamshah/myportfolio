"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";

export function QuoteCalculator() {
  const [form, setForm] = useState({ mode: "SEA", weight: "", origin: "", dest: "" });
  const [result, setResult] = useState<string | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(form.weight);
    if (!w || !form.origin || !form.dest) return;
    const base = form.mode === "SEA" ? 15000 : 45000;
    const perKg = form.mode === "SEA" ? 8 : 180;
    const low = Math.round((base + w * perKg) * 0.9);
    const high = Math.round((base + w * perKg) * 1.15);
    setResult(`₹${low.toLocaleString("en-IN")} – ₹${high.toLocaleString("en-IN")}`);
  };

  return (
    <section className="py-20 bg-primary-ocean">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent-gold text-sm font-semibold uppercase tracking-wider">Instant Estimate</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-2 mb-4">
              Get a Quick Rate Estimate
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Get a ballpark estimate in seconds. For an accurate quote with all charges,
              submit a full quote request and we&apos;ll respond within 2 hours.
            </p>
            <div className="flex items-center gap-3 text-gray-300">
              <Calculator className="w-5 h-5 text-accent-gold" />
              <span className="text-sm">Indicative estimate only — actual charges may vary</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card">
            <form onSubmit={calculate} className="space-y-4">
              <div>
                <label className="label">Shipment Mode</label>
                <select
                  className="select"
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                >
                  <option value="SEA">Sea Freight</option>
                  <option value="AIR">Air Freight</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Origin Port</label>
                  <input
                    className="input"
                    placeholder="e.g. Shanghai"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Destination Port</label>
                  <input
                    className="input"
                    placeholder="e.g. Chennai"
                    value={form.dest}
                    onChange={(e) => setForm({ ...form, dest: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Approx. Weight (KG)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 5000"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>

              {result && (
                <div className="bg-teal-50 border border-accent-teal/30 rounded-xl p-4 text-center">
                  <p className="text-text-secondary text-sm mb-1">Estimated Range</p>
                  <p className="text-2xl font-bold text-accent-teal font-mono">{result}</p>
                  <p className="text-xs text-text-secondary mt-1">Indicative only. Contact us for exact quote.</p>
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                Calculate Estimate
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
