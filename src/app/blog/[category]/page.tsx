// src/app/blog/[category]/page.tsx
import Script from "next/script";
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
  // ✅ unwrap Promise-based params
  const { category } = await params;

  const posts = getPostsByCategory(category);
  if (!posts.length) {
    notFound();
  }

  const categoryLabel =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryLabel} Articles | MoreFusion`,
    description: `Explore blog posts under the ${categoryLabel} category on MoreFusion.`,
    mainEntityOfPage: `https://morefusion.in/blog/${category}`,
    url: `https://morefusion.in/blog/${category}`,
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* SEO JSON-LD Schema */}
      <Script
        id="category-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold capitalize tracking-tight">
            {categoryLabel}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg max-w-2xl">
            Explore curated articles related to {categoryLabel} from the MoreFusion blog.
          </p>
        </header>

        <section
          aria-label={`${categoryLabel} articles`}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </section>
      </section>
    </main>
  );
}
