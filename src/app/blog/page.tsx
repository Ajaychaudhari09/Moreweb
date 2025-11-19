// src/app/blog/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import AdsterraAd from "@/components/AdsterraAd";
import NewsletterForm from "@/components/NewsletterForm";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog | MoreFusion",
  description:
    "Expert insights on AI, coding, productivity, film, drama, lifestyle, and technology. High-quality content for students, professionals, and creators.",
  alternates: { canonical: "https://morefusion.in/blog" },
};

const CATS = ["All", "AI", "coding", "drama", "film", "general", "shopping"] as const;

type CategoryFilter = (typeof CATS)[number];
type ViewMode = "all" | "featured" | "trending";

function normalizeCategory(input?: string): CategoryFilter {
  if (!input) return "All";
  const match = CATS.find((v) => v.toLowerCase() === input.toLowerCase());
  return match ?? "All";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
    view?: string | string[];
    page?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const rawCategory = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const rawQuery = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const rawView = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const selectedCategory = normalizeCategory(rawCategory);
  const searchQuery = rawQuery?.toString().trim() ?? "";
  const viewMode: ViewMode =
    rawView === "featured" || rawView === "trending" ? rawView : "all";

  const PAGE_SIZE = 6;
  const parsedPage = rawPage ? parseInt(rawPage as string, 10) : 1;
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const allPosts: BlogPost[] = getAllPosts();

  // Filter by Category
  let filtered: BlogPost[] =
    selectedCategory === "All"
      ? [...allPosts]
      : allPosts.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Filter by Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        ((p as any).tags ?? []).some((t: string) =>
          t.toLowerCase().includes(q)
        )
    );
  }

  // Apply View Modes
  if (viewMode === "featured") {
    filtered = filtered.filter((p) => (p as any).featured === true);
  }
  if (viewMode === "trending") {
    filtered = [...filtered].sort(
      (a, b) => ((b as any).views ?? 0) - ((a as any).views ?? 0)
    );
  }

  const featuredPost = filtered.length > 0 ? filtered[0] : null;
  const restPosts = featuredPost ? filtered.slice(1) : filtered;

  const totalPages = Math.ceil(restPosts.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagePosts = restPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const baseParams = new URLSearchParams();
  if (selectedCategory !== "All") baseParams.set("category", selectedCategory);
  if (searchQuery) baseParams.set("q", searchQuery);
  if (viewMode !== "all") baseParams.set("view", viewMode);

  const makePageHref = (page: number) => {
    const params = new URLSearchParams(baseParams);
    if (page > 1) params.set("page", page.toString());
    else params.delete("page");
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-linear-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            MoreFusion Blog
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-3">
            Insights that actually matter
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            Practical guides, tool breakdowns, and expert analysis for creators,
            developers, entrepreneurs, and curious learners.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Category Selection */}
          <div className="flex flex-wrap gap-2">
            {CATS.map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${cat}`}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form method="GET" className="w-full sm:w-auto">
            <input
              type="text"
              name="q"
              placeholder="Search articles..."
              defaultValue={searchQuery}
              className="w-full sm:w-56 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-sm"
            />
          </form>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-5xl mx-auto px-6 mt-12">
          <Link
            href={`/blog/${featuredPost.category}/${featuredPost.slug}`}
            className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md transition hover:shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {featuredPost.image && (
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            )}

            <div className="p-6">
              <span className="text-xs font-medium uppercase bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-full">
                Featured
              </span>

              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {featuredPost.title}
              </h2>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span>{featuredPost.author}</span>
                <span>
                  {new Date(featuredPost.date).toLocaleDateString()} •{" "}
                  {(featuredPost as any).readTime ?? "5"} min read
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Blog List Grid */}
      <section className="max-w-5xl mx-auto px-6 mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pagePosts.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No posts match your filters.
          </p>
        ) : (
          pagePosts.map((post) => <BlogCard key={post.id} post={post} />)
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-5xl mx-auto px-6 mt-12 mb-16 flex justify-center gap-4 text-sm">
          <Link
            href={safePage > 1 ? makePageHref(safePage - 1) : "#"}
            className={`px-4 py-2 rounded-lg border ${
              safePage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Previous
          </Link>
          <span className="self-center">
            Page {safePage} of {totalPages}
          </span>
          <Link
            href={safePage < totalPages ? makePageHref(safePage + 1) : "#"}
            className={`px-4 py-2 rounded-lg border ${
              safePage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Next
          </Link>
        </div>
      )}

      {/* Sidebar */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div />

        <aside className="space-y-6">
          <div className="p-6 rounded-xl border bg-white dark:bg-gray-900">
            <h3 className="font-bold text-gray-900 dark:text-white">Stay updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Get email updates on AI, tools, and tech insights.
            </p>
            <NewsletterForm />
          </div>

          <div className="p-6 rounded-xl border bg-white dark:bg-gray-900">
            <h3 className="font-bold text-gray-900 dark:text-white">Sponsored</h3>
            <div id="blog-sidebar-ad">
              <AdsterraAd rootSelector="#blog-sidebar-ad" />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
