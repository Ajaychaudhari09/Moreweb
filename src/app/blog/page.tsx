import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | MoreFusion",
  description: "Discover insights on AI, coding, film, drama, shopping and more",
  keywords: ["blog", "articles", "AI", "coding", "technology", "entertainment"],
};

const CATS = ["All", "general", "AI", "coding", "film", "drama", "shopping"] as const;

function toValue(input?: string): (typeof CATS)[number] {
  if (!input) return "All";
  const match = CATS.find((v) => v.toLowerCase() === input.toLowerCase());
  return match ?? "All";
}

function toLabel(v: (typeof CATS)[number]): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const catPill: Record<string, string> = {
  All: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  general: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  AI: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  coding: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  film: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
  drama: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200",
  shopping: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
};

export const dynamic = "force-static";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const sv = toValue(raw as string);

  const allPosts: BlogPost[] = await getAllPosts();
  const filtered =
    sv === "All"
      ? allPosts
      : allPosts.filter((p) => p.category.toLowerCase() === sv.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 blur-3xl [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)] bg-[conic-gradient(at_30%_20%,#60a5fa_0deg,#a78bfa_120deg,#34d399_240deg,#60a5fa_360deg)]" />
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
          <h1 className="gradient-text text-5xl font-extrabold tracking-tight md:text-6xl">
            Our Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Explore articles on tech, productivity, and more with hand‑picked insights and tutorials.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/tools" className="underline-offset-4 hover:underline">Explore Tools</Link>
            <span>•</span>
            <Link href="/about" className="underline-offset-4 hover:underline">About</Link>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="mx-auto mb-10 max-w-5xl px-6">
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {CATS.map((c) => {
            const active = c === sv;
            return (
              <Link
                key={c}
                href={c === "All" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  "ring-1 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-700",
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : catPill[c],
                ].join(" ")}
              >
                {toLabel(c)}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-300">
            No posts in {toLabel(sv)} category.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, idx) => (
              <div key={post.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
