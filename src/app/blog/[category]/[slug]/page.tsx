import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

type CategoryType = "AI" | "coding" | "drama" | "film" | "general" | "shopping";

interface Params {
  params: { category: CategoryType; slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({
    category: p.category as CategoryType,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.category, params.slug);
  if (!post) {
    return { title: "Post Not Found | MoreFusion", description: "" };
  }
  return { title: `${post.title} | MoreFusion`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getPostBySlug(params.category, params.slug);
  if (!post) {
    notFound();
  }

  // Construct file path
  const filePath = path.join(
    process.cwd(),
    "src/content/blog",
    params.category,
    `${params.slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    notFound();
  }

  // Read & parse MDX file
  const source = fs.readFileSync(filePath, "utf8");
  const { content } = matter(source);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>{post.author}</span>
            <span>•</span>
            <time>{new Date(post.date).toLocaleDateString()}</time>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
          {post.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        <section className="prose prose-lg max-w-none">
          <MDXRemote source={content} />
        </section>
      </article>
    </div>
  );
}
