// src/lib/posts.ts
// ✅ Unified Blog Loader — Adapted for Astro Content Collections

import { getCollection } from 'astro:content';
import type { BlogPost, BlogCategory } from "@/types";

import { normalizeCategory } from './utils';

/* ---------------------------------------------------------
 ✅ READ SINGLE POST (Adapter)
---------------------------------------------------------- */

/* ---------------------------------------------------------
 ✅ READ SINGLE POST (Adapter)
---------------------------------------------------------- */
function mapAstroEntryToBlogPost(entry: any): BlogPost {
  const { data, body, slug: originalSlug } = entry;

  // Extract category from folder path if not in frontmatter
  // Astro slug is "folder/filename" e.g. "ai/my-post"
  const [folder, ...rest] = originalSlug.split('/');
  const fileName = rest.join('/');

  const category = normalizeCategory(data.category ?? folder);
  if (!category) {
    // Fallback or error handling
    console.warn(`Invalid category for: ${originalSlug}`);
  }

  const slug = fileName || folder; // Handle cases where slug might be just filename if flat structure

  const wordCount = body.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: originalSlug,
    slug: slug, // We want just the last part for the URL usually, or keep full if that's how it was
    title: data.title,
    excerpt: data.excerpt ?? "",
    date: data.date ?? data.published_date ?? new Date().toISOString(),
    author: data.author,
    category: category as BlogCategory,
    tags: data.tags,
    image: data.image,
    content: body, // Raw body for search/excerpts, but rendering happens via 'render(entry)'
    readTime,
    // Attach the original entry for rendering later
    _astroEntry: entry
  } as BlogPost & { _astroEntry: any };
}

/* ---------------------------------------------------------
 ✅ PUBLIC FUNCTIONS
---------------------------------------------------------- */

// ✅ ALL POSTS (sorted by date)
export async function getAllPosts(): Promise<BlogPost[]> {
  const localEntries = await getCollection('blog');
  const localPosts = localEntries.map(mapAstroEntryToBlogPost);

  const allPosts = [...localPosts];

  return allPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

// ✅ RECENT POSTS
export async function getLatestPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

// ✅ BY CATEGORY
export async function getPostsByCategory(cat: string): Promise<BlogPost[]> {
  const category = normalizeCategory(cat);
  if (!category) return [];
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === category);
}

// ✅ SAFE LOOKUP
export async function getPostBySlugSafe(cat: string, slug: string): Promise<BlogPost | null> {
  const category = normalizeCategory(cat);
  if (!category) return null;

  const posts = await getAllPosts();
  return (
    posts.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.category === category
    ) ?? null
  );
}

// ✅ PREVIOUS / NEXT (same category)
export async function getPrevNext(category: string, slug: string) {
  const posts = await getPostsByCategory(category);
  const index = posts.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
