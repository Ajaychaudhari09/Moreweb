// src/app/blog/[category]/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";


import {
  getPostBySlugSafe,
  getAllPosts,
  getPrevNext,
} from "@/lib/posts";

import TOC from "@/components/TOC";
import ZoomProvider from "@/components/ZoomProvider";
import MDXContent from "@/components/MDXContent";
import SocialShareButtons from "@/components/SocialShareButtons";

/* -------------------------------------------
   Metadata (Next.js 15 — async params)
-------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostBySlugSafe(category, slug);

  if (!post)
    return { title: "Post Not Found • MoreFusion", description: "Article missing" };

  const url = `https://morefusion.in/blog/${post.category}/${post.slug}`;

  return {
    title: `${post.title} | MoreFusion`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    alternates: { canonical: url },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const post = getPostBySlugSafe(category, slug);
  if (!post) notFound();

  const { prev, next } = getPrevNext(post.category, post.slug);
  const canonicalURL = `https://morefusion.in/blog/${post.category}/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image:
      post.image ||
      `https://morefusion.in/api/og?title=${encodeURIComponent(post.title)}`,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "MoreFusion",
      logo: {
        "@type": "ImageObject",
        url: "https://morefusion.in/android-chrome-192x192.png",
      },
    },
    mainEntityOfPage: canonicalURL,
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ZoomProvider />

      <div className="container mx-auto px-4 py-12">
        {/* Header stays full-width */}
        <header className="mx-auto max-w-4xl mb-10">
          <Link
            href={`/blog?category=${post.category}`}
            className="uppercase text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            {post.category}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mt-3">
            {post.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            By {post.author} •{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {post.readTime} min read
          </p>
        </header>

        {/* 2-column layout: content + TOC (TOC only on lg+) */}
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main article */}
          <article className="min-w-0">
            <div className="article-content">
              <MDXContent source={post.content} />
            </div>
            {/* ✅ Author Bio Box */}
              <AuthorBox author={post.author} />

            {(prev || next) && (
              <nav className="mt-12 grid md:grid-cols-2 gap-4 border-t pt-6">
                <div>
                  {prev && (
                    <Link
                      href={`/blog/${prev.category}/${prev.slug}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="font-semibold">{prev.title}</div>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {next && (
                    <Link
                      href={`/blog/${next.category}/${next.slug}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="font-semibold">{next.title}</div>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            <footer className="mt-12">
              <SocialShareButtons title={post.title} url={canonicalURL} />
              <div className="text-center mt-10">
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Back to Blog
                </Link>
              </div>
            </footer>
          </article>

          {/* TOC — right sidebar on lg+, hidden on small screens */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[70vh] overflow-y-auto border-l pl-4">
              <TOC />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
