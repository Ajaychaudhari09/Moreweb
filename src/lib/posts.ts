import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogCategory } from '../types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

function listMarkdownFilesRecursively(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFilesRecursively(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getSortedPostsData(): BlogPost[] {
  // Recursively collect all markdown files in postsDirectory
  const filePaths = listMarkdownFilesRecursively(postsDirectory);
  const allPostsData = filePaths.map((fullPath) => {
    // Derive an id relative to postsDirectory, drop extension
    const rel = path.relative(postsDirectory, fullPath).replace(/\\/g, '/');
    const id = rel.replace(/\.(md|mdx)$/i, '');

    // Read markdown file as string
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Frontmatter fields with sensible fallbacks
    const fm = matterResult.data as Partial<{
      date: string;
      title: string;
      slug: string;
      excerpt: string;
      author: string;
      category: string;
      tags: string[];
      image: string;
      readTime: number | string;
      featured: boolean;
      published: boolean;
    }>;

    // Normalize to BlogPost shape used in src/types
    const slug = fm.slug ?? id;
    const title = fm.title ?? id.split('/').pop() ?? id;
    const date = fm.date ?? new Date().toISOString();
    const excerpt = fm.excerpt ?? '';
    const author = fm.author ?? 'Unknown';
    const category = (fm.category as BlogCategory) ?? 'general';
    const tags = Array.isArray(fm.tags) ? fm.tags : [];
    const image = fm.image;
    const readTime = typeof fm.readTime === 'number' ? fm.readTime :  Math.ceil((matterResult.content.split(/\s+/).length || 1) / 200);

    return {
      id,
      slug,
      title,
      excerpt,
      date,
      author,
      category,
      tags,
      image,
      content: matterResult.content,
      readTime,
      // Keep extra flags if needed by UI
      featured: fm.featured ?? false,
      published: fm.published ?? true,
    } as BlogPost;
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getLatestPosts(): BlogPost[] {
  const allPosts = getSortedPostsData();
  return allPosts.slice(0, 6);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const categoryPath = path.join(postsDirectory, category);
  if (!fs.existsSync(categoryPath)) {
    return [];
  }
  const filePaths = listMarkdownFilesRecursively(categoryPath);
  const allPostsData = filePaths.map((fullPath) => {
    const rel = path.relative(postsDirectory, fullPath).replace(/\\/g, '/');
    const id = rel.replace(/\.(md|mdx)$/i, '');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const fm = matterResult.data as Partial<{
      date: string;
      title: string;
      slug: string;
      excerpt: string;
      author: string;
      tags: string[];
      image: string;
      readTime: number | string;
      featured: boolean;
      published: boolean;
    }>;

    const slug = fm.slug ?? id;
    const title = fm.title ?? id.split('/').pop() ?? id;
    const date = fm.date ?? new Date().toISOString();

    return {
      id,
      slug,
      title,
      date,
      excerpt: fm.excerpt ?? '',
      author: fm.author ?? 'Unknown',
      category: category as BlogCategory,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      image: fm.image,
      content: matterResult.content,
      readTime: typeof fm.readTime === 'number' ? fm.readTime : Math.ceil((matterResult.content.split(/\s+/).length || 1) / 200),
      featured: fm.featured ?? false,
      published: fm.published ?? true,
    } as BlogPost;
  });
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    const allPosts = getSortedPostsData();
    return allPosts.find(post => post.id === slug);
}
