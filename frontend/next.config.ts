import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ─── Image optimization ─────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    remotePatterns: [
      // MyAnimeList / Jikan CDN
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/**",
      },
      // Jikan CDN fallback
      {
        protocol: "https",
        hostname: "api.jikan.moe",
        pathname: "/**",
      },
      // Common image hosts that MAL links to
      {
        protocol: "https",
        hostname: "*.myanimelist.net",
        pathname: "/**",
      },
    ],
  },

  /* ─── Compiler ───────────────────────────────── */
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  /* ─── Experimental ───────────────────────────── */
  experimental: {
    // Optimize package imports (tree-shake lucide-react properly)
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
  },

  /* ─── Security & cache headers ───────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
