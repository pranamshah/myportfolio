import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix NextAuth URL for Vercel preview deployments
  // VERCEL_URL is the current deployment's URL (preview or production)
  // This ensures auth callbacks use the correct domain
  env: {
    NEXTAUTH_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  },
};

export default nextConfig;
