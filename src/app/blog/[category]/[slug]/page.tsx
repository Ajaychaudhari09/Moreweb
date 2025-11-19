// src/app/blog/[category]/[slug]/page.tsx
import "@/styles/blog.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

import AuthorBox from "@/components/AuthorBox";
import {
  getPostBySlugSafe,
  getAllPosts,
  getPrevNext,
} from "@/lib/posts";
import TOC from "@/components/TOC";
import ZoomProvider from "@/components/ZoomProvider";
import ReadingProgress from "@/components/ReadingProgress";
import MDXContent from "@/components/MDXContent";
import SocialShareButtons from "@/components/SocialShareButtons";
import AdsterraAd from "@/components/AdsterraAd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  // ✅ unwrap Promise-based params
  const { category, slug } = await params;
  const post = getPostBySlugSafe(category, slug);

  if (!post) {
    return {
      title: "Post Not Found • MoreFusion",
      description: "Article missing",
    };
  }

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
    alternates: {
      canonical: url,
    },
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
  // ✅ unwrap Promise-based params
  const { category, slug } = await params;

  const post = getPostBySlugSafe(category, slug);
  if (!post) {
    notFound();
  }

  const { prev, next } = getPrevNext(post.category, post.slug);
  const canonicalURL = `https://morefusion.in/blog/${post.category}/${post.slug}`;

  // Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image:
      post.image ||
      `https://morefusion.in/api/og?title=${encodeURIComponent(post.title)}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
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

  // Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: "https://morefusion.in/blog",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category,
        item: `https://morefusion.in/blog/${post.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalURL,
      },
    ],
  };

  return (
    <main className="bg-white dark:bg-gray-950">
      <ReadingProgress />
      {/* SEO Schemas */}
      <Script
        id="article-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <ZoomProvider />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Post Hero */}
        <div className={`post-hero mb-8 ${post.category === 'AI' ? 'post-hero-ai' : ''}`}>
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt={post.title} className="post-hero-image" />
          ) : null}
          <div className="post-hero-overlay" />
          <div className="post-hero-inner">
            <Link href={`/blog?category=${post.category}`} className="tag tag--indigo">
              {post.category}
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 leading-tight">{post.title}</h1>
            <p className="post-meta mt-3">By {post.author} · {new Date(post.date).toLocaleDateString()} {post.readTime ? `· ${post.readTime} min read` : ''}</p>
          </div>
        </div>

        {/* Layout: Content + TOC */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          {/* Main Article */}
          <article className="min-w-0">
            <div className="article-content">
              <MDXContent source={post.content} />

              {/* Inline Ad */}
              <div className="mt-8">
                <AdsterraAd />
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-10">
              <AuthorBox author={post.author} />
            </div>

            {/* Prev / Next */}
            {(prev || next) && (
              <nav className="mt-12 grid gap-4 border-t pt-6 md:grid-cols-2">
                {prev && (
                  <Link
                    href={`/blog/${prev.category}/${prev.slug}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="text-xs text-gray-500">Previous</div>
                    <div className="font-semibold">{prev.title}</div>
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/blog/${next.category}/${next.slug}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 md:text-right"
                  >
                    <div className="text-xs text-gray-500">Next</div>
                    <div className="font-semibold">{next.title}</div>
                  </Link>
                )}
              </nav>
            )}

            {/* Share + Back */}
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

          {/* TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[70vh] overflow-y-auto border-l pl-4">
              <TOC />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
