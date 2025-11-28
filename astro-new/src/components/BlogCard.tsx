// src/components/BlogCard.tsx
import type { BlogCardProps } from "@/types";

const categoryColors: Record<string, string> = {
  AI: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300",
  coding: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300",
  drama: "text-pink-600 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-300",
  film: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
  general: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300",
  shopping: "text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300",
};

const tagClassMap: Record<string, string> = {
  AI: "tag--indigo",
  coding: "tag--blue",
  drama: "tag--pink",
  film: "tag--purple",
  general: "tag--emerald",
  shopping: "tag--pink",
};

interface ExtendedBlogCardProps extends BlogCardProps {
  layout?: "grid" | "list";
}

export default function BlogCard({ post, layout = "grid" }: ExtendedBlogCardProps) {
  const href = `/blog/${post.category}/${post.slug}`;
  const isList = layout === "list";

  return (
    <article className={`card group flex ${isList ? "flex-row gap-6" : "flex-col"} overflow-hidden relative h-full`}>
      {/* Thumbnail (CLS-safe) */}
      {post.image ? (
        <div className={`relative block overflow-hidden card-thumb ${isList ? "w-1/3 aspect-video" : "aspect-video"}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : null}

      {/* Content Block */}
      <div className={`flex flex-col flex-1 p-5 ${isList ? "justify-center" : ""}`}>

        {/* Category Tag & Date */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className={`tag ${tagClassMap[post.category] ?? ''}`}>
            {post.category}
          </span>
          <time className="text-gray-500">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>

        {/* Blog Title */}
        <h3 className="card-title brand-link transition-colors line-clamp-2 mb-2 text-lg md:text-xl">
          <a href={href} className="after:absolute after:inset-0 focus:outline-none" aria-label={`Read ${post.title}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </a>
        </h3>

        {/* Blog Excerpt */}
        <p className="card-desc text-sm leading-relaxed line-clamp-3 grow">
          {post.excerpt}
        </p>

        {/* Author + Read Time */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">

          {/* Avatar alternative - initials circle */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-800 font-medium">
              {post.author.split(" ").map((n) => n[0]).join("")}
            </div>
            <span>{post.author}</span>
          </div>

          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
      </div>
    </article>
  );
}
