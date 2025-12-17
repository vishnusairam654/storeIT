import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ REMOVED: ignoreBuildErrors: true
  // This was hiding real TypeScript errors that need to be fixed

  experimental: {
    serverActions: {
      bodySizeLimit: "250mb", // Critical for media uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;