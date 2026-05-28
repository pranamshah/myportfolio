"use client";
import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Clients</h1>
        <p className="text-text-secondary mt-1">{clients.length} registered clients</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-text-secondary" />
        <input
          className="flex-1 outline-none text-sm text-primary-deep placeholder-text-secondary"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent-teal/10 rounded-full flex items-center justify-center text-accent-teal font-bold">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-primary-deep">{c.name}</p>
                  {c.company && <p className="text-text-secondary text-xs">{c.company}</p>}
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${c.email}`} className="hover:text-accent-teal">{c.email}</a>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-3">Joined {formatDate(c.createdAt)}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No clients found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
