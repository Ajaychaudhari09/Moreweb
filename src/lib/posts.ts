// src/lib/posts.ts
// ✅ Unified Blog Loader — Supports both .md and .mdx

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogFrontmatter, BlogCategory } from "@/types";

const BLOG_ROOT = path.join(process.cwd(), "src/content/blog");

/* ---------------------------------------------------------
 ✅ CATEGORY NORMALIZER
---------------------------------------------------------- */
export function normalizeCategory(cat: string | undefined): BlogCategory | null {
  if (!cat) return null;
  const lc = cat.toLowerCase();

  const MAP: Record<string, BlogCategory> = {
    ai: "AI",
    coding: "coding",
    drama: "drama",
    film: "film",
    general: "general",
    shopping: "shopping",
  };

  return MAP[lc] ?? null;
}

/* ---------------------------------------------------------
 ✅ RECURSIVE .md / .mdx FILE SEARCH
---------------------------------------------------------- */
function getMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (folder: string) => {
    const items = fs.readdirSync(folder, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(folder, item.name);
      if (item.isDirectory()) walk(full);
      else if (/\.(md|mdx)$/i.test(item.name)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

/* ---------------------------------------------------------
 ✅ STRIP MARKDOWN → EXCERPT
---------------------------------------------------------- */
function stripMarkdown(md: string): string {
  return md
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[*_>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(content: string, max = 180): string {
  const text = stripMarkdown(content);
  return text.length > max ? text.slice(0, max) + "..." : text;
}

/* ---------------------------------------------------------
 ✅ READ SINGLE POST
---------------------------------------------------------- */
function readPost(fullPath: string): BlogPost {
  const rel = path.relative(BLOG_ROOT, fullPath).replace(/\\/g, "/");
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const fm = data as BlogFrontmatter;

  const folder = rel.split("/")[0];
  const category = normalizeCategory(fm.category ?? folder);
  if (!category) throw new Error(`❌ Invalid category for: ${fullPath}`);

  const fileName = path.basename(fullPath).replace(/\.(md|mdx)$/i, "");
  const slug = (fm.slug ?? fileName).toLowerCase();

  const date =
    fm.published_date ??
    fm.date ??
    new Date(fs.statSync(fullPath).mtime).toISOString();

  const author = fm.author ?? "MoreFusion Team";
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const image = fm.image ?? undefined;

  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: `${category}/${slug}`,
    slug,
    title: fm.title ?? slug.replace(/-/g, " "),
    excerpt: fm.excerpt ?? buildExcerpt(content),
    date,
    author,
    category,
    tags,
    image,
    content,
    readTime,
  };
}

/* ---------------------------------------------------------
 ✅ PUBLIC FUNCTIONS
---------------------------------------------------------- */

// ✅ ALL POSTS (sorted by date)
export function getAllPosts(): BlogPost[] {
  return getMarkdownFiles(BLOG_ROOT)
    .map((file) => readPost(file))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ✅ RECENT POSTS
export function getLatestPosts(limit = 6): BlogPost[] {
  return getAllPosts().slice(0, limit);
}

// ✅ BY CATEGORY
export function getPostsByCategory(cat: string): BlogPost[] {
  const category = normalizeCategory(cat);
  if (!category) return [];
  return getAllPosts().filter((p) => p.category === category);
}

// ✅ SAFE LOOKUP
export function getPostBySlugSafe(cat: string, slug: string): BlogPost | null {
  const category = normalizeCategory(cat);
  if (!category) return null;

  return (
    getAllPosts().find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.category === category
    ) ?? null
  );
}

// ✅ PREVIOUS / NEXT (same category)
export function getPrevNext(category: string, slug: string) {
  const posts = getPostsByCategory(category);
  const index = posts.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
