import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ToolCard from '@/components/ToolCard';
import BlogCard from '@/components/BlogCard';
import { ArrowRight, Zap, Target, Clock } from 'lucide-react';
import { getRecentPosts } from '@/lib/blog';
import type { BlogPost } from '@/types';

const featuredTools = [
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index to assess health and wellness',
    icon: '⚖️',
    href: '/bmi-calculator',
  },
  {
    id: 'resume-maker',
    name: 'Resume Maker',
    description: 'Build and download professional, ATS-friendly resumes',
    icon: '📄',
    href: '/resume-maker',
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Plan your loans by calculating Equated Monthly Installments',
    icon: '🏦',
    href: '/emi-calculator',
  },
];

export default function HomePage() {
  // Static fetch at build time
  const recentPosts: BlogPost[] = getRecentPosts(3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 animate-fade-in text-5xl font-bold md:text-7xl gradient-text">
            MoreFusion
          </h1>
          <p className="mb-8 animate-slide-up text-xl text-gray-600 dark:text-gray-400 md:text-2xl">
            Productivity Tools & Tech Insights to Boost Your Workflow
          </p>
          <div className="animate-bounce-in flex flex-col gap-4 justify-center sm:flex-row">
            <Button asChild className="btn-vibrant h-11 rounded-md px-8">
              <Link href="/tools">
                Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-md px-8">
              <Link href="/blog">Read Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="mx-auto container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 gradient-text text-3xl font-bold md:text-4xl">
              Why Choose MoreFusion?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Everything you need to boost productivity and stay informed about the latest in tech
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="animate-slide-up vibrant-card p-6 text-center">
              <Zap className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant, optimized tools—no delays or setup hassles
              </p>
            </Card>
            <Card style={{ animationDelay: '0.1s' }} className="animate-slide-up vibrant-card p-6 text-center">
              <Target className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2 text-xl font-semibold">Precise Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accurate insights and calculations for critical decisions
              </p>
            </Card>
            <Card style={{ animationDelay: '0.2s' }} className="animate-slide-up vibrant-card p-6 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-purple-500" />
              <h3 className="mb-2 text-xl font-semibold">Save Time</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Streamline workflows with tools built for efficiency
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="bg-gray-50 py-16 px-4 dark:bg-gray-900">
        <div className="mx-auto container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 gradient-text text-3xl font-bold md:text-4xl">Featured Tools</h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Explore our most popular productivity tools
            </p>
          </div>
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {featuredTools.map((tool, idx) => (
              <div key={tool.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/tools">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 px-4">
        <div className="mx-auto container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 gradient-text text-3xl font-bold md:text-4xl">Latest Insights</h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Stay updated with the latest in tech and productivity
            </p>
          </div>
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            {recentPosts.map((post, idx) => (
              <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                Read All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
