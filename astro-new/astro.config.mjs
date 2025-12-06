// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://morefusion.in',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    tailwind()
  ],
  image: {
    domains: ["images.unsplash.com"],
    service: passthroughImageService()
  },

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { className: ['anchor-link'] },
        content: { type: 'text', value: '#' }
      }]
    ]
  }
});