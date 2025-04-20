import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
    // Disable the new Rust-based transforms in Next.js
  webpack: (config, { isServer }) => {
    // Force CSS processing to use the JS implementation
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tailwindcss/oxide': false, // Disable Oxide
    }
    
    return config;
  },
}


export default nextConfig;
