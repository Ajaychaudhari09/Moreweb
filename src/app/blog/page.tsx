import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog | MoreFusion",
  description:
    "Explore articles on AI, coding, film, drama, general topics, and shopping.",
};

const CATS = ["All", "AI", "coding", "drama", "film", "general", "shopping"] as const;

function normalizeCategory(input?: string): (typeof CATS)[number] {
  if (!input) return "All";
  const match = CATS.find(
    (v) => v.toLowerCase() === input.toLowerCase()
  );
  return match ?? "All";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const selected = normalizeCategory(raw);

  const posts: BlogPost[] = await getAllPosts();
  const filtered =
    selected === "All"
      ? posts
      : posts.filter((p) => p.category.toLowerCase() === selected.toLowerCase());

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold gradient-text">
          Our Blog
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Insightful articles on AI, coding, entertainment, lifestyle and more.
        </p>
      </section>

      {/* Category Filter */}
      <section className="max-w-5xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {CATS.map((cat) => {
            const active = cat === selected;
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500">No posts found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
