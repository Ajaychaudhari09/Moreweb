import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

const CATEGORIES: BlogPost['category'][] = [
  'AI', 'coding', 'drama', 'film', 'general', 'shopping'
];

export async function getAllPosts(): Promise<BlogPost[]> {
  const all: BlogPost[] = [];

  for (const category of CATEGORIES) {
    const dir = path.join(contentDirectory, category);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const filePath = path.join(dir, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(source);
      const slug = file.replace(/\.md$/, '');

      all.push({
        id: `${category}/${slug}`,
        slug,
        title: data.title ?? 'Untitled',
        excerpt: data.excerpt ?? content.slice(0, 150).replace(/[#*`]/g, '') + '...',
        date: data.date ?? new Date().toISOString(),
        author: data.author ?? 'MoreFusion Team',
        category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        image: data.image ?? undefined,
        content,
        readTime: calculateReadTime(content),
      });
    }
  }

  return all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.slice(0, limit);
}

export async function getPostsByCategory(
  category: BlogPost['category']
): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter(p => p.category === category);
}

export async function getPostBySlug(
  category: BlogPost['category'],
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(contentDirectory, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);

  return {
    id: `${category}/${slug}`,
    slug,
    title: data.title ?? 'Untitled',
    excerpt: data.excerpt ?? content.slice(0, 150).replace(/[#*`]/g, '') + '...',
    date: data.date ?? new Date().toISOString(),
    author: data.author ?? 'MoreFusion Team',
    category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    image: data.image ?? undefined,
    content,
    readTime: calculateReadTime(content),
  };
}
