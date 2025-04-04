import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://safespace-api-6wr5.onrender.com/api/:path*", // Replace with your Render API URL
      },
    ];
  },
};

export default nextConfig;
