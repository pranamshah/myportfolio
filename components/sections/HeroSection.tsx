"use client";
import Link from "next/link";
import { HeroCanvas } from "@/components/animations/HeroCanvas";
import { ArrowRight, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [trackRef, setTrackRef] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackRef.trim()) router.push(`/track?ref=${encodeURIComponent(trackRef)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary-deep">
      {/* Animated Canvas Background */}
      <HeroCanvas />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/50 via-transparent to-primary-deep/80" style={{ zIndex: 1 }} />

      {/* Animated Ship SVG */}
      <div className="absolute bottom-32 left-0 animate-ship" style={{ zIndex: 2, opacity: 0.7 }}>
        <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
          <rect x="20" y="30" width="160" height="20" rx="4" fill="#0E3D52" />
          <rect x="40" y="15" width="100" height="15" rx="2" fill="#0E7490" />
          <rect x="55" y="5" width="30" height="15" rx="2" fill="#0E3D52" />
          <rect x="100" y="8" width="20" height="10" rx="2" fill="#D97706" />
          <rect x="25" y="25" width="10" height="8" fill="#0E7490" />
          <rect x="40" y="25" width="10" height="8" fill="#D97706" />
          <rect x="55" y="25" width="10" height="8" fill="#0E7490" />
          <rect x="70" y="25" width="10" height="8" fill="#D97706" />
          <rect x="85" y="25" width="10" height="8" fill="#0E7490" />
          <polygon points="20,50 10,50 15,42" fill="#0E3D52" />
          <polygon points="180,50 190,50 185,42" fill="#0E3D52" />
        </svg>
      </div>

      {/* Animated Plane SVG */}
      <div className="absolute top-24 left-0 animate-plane" style={{ zIndex: 2, opacity: 0.6 }}>
        <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
          <path d="M0,15 L60,5 L80,15 L60,20 Z" fill="#94a3b8" />
          <path d="M40,15 L55,8 L55,15 Z" fill="#cbd5e1" />
          <path d="M50,15 L60,20 L60,15 Z" fill="#cbd5e1" />
          <circle cx="10" cy="15" r="3" fill="#e2e8f0" />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32" style={{ zIndex: 3 }}>
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent-teal/20 border border-accent-teal/30 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent-teal" />
            <span className="text-accent-teal text-sm font-medium">Chennai-based Clearing & Forwarding Agent</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
            Your Trusted{" "}
            <span className="text-accent-teal">Clearing &</span>
            <br />
            <span className="text-accent-teal">Forwarding</span> Partner
          </h1>

          <p className="text-xl text-gray-300 mb-4 font-medium tracking-wide">
            Sea. Air. Door to Door.
          </p>

          <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
            We connect you to the right CHA, CFS, and Shipping Line — every time.
            Import, export, and everything in between.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-accent-teal text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:shadow-teal-glow transition-all duration-200"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-accent-teal hover:text-accent-teal transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              Track Shipment
            </Link>
          </div>

          {/* Quick Track Form */}
          <form onSubmit={handleTrack} className="flex gap-3 max-w-lg">
            <input
              type="text"
              value={trackRef}
              onChange={(e) => setTrackRef(e.target.value)}
              placeholder="Enter BL No / Job No / AWB No..."
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-teal transition-colors"
            />
            <button
              type="submit"
              className="bg-accent-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap"
            >
              Track
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
