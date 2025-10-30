import type { NextConfig } from "next";

/**
 * ✅ Clean Next.js 15.5.3 (Turbopack-Compatible) Configuration
 * - No deprecated keys
 * - Uses modern structure
 * - Works perfectly with npm run dev / build / start
 */
const nextConfig: NextConfig = {
  // ✅ New top-level typed routes (moved from experimental)
  typedRoutes: false,

  // ✅ Redirects (block access to restricted routes in production)
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        { source: "/editor", destination: "/404", permanent: false },
        { source: "/editor/:path*", destination: "/404", permanent: false },
        { source: "/admin", destination: "/404", permanent: false },
        { source: "/admin/:path*", destination: "/404", permanent: false },
      ];
    }
    return [];
  },

  // ✅ Security headers for admin/editor routes
  async headers() {
    return [
      {
        source: "/editor/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noarchive" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noarchive" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },

  // ✅ Remove console logs only in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Optimize imports for UI-heavy packages
  experimental: {
    optimizePackageImports: ["lucide-react", "@uiw/react-md-editor"],
  },

  // ✅ Image optimization for remote sources
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ✅ Allow these file extensions for pages
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

// ✅ Use default ESM export (don’t mix with module.exports)
export default nextConfig;
