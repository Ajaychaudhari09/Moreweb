// src/components/BlogCard.tsx
import type { BlogCardProps } from "@/types";



const tagClassMap: Record<string, string> = {
  AI: "tag--indigo",
  coding: "tag--blue",
  drama: "tag--pink",
  film: "tag--purple",
  general: "tag--emerald",
  shopping: "tag--pink",
  health: "tag--emerald",
  news: "tag--blue",
};

interface ExtendedBlogCardProps extends BlogCardProps {
  layout?: "grid" | "list";
  priority?: boolean;
}

export default function BlogCard({ post, layout = "grid", priority = false }: ExtendedBlogCardProps) {
  const href = `/blog/${post.category}/${post.slug}`;
  const isList = layout === "list";

  // Helper to get image source
  const imageSrc = typeof post.image === 'string' ? post.image : post.image?.src;
  const isUnsplash = typeof post.image === 'string' && post.image.includes('images.unsplash.com');

  return (
    <article className={`card group flex ${isList ? "flex-row gap-6" : "flex-col"} overflow-hidden relative h-full`}>
      {/* Thumbnail (CLS-safe) */}
      {imageSrc ? (
        <div className={`relative block overflow-hidden card-thumb ${isList ? "w-1/3 aspect-video" : "aspect-video"}`}>
          <img
            src={isUnsplash ? `${imageSrc}?w=600&h=338&q=80&auto=format&fit=crop` : imageSrc}
            srcSet={isUnsplash
              ? `${imageSrc}?w=400&h=225&q=80&auto=format&fit=crop 400w, ${imageSrc}?w=600&h=338&q=80&auto=format&fit=crop 600w, ${imageSrc}?w=800&h=450&q=80&auto=format&fit=crop 800w`
              : undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={post.title}
            width="600"
            height="338"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
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
