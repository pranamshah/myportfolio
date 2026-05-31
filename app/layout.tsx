import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Navkar Impex — Freight Forwarding",
  description: "Professional freight forwarding and customs clearance services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload earth texture so it's in cache when Three.js initialises */}
        <link rel="preload" as="image" href="/earth-day.jpg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
