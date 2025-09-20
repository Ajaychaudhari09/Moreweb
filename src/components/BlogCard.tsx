import Link from "next/link";
import type { BlogCardProps } from "@/types";

const categoryColors: Record<string, string> = {
  AI: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  coding: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  drama: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200",
  film: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
  general: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  shopping: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
};

const emojiMap: Record<string, string> = {
  AI: "🤖",
  coding: "💻",
  drama: "🎭",
  film: "🎬",
  general: "📝",
  shopping: "🛒",
};

export default function BlogCard({ post }: BlogCardProps) {
  const badge = categoryColors[post.category] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  const emoji = emojiMap[post.category] ?? "📝";

  // Initials avatar from author name
  const initials = (post.author || "M F")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <article className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Accent hover ring */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 ring-2 ring-transparent ring-offset-2 ring-offset-white transition group-hover:opacity-100 group-hover:ring-indigo-400 dark:ring-offset-slate-900" />

      {/* Meta */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${badge}`}>
          {emoji} {post.category}
        </span>
        <time className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()}</time>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
        <Link href={`/blog/${post.category}/${post.slug}`}>{post.title}</Link>
      </h3>

      {/* Excerpt */}
      <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
        {post.excerpt}
      </p>

      {/* Author row */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500">By</div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{post.author}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500">{post.readTime} min read</div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Link
          href={`/blog/${post.category}/${post.slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={`Read ${post.title}`}
        >
          Read More
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
