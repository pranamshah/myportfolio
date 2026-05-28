/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "@react-pdf/renderer"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Required for Prisma on Vercel
  outputFileTracingIncludes: {
    "/**": ["./prisma/**"],
  },
};

export default nextConfig;
