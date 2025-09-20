import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // ✅ Hide Decap CMS editor (/admin) in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        // Redirect /editor routes to 404
        { source: '/editor', destination: '/404', permanent: false },
        { source: '/editor/:path*', destination: '/404', permanent: false },

        // Redirect /admin (Decap CMS) routes to 404
        { source: '/admin', destination: '/404', permanent: false },
        { source: '/admin/:path*', destination: '/404', permanent: false },
      ];
    }
    return [];
  },

  // ✅ Extra protection: block search engines & caching for /editor & /admin
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

  // ✅ Strip console logs in production
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },

  // ✅ Performance optimization
  experimental: { optimizePackageImports: ['lucide-react', '@uiw/react-md-editor'] },

  // ✅ Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },

  // ✅ Support MDX/MD files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
