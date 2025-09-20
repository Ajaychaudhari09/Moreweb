import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { BlogPost, BlogCategory } from '@/types';

const BLOG_ROOT = path.join(process.cwd(), 'src/content/blog');

export const CATEGORIES: BlogCategory[] = [
  'AI', 'coding', 'drama', 'film', 'general', 'shopping',
];

// Case-insensitive normalization from URL -> canonical folder name
export function normalizeCategory(input: unknown): BlogCategory | null {
  if (typeof input !== 'string') return null;
  const key = input.trim().toLowerCase();
  const map: Record<string, BlogCategory> = {
    ai: 'AI',
    coding: 'coding',
    drama: 'drama',
    film: 'film',
    general: 'general',
    shopping: 'shopping',
  };
  return map[key] ?? null;
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function stripMarkdown(md: string): string {
  return md
    .replace(/``````/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_>~#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(content: string, fallbackLen = 160): string {
  const plain = stripMarkdown(content);
  const cut = plain.slice(0, fallbackLen);
  return plain.length > fallbackLen ? `${cut}...` : cut;
}

function readPostFile(category: BlogCategory, fileName: string): BlogPost | null {
  if (!fileName.endsWith('.md')) return null;
  const slug = fileName.replace(/\.md$/, '');
  const filePath = path.join(BLOG_ROOT, category, fileName);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);

  const title = (data.title as string) ?? slug.replace(/-/g, ' ');
  const date = (data.date as string) ?? new Date(fs.statSync(filePath).mtime).toISOString();
  const author = (data.author as string) ?? 'MoreFusion Team';
  const excerpt = (data.excerpt as string) ?? buildExcerpt(content, 180);
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const image = (data.image as string) || undefined;

  return {
    id: `${category}/${slug}`,
    slug,
    title,
    excerpt,
    date,
    author,
    category,
    tags,
    image,
    content,
    readTime: calculateReadTime(content),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const items: BlogPost[] = [];
  for (const cat of CATEGORIES) {
    const dir = path.join(BLOG_ROOT, cat);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const post = readPostFile(cat, file);
      if (post) items.push(post);
    }
  }
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.slice(0, limit);
}

export async function getPostsByCategory(category: BlogCategory): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

export async function getPostBySlug(category: BlogCategory, slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_ROOT, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileName = `${slug}.md`;
  return readPostFile(category, fileName);
}

// Case-insensitive safe lookup
export async function getPostBySlugSafe(categoryInput: string, slug: string): Promise<BlogPost | null> {
  const cat = normalizeCategory(categoryInput);
  if (!cat) return null;
  return getPostBySlug(cat, slug);
}
