"use client";
import { useState } from "react";
import { Phone, MessageCircle, Send, CheckCircle } from "lucide-react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export default function SupportPage() {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Support</h1>
        <p className="text-text-secondary mt-1">Get help from your dedicated Navkar Exim agent</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:+919876543210"
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-heading font-bold text-primary-deep">Call Agent</p>
            <p className="text-text-secondary text-sm">+91 98765 43210</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${whatsapp}?text=Hi, I need help with my shipment`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-heading font-bold text-primary-deep">WhatsApp Chat</p>
            <p className="text-text-secondary text-sm">Usually replies in minutes</p>
          </div>
        </a>
      </div>

      {/* Ticket Form */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-heading font-bold text-primary-deep mb-4">Raise a Support Ticket</h2>
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-primary-deep">Ticket Submitted</h3>
            <p className="text-text-secondary text-sm mt-1">Our team will get back to you within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <input
                className="input"
                placeholder="e.g. Issue with shipment JOB-2025-001"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Describe your issue in detail..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
