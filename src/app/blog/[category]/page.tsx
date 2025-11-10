
import { getPostsByCategory, getSortedPostsData } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories.map(category => ({
    category,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category);

  if (!posts.length) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{params.category}</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
