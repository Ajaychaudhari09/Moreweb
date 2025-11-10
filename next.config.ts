import type { NextConfig } from "next";

/**
 * ✅ Production-Ready Next.js 15.5.3 Configuration
 * Compatible with Turbopack, Netlify Static Export & Cloudflare Pages
 * - Static export (creates /out folder)
 * - Optimized for performance & SEO
 * - Safe redirects & headers
 */
const nextConfig: NextConfig = {
  // ✅ Use static export (required for Netlify or Cloudflare Pages)
  output: "export",

  // ✅ Unoptimized images (for static export mode)
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ✅ Remove all console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Optimize common packages
  experimental: {
    optimizePackageImports: ["lucide-react", "@uiw/react-md-editor"],
  },

  // ✅ Block access to admin/editor routes on production
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        { source: "/editor", destination: "/404", permanent: false },
        { source: "/editor/:path*", destination: "/404", permanent: false },
        { source: "/admin", destination: "/404", permanent: false },
        { source: "/admin/:path*", destination: "/404", permanent: false },
        { source: "/strapi-cms", destination: "/404", permanent: false },
        { source: "/strapi-cms/:path*", destination: "/404", permanent: false },
      ];
    }
    return [];
  },

<<<<<<< HEAD
  // ✅ Security headers for admin/editor/strapi routes
=======
  // ✅ Secure headers for private routes
>>>>>>> 1c817986cf01b9d216ea952be41b7b6bab0d21c1
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
      {
        source: "/strapi-cms/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noarchive" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },

  // ✅ Typed routes (disabled for simplicity)
  typedRoutes: false,

  // ✅ Supported page extensions
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
