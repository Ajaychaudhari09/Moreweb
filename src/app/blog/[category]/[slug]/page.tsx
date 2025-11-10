import { getPostBySlugSafe, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import SocialShareButtons from '@/components/SocialShareButtons';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { category: string, slug: string } }): Promise<Metadata> {
  const post = getPostBySlugSafe(params.category, params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | MoreFusion`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://morefusion.in/blog/${post.category}/${post.slug}`,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { category: string, slug: string } }) {
  const post = getPostBySlugSafe(params.category, params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image || `https://morefusion.in/api/og?title=${encodeURIComponent(post.title)}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      'name': 'MoreFusion',
      logo: {
        '@type': 'ImageObject',
        'url': 'https://morefusion.in/android-chrome-192x192.png',
      },
    },
    description: post.excerpt,
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href={`/blog?category=${post.category}`} className="text-blue-600 dark:text-blue-400 uppercase tracking-wider text-sm font-medium">
              {post.category}
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 my-3">
              {post.title}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none text-lg">
            <MDXRemote source={post.content} />
          </div>

          <footer className="mt-12">
            <SocialShareButtons title={post.title} />
            <div className="text-center mt-8">
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Blog
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}