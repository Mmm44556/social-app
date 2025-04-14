import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "d1ff-111-246-161-176.ngrok-free.app",
  ],
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/profile",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // output: "standalone",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "25c3zyr60qssb40h.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
