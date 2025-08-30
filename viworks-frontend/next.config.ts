import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper static file handling
  trailingSlash: false,
  // Disable image optimization for container deployment
  images: {
    unoptimized: true,
  },
  // Bind to all interfaces for container deployment
  serverExternalPackages: ['bcrypt'],
};

export default nextConfig;
