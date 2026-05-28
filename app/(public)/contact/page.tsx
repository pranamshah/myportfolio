"use client";
import { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, mode: "SEA", movement: "IMPORT", origin: "Contact Form", destination: "N/A", cargoType: "GENERAL" }),
    });
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-primary-deep py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl font-heading font-bold text-white mt-3 mb-4">Contact Us</h1>
            <p className="text-gray-300">We&apos;re always reachable — WhatsApp, call, or email.</p>
          </div>
        </section>

        <section className="py-20 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-heading font-bold text-primary-deep text-xl mb-5">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-deep">Office Address</p>
                        <p className="text-text-secondary text-sm">Chennai, Tamil Nadu — 600001, India</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-accent-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-deep">Phone</p>
                        <a href="tel:+919876543210" className="text-accent-teal text-sm hover:underline">+91 98765 43210</a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-deep">WhatsApp</p>
                        <a
                          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 text-sm hover:underline"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-accent-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-deep">Email</p>
                        <a href="mailto:info@navkarexim.com" className="text-accent-teal text-sm hover:underline">info@navkarexim.com</a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-accent-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-deep">Working Hours</p>
                        <p className="text-text-secondary text-sm">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                        <p className="text-text-secondary text-sm">WhatsApp: 24/7 for urgent queries</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-primary-ocean rounded-2xl p-8 text-center text-white">
                  <MapPin className="w-10 h-10 text-accent-teal mx-auto mb-3" />
                  <p className="font-semibold">Chennai Port Area</p>
                  <p className="text-gray-300 text-sm mt-1">Near Chennai Port Trust, Tamil Nadu</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-card p-8">
                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-primary-deep mb-2">Message Received!</h3>
                    <p className="text-text-secondary">We&apos;ll get back to you within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-heading font-bold text-primary-deep text-xl mb-2">Send a Message</h3>
                    <div>
                      <label className="label">Name</label>
                      <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Message</label>
                      <textarea
                        className="input resize-none"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
