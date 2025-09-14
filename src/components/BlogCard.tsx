import Link from 'next/link';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

const categoryStyles: Record<string, string> = {
  General: 'category-general',
  AI: 'category-ai',
  Coding: 'category-coding',
  Film: 'category-film',
  Drama: 'category-drama',
  Shopping: 'category-shopping'
};

export default function BlogCard({ post }: BlogCardProps) {
  const categoryClass = categoryStyles[post.category] || categoryStyles.General;
  
  return (
    <article className="vibrant-card rounded-xl p-6 h-full flex flex-col animate-fade-in group">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${categoryClass} animate-glow`}>
          {post.category}
        </span>
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </time>
      </div>
      
      <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
          {post.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </div>
          </div>
          
          <div className="btn-vibrant text-sm px-4 py-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
            Read More
          </div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium animate-shimmer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 text-xs rounded-md font-medium">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}

// Named export for backward compatibility
export { BlogCard };
