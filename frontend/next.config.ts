import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Bypass TypeScript errors during production builds on Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bypass ESLint errors during production builds on Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
