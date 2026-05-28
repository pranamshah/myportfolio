

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "@react-pdf/renderer"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
