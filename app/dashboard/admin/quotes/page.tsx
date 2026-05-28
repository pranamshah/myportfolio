"use client";
import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  mode: string;
  movement: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight?: number;
  cbm?: number;
  packages?: number;
  notes?: string;
  status: string;
  quotedAmt?: number;
  createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetch("/api/quotes").then((r) => r.json()).then(setQuotes).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Quote Requests</h1>
        <p className="text-text-secondary mt-1">{quotes.length} total quote requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "QUOTED", "ACCEPTED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? "bg-accent-teal text-white" : "bg-white text-text-secondary hover:bg-neutral-light"
            }`}
          >
            {s} {s === "ALL" ? `(${quotes.length})` : `(${quotes.filter((q) => q.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <p className="font-heading font-bold text-primary-deep">{q.name}</p>
                    {q.company && <span className="text-text-secondary text-sm">({q.company})</span>}
                    <span className={`badge text-xs ${
                      q.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      q.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                      q.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}>{q.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                    <span>{q.origin} → {q.destination}</span>
                    <span className={`font-medium ${q.mode === "SEA" ? "text-blue-600" : "text-purple-600"}`}>{q.mode}</span>
                    <span>{q.movement}</span>
                    {q.weight && <span>{q.weight} KG</span>}
                    {q.cbm && <span>{q.cbm} CBM</span>}
                    {q.packages && <span>{q.packages} pkgs</span>}
                  </div>
                  {q.notes && <p className="text-text-secondary text-sm mt-2 italic">{q.notes}</p>}
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xs text-text-secondary">{formatDate(q.createdAt)}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${q.email}`} className="btn-secondary text-xs py-1.5 px-3">Reply</a>
                    {q.status === "PENDING" && (
                      <button className="bg-green-500 text-white text-xs py-1.5 px-3 rounded-lg hover:bg-green-400 transition-colors">
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No {filter.toLowerCase()} quotes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
