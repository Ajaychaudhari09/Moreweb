import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import { getPostsByCategory, getAllPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((p) => p.category))];

  return categories.map((category) => ({ category }));
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <CategoryPageInner params={params} />;
}

async function CategoryPageInner({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const posts = getPostsByCategory(category);
  if (!posts.length) notFound();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold capitalize mb-10">
        {category}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
