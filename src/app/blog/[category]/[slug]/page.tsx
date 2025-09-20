// src/app/blog/[category]/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAllPosts, getPostBySlugSafe } from "@/lib/blog";
import AuthorCard from "@/components/AuthorCard";
import { BlogNavigation } from "@/components/BlogNavigation";
import { BackButton } from "@/components/BackButton";

interface Params {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlugSafe(category, slug);
  if (!post) {
    return { title: "Post Not Found | MoreFusion", description: "" };
  }
  return { title: `${post.title} | MoreFusion`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Params) {
  const { category, slug } = await params;

  // Case-safe lookup for category folders like "AI"
  const post = await getPostBySlugSafe(category, slug);
  if (!post) notFound();

  const filePath = path.join(
    process.cwd(),
    "src/content/blog",
    post.category,
    `${post.slug}.md`
  );
  if (!fs.existsSync(filePath)) notFound();

  const source = fs.readFileSync(filePath, "utf8");
  const { content } = matter(source);

  const badgeColor =
    post.category === "AI"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
      : post.category === "coding"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
      : post.category === "film"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
      : post.category === "drama"
      ? "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200"
      : post.category === "shopping"
      ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200";

  const emoji =
    post.category === "AI"
      ? "🤖"
      : post.category === "coding"
      ? "💻"
      : post.category === "film"
      ? "🎬"
      : post.category === "drama"
      ? "🎭"
      : post.category === "shopping"
      ? "🛒"
      : "📝";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="mx-auto max-w-4xl px-6 py-12">
        {/* Top actions */}
        <div className="mb-4 flex items-center justify-between">
          <BackButton label="Back" />
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            All Posts →
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="px-2">/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span className="px-2">/</span>
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="hover:underline"
          >
            {post.category}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeColor}`}>
              {emoji} {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.readTime} min read</span>
          </div>

          <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
            {post.title}
          </h1>

          <div className="mb-6 flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <time>{new Date(post.date).toLocaleDateString()}</time>
          </div>

          {post.excerpt && (
            <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Body */}
        <section className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </section>

        {/* Author */}
        <AuthorCard
          name={post.author || "MoreFusion Team"}
          bio="Morefusion shares practical insights on tech, productivity, and development to help creators and developers work smarter."
          links={[
            { label: "More Articles by Morefusion", href: "/blog" },
            { label: "Try Our Tools", href: "/tools" },
          ]}
        />

        {/* Footer navigation (uses client BlogNavigation) */}
        <div className="mt-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 p-6 text-white shadow-lg">
          <h3 className="text-2xl font-bold">Continue Your Learning Journey</h3>
          <p className="mt-2 text-sm/relaxed opacity-95">
            Discover more expert insights on tech, development trends, and practical guides to accelerate growth.
          </p>
          <BlogNavigation className="mt-6" />
        </div>
      </article>
    </div>
  );
}
