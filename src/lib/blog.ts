// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogCategory, BlogPost } from '@/types';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog');

// Recursively collect all .md/.mdx files (supports AI, coding, drama, film, general, shopping folders)
function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && (full.endsWith('.md') || full.endsWith('.mdx'))) {
      files.push(full);
    }
  }
  return files;
}

// Ensure a strict string (not array/undefined)
function normalizeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return String(value ?? '').trim();
  return fallback;
}

// Ensure strict tags string[]
function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function toCategoryKey(input: string): string {
  return input.trim().toLowerCase();
}

function mapToCategory(input: string): BlogCategory {
  const key = toCategoryKey(input);
  switch (key) {
    case 'ai':
      return 'AI';
    case 'coding':
      return 'Coding';
    case 'drama':
      return 'Drama';
    case 'film':
      return 'Film';
    case 'general':
      return 'General';
    case 'shopping':
      return 'Shopping';
    default:
      return 'General';
  }
}

function normalizeCategory(value: unknown, fallback: BlogCategory): BlogCategory {
  // Accept string | string[] | undefined and return a strict BlogCategory
  const raw = normalizeString(value, '');
  if (!raw) return fallback;
  return mapToCategory(raw);
}

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

// Read all posts in nested folders, normalize fields, and create single‑segment slugs for /blog/[slug]
export function getAllPosts(): BlogPost[] {
  const filePaths = walk(postsDirectory);

  const posts = filePaths.map((fullPath) => {
    const rel = path.relative(postsDirectory, fullPath); // e.g., "AI/my-post.mdx"
    const parts = rel.split(path.sep);
    // Coerce to a definite string; never pass arrays further
    const categorySegment: string = typeof parts === 'string' && parts ? parts : 'general';

    const fileName = path.basename(fullPath).replace(/\.mdx?$/, '');
    const fileRaw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileRaw);

    const dataObj = data as Record<string, unknown>;

    const title = normalizeString(dataObj.title, fileName);
    const category = normalizeCategory(dataObj.category, mapToCategory(categorySegment));
    const author = normalizeString(dataObj.author, 'MoreFusion Team');
    const date = normalizeString(dataObj.date, '');
    const readTime = normalizeString(dataObj.readTime, '5 min read');
    const excerpt = normalizeString(dataObj.excerpt, '');
    const tags = normalizeTags(dataObj.tags);

    const slug = `${slugify(String(category))}-${slugify(fileName)}`;

    const post: BlogPost = {
      id: slug,
      slug,
      title,
      excerpt,
      content, // raw markdown; render with react-markdown in the page
      category,
      author,
      date,
      readTime,
      tags,
    };
    return post;
  });

  posts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  return posts;
}

export function getRecentPosts(count = 3): BlogPost[] {
  return getAllPosts().slice(0, count);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getPostsByCategory(category: string): BlogPost[] {
  const all = getAllPosts();
  const target = toCategoryKey(category);
  return all.filter((p) => toCategoryKey(p.category) === target);
}
