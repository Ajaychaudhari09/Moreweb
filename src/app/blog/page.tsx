import { getAllPosts } from '@/lib/blog';
import BlogCard from '@/components/BlogCard'; // Default import
import CategoryFilter from '@/components/CategoryFilter'; // Default import
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MoreFusion',
  description: 'Discover insights on AI, coding, film, drama, shopping and more',
  keywords: ['blog', 'articles', 'AI', 'coding', 'technology', 'entertainment'],
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const posts = getAllPosts();
  
  const categories = ['All', 'General', 'AI', 'Coding', 'Film', 'Drama', 'Shopping'];
  
  const filteredPosts = category && category !== 'All' 
    ? posts.filter(post => post.category === category)
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-float"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-bounce-in">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in max-w-2xl mx-auto leading-relaxed">
            Explore our collection of articles covering technology, entertainment, lifestyle, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Category Filter */}
        <CategoryFilter categories={categories} currentCategory={category || 'All'} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="vibrant-card rounded-xl p-6 text-center animate-slide-up">
            <div className="text-3xl font-bold gradient-text mb-2">{posts.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Articles</div>
          </div>
          <div className="vibrant-card rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold gradient-text mb-2">{categories.length - 1}</div>
            <div className="text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="vibrant-card rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold gradient-text mb-2">{filteredPosts.length}</div>
            <div className="text-gray-600 dark:text-gray-400">
              {category && category !== 'All' ? `${category} Posts` : 'All Posts'}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.slug}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="animate-bounce-in">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No posts found in {category} category
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Try selecting a different category or check back later for new content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
