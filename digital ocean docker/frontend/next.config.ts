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
  // Add experimental features for better standalone support
  experimental: {
    // Experimental features for better standalone support
  },
  // Ensure proper build output
  distDir: '.next',
  cleanDistDir: true,
  // Add output file tracing configuration
  outputFileTracingRoot: process.cwd(),
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  // Add webpack configuration for better standalone support
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure server-side code is properly bundled
      config.externals = config.externals || [];
    }
    return config;
  },
};

export default nextConfig;
