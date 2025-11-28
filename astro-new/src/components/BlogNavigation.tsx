"use client";



interface BlogNavigationProps {
  className?: string;
}

export function BlogNavigation({ className = "" }: BlogNavigationProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
      >
        ← Back to Blog
      </button>

      <a
        href="/blog"
        className="text-white dark:text-gray-900 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
      >
        View All Posts
      </a>
    </div>
  );
}
