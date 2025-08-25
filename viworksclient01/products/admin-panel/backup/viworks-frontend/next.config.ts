import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Ensure proper static file handling
  trailingSlash: false,
  // Disable image optimization for container deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
