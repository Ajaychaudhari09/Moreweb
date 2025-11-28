import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Redirects work normally (server mode)
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        { source: "/editor", destination: "/404", permanent: false },
        { source: "/editor/:path*", destination: "/404", permanent: false },
        { source: "/admin", destination: "/404", permanent: false },
        { source: "/admin/:path*", destination: "/404", permanent: false },

        // ✅ NEW — hide Strapi CMS
        { source: "/strapi-cms", destination: "/404", permanent: false },
        { source: "/strapi-cms/:path*", destination: "/404", permanent: false },
      ];
    }
    return [];
  },

  // ✅ Headers work normally (server mode)
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

      // ✅ NEW — hide Strapi CMS folders from Google
      {
        source: "/strapi-cms/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noarchive" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },

  // ✅ Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Performance optimizations for Turbopack
  experimental: {
    optimizePackageImports: ["lucide-react", "@uiw/react-md-editor"],
  },

  // ✅ Safe image config
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },

  // ✅ Standard extensions
  pageExtensions: ["js", "jsx", "ts", "tsx"],

  // ✅ Security: Disable X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
