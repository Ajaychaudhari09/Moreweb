import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import type { BlogPost } from '@/types';

/**
 * Generates sitemap entries for static routes and all blog posts.
 * Uses NEXT_PUBLIC_SITE_URL for flexibility across environments.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://morefusion.in';

  // Static routes that actually exist in the app
  const staticRoutes: Array<{ path: string; priority: number }> = [
    { path: '', priority: 1.0 },
    { path: '/tools', priority: 0.9 },
    { path: '/blog', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/docs', priority: 0.8 },
    { path: '/privacy', priority: 0.7 },
    { path: '/terms', priority: 0.7 },
    { path: '/bmi-calculator', priority: 0.7 },
    { path: '/emi-calculator', priority: 0.7 },
    { path: '/calorie-calculator', priority: 0.7 },
    { path: '/resume-maker', priority: 0.7 },
    { path: '/diet-generator', priority: 0.7 },
    { path: '/exercise-generator', priority: 0.7 },
    { path: '/date-time-calculator', priority: 0.7 },
    { path: '/text-editor', priority: 0.7 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  // Blog post routes from markdown files (await the Promise)
  const posts: BlogPost[] = await getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post: BlogPost) => ({
    url: `${siteUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}