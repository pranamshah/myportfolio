import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Heart, Phone, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const values = [
  {
    icon: Heart,
    title: "Relationship-First",
    desc: "We build long-term partnerships, not just transactional relationships. Your business growth is our success.",
  },
  {
    icon: Phone,
    title: "Always Reachable",
    desc: "WhatsApp, phone, email — we respond within 2 hours, even on weekends for urgent clearances.",
  },
  {
    icon: FileText,
    title: "Zero Paperwork Stress",
    desc: "We handle every document — BL, BE, gatepass, e-way bill. You focus on your business.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-primary-deep py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl font-heading font-bold text-white mt-3 mb-6">
              Your Coordination Layer in Global Trade
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              We are your coordination layer — connecting you to the right CHA, CFS, and Shipping Line every time.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent-teal text-sm font-semibold uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl font-heading font-bold text-primary-deep mt-2 mb-6">
                  Built on Trust, Driven by Precision
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Navkar Exim was founded with a simple mission: make international trade effortless
                    for Indian importers and exporters. Based in Chennai — one of India&apos;s busiest port cities —
                    we have built deep relationships with Customs House Agents, Container Freight Stations,
                    and shipping lines across the country.
                  </p>
                  <p>
                    As a Clearing & Forwarding Agent, we are NOT a CHA. We are the layer between you and
                    the complex logistics chain — handling coordination, documentation, communication, and
                    problem-solving so you never have to deal with port authorities, shipping lines, or
                    customs offices directly.
                  </p>
                  <p>
                    From a single import shipment to ongoing export contracts, Navkar Exim has handled
                    500+ shipments across 50+ countries with a 99% on-time clearance record.
                  </p>
                </div>
              </div>

              <div className="bg-primary-deep rounded-2xl p-8 text-white">
                <h3 className="text-xl font-heading font-bold text-accent-teal mb-6">Our Network</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Partner CHAs", value: "20+" },
                    { label: "Countries Served", value: "50+" },
                    { label: "Shipping Lines", value: "15+" },
                    { label: "CFS Partners", value: "8+" },
                    { label: "Shipments Completed", value: "500+" },
                    { label: "On-Time Rate", value: "99%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-heading font-bold text-accent-gold">{stat.value}</p>
                      <p className="text-gray-300 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-heading font-bold text-primary-deep">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-card text-center">
                  <div className="w-14 h-14 bg-accent-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-7 h-7 text-accent-teal" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-deep text-xl mb-3">{v.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
