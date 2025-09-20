import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';
import type { BlogPost } from '@/types';

export const metadata: Metadata = {
  title: 'Blog | MoreFusion',
  description: 'Discover insights on AI, coding, film, drama, shopping and more',
  keywords: ['blog','articles','AI','coding','technology','entertainment'],
};

const CATS = ['All','general','AI','coding','film','drama','shopping'] as const;

function toValue(input?: string): typeof CATS[number] {
  if (!input) return 'All';
  return CATS.find(v => v.toLowerCase() === input.toLowerCase()) ?? 'All';
}

function toLabel(v: typeof CATS[number]): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const sv = toValue(category);

  const allPosts: BlogPost[] = await getAllPosts();
  const filtered = sv === 'All'
    ? allPosts
    : allPosts.filter(p => p.category === sv);

  const categories = CATS.map(c => toLabel(c));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="py-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
          Our Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Explore articles on tech, productivity & more.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <CategoryFilter
          categories={categories}
          currentCategory={toLabel(sv)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filtered.map((post, idx) => (
            <div
              key={post.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-600">
            No posts in {toLabel(sv)} category.
          </p>
        )}
      </div>
    </div>
  );
}
