import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        { source: '/editor', destination: '/404', permanent: false },
        { source: '/editor/:path*', destination: '/404', permanent: false },
        { source: '/admin', destination: '/404', permanent: false },
        { source: '/admin/:path*', destination: '/404', permanent: false },
      ];
    }
    return [];
  },

  async headers() {
    return [
      {
        source: '/editor/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet, noarchive' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet, noarchive' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@uiw/react-md-editor'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },

  // No MDX extension here; leave only standard page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

export default nextConfig;
