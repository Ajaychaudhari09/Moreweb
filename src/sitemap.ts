// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

/**
 * Generates sitemap entries for static routes and all blog posts.
 * Uses NEXT_PUBLIC_SITE_URL for flexibility across environments.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.morefusion.in';

  // Static routes included in the app
  const staticRoutes: string[] = [
    '',
    '/tools',
    '/blog',
    '/about',
    '/bmi-calculator',
    '/emi-calculator',
    '/calorie-calculator',
    '/resume-maker',
    '/privacy',
    '/terms',
    '/contact',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog post routes from local markdown files (build-time)
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
