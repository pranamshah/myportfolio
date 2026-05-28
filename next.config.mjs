/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "@react-pdf/renderer"],
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};
export default nextConfig;
