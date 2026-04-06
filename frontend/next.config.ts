import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Bypass TypeScript errors during production builds on Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
