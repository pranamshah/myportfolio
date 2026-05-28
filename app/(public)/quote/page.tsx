"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CheckCircle, Loader2, Ship } from "lucide-react";
import type { Metadata } from "next";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  mode: z.enum(["SEA", "AIR"]),
  movement: z.enum(["IMPORT", "EXPORT"]),
  origin: z.string().min(2),
  destination: z.string().min(2),
  cargoType: z.enum(["GENERAL", "HAZMAT", "PERISHABLE", "REEFER"]),
  weight: z.string().optional(),
  cbm: z.string().optional(),
  packages: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { mode: "SEA", movement: "IMPORT", cargoType: "GENERAL" },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-primary-deep py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Free Quote</span>
            <h1 className="text-4xl font-heading font-bold text-white mt-3 mb-4">Get a Free Quote</h1>
            <p className="text-gray-300">We reply within 2 hours on WhatsApp and email.</p>
          </div>
        </section>

        <section className="py-16 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Left illustration */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="bg-primary-deep rounded-2xl p-8 text-white h-full min-h-96 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-accent-teal/20 rounded-2xl flex items-center justify-center mb-6">
                      <Ship className="w-8 h-8 text-accent-teal" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-4">
                      Fast, Accurate, Reliable
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      Fill in the form and our team will prepare a detailed quote with
                      all-inclusive charges — freight, customs, CFS, transportation, and our coordination fees.
                    </p>
                  </div>
                  <div className="space-y-3 mt-8">
                    {["Response in 2 hours", "All-inclusive quote", "Dedicated agent assigned", "No hidden charges"].map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent-teal flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                {submitted ? (
                  <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary-deep mb-2">Quote Request Received!</h3>
                    <p className="text-text-secondary">
                      Our team will contact you within 2 hours on WhatsApp and email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input {...register("name")} className="input" placeholder="Ravi Kumar" />
                        {errors.name && <p className="text-danger text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input {...register("email")} type="email" className="input" placeholder="ravi@company.com" />
                        {errors.email && <p className="text-danger text-xs mt-1">Valid email required</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">WhatsApp Number *</label>
                        <input {...register("phone")} className="input" placeholder="+91 98765 43210" />
                        {errors.phone && <p className="text-danger text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className="label">Company Name</label>
                        <input {...register("company")} className="input" placeholder="Optional" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Shipment Type *</label>
                        <select {...register("mode")} className="select">
                          <option value="SEA">Sea Freight</option>
                          <option value="AIR">Air Freight</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Movement *</label>
                        <select {...register("movement")} className="select">
                          <option value="IMPORT">Import</option>
                          <option value="EXPORT">Export</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Origin Port *</label>
                        <input {...register("origin")} className="input" placeholder="e.g. Shanghai, China" />
                        {errors.origin && <p className="text-danger text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className="label">Destination Port *</label>
                        <input {...register("destination")} className="input" placeholder="e.g. Chennai, India" />
                        {errors.destination && <p className="text-danger text-xs mt-1">Required</p>}
                      </div>
                    </div>

                    <div>
                      <label className="label">Cargo Type *</label>
                      <select {...register("cargoType")} className="select">
                        <option value="GENERAL">General Cargo</option>
                        <option value="HAZMAT">Hazardous (DG)</option>
                        <option value="PERISHABLE">Perishable</option>
                        <option value="REEFER">Reefer (Cold Chain)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="label">Weight (KG)</label>
                        <input {...register("weight")} type="number" className="input" placeholder="5000" />
                      </div>
                      <div>
                        <label className="label">CBM</label>
                        <input {...register("cbm")} type="number" step="0.01" className="input" placeholder="10.5" />
                      </div>
                      <div>
                        <label className="label">No. of Packages</label>
                        <input {...register("packages")} type="number" className="input" placeholder="50" />
                      </div>
                    </div>

                    <div>
                      <label className="label">Special Notes</label>
                      <textarea
                        {...register("notes")}
                        className="input resize-none"
                        rows={3}
                        placeholder="Any special requirements, cargo description, HS code, etc."
                      />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Submit for Free Quote
                    </button>
                    <p className="text-center text-text-secondary text-sm">
                      We reply within 2 hours on WhatsApp
                    </p>
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
