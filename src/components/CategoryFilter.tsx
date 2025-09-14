'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface CategoryFilterProps {
  categories: string[];
  currentCategory: string;
}

function CategoryFilterContent({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryStyles: Record<string, string> = {
    All: 'from-gray-500 to-gray-600',
    General: 'from-green-500 to-blue-500',
    AI: 'from-purple-500 to-pink-500',
    Coding: 'from-yellow-500 to-red-500',
    Film: 'from-pink-500 to-purple-500',
    Drama: 'from-red-500 to-pink-500',
    Shopping: 'from-blue-500 to-green-500'
  };

  const handleCategoryChange = (category: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    const query = params.toString();
    router.push(`/blog${query ? `?${query}` : ''}`);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Filter by Category
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category: string) => {
          const isActive = currentCategory === category;
          const gradientClass = categoryStyles[category] || categoryStyles.All;
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg animate-glow`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:bg-gradient-to-r hover:text-white'
              } ${!isActive ? `hover:${gradientClass}` : ''}`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CategoryFilter(props: CategoryFilterProps) {
  return (
    <Suspense fallback={
      <div className="mb-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-48 mx-auto"></div>
          <div className="flex justify-center gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CategoryFilterContent {...props} />
    </Suspense>
  );
}
