import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Navkar Exim | Clearing & Forwarding Agent",
    template: "%s | Navkar Exim",
  },
  description: "Navkar Exim — Your trusted Clearing & Forwarding partner. Sea freight, air freight, customs coordination, and door-to-door logistics across India and worldwide.",
  keywords: ["freight forwarding", "clearing and forwarding", "customs agent", "sea freight", "air freight", "Chennai", "India"],
  openGraph: {
    title: "Navkar Exim | Clearing & Forwarding Agent",
    description: "Your trusted partner for sea freight, air freight, and customs coordination.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
