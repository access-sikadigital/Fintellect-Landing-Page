import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run alongside `next dev` without sharing (and corrupting) the .next cache
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    // Photos are served at q90 (default 75 looks soft on retina screens)
    qualities: [75, 90],
  },
  poweredByHeader: false,
  // Hide the dev-only "N" badge; it sat over the mobile sticky button while reviewing
  devIndicators: false,
};

export default nextConfig;
