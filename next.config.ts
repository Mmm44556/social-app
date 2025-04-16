import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ["local-origin.dev", "e314cc46eda2.ngrok.app"],
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
