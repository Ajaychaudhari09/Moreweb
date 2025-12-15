// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://morefusion.in',
  trailingSlash: 'never',
  prefetch: true,
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    tailwind(),
    partytown({
      config: {
        debug: false,
        forward: ["dataLayer.push"],
      },
    }),
  ],
  image: {
    domains: ["images.unsplash.com"],
  },

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: { className: ['heading-link'] }
      }]
    ]
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@resvg/resvg-js', 'html2canvas']
    },
    build: {
      assetsInlineLimit: 65536, // 64kb
    }
  }
});