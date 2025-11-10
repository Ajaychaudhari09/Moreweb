import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/strapi-cms/',
          '/editor*',
          '/admin*',
          '/api*',
          '/_next*',
          '/feed.xml',
          '/main.py',
          '/word',
        ],
      },
    ],
    sitemap: 'https://morefusion.in/sitemap.xml',
  };
}
