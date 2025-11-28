"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";

import type { BlogPost } from "@/types";

export function PublicBlogList({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleFilterChange = useCallback(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  useState(() => {
    handleFilterChange();
  });

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Latest Articles
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Explore our collection of articles on technology, programming, and
          digital innovation
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div
              className="flex items-center gap-2 input p-0"
            >
              <Search className="w-4 h-4 text-muted ml-3" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-3 bg-transparent border-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted text-lg">
            No articles found matching your criteria.
          </p>
          <p className="text-muted text-sm mt-2">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article key={post.id} className="card transition hover-lift h-full relative group">
              <h2 className="text-xl font-bold mb-3 hover:text-primary transition">
                <Link href={`/blog/${post.category}/${post.slug}`} className="after:absolute after:inset-0 focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {post.title}
                </Link>
              </h2>

              <p className="text-muted mb-4 text-sm line-clamp-3">
                {post.excerpt ||
                  truncateContent(post.content.replace(/[#*`]/g, ""), 120)}
              </p>

              <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted mt-auto pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary font-medium mt-3 text-sm">
                Read Article <ArrowRight className="w-3 h-3" />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="card text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{posts.length}</div>
            <div className="text-sm text-muted">Published Articles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {categories.length}
            </div>
            <div className="text-sm text-muted">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {posts.length}
            </div>
            <div className="text-sm text-muted">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.round(
                posts.reduce((acc, post) => {
                  const words = post.content.split(/\s+/).length;
                  return acc + Math.ceil(words / 200);
                }, 0) / Math.max(posts.length, 1)
              )}
            </div>
            <div className="text-sm text-muted">Avg Read Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
