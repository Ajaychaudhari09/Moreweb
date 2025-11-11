import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ToolCard from "@/components/ToolCard";
import BlogCard from "@/components/BlogCard";
import { ArrowRight, Zap, Target, Clock, LineChart } from "lucide-react";
import { getLatestPosts } from "@/lib/posts";
import type { BlogPost } from "@/types";

const featuredTools = [
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index instantly and get health insights.",
    icon: "⚖️",
    href: "/bmi-calculator",
  },
  {
    id: "resume-maker",
    name: "Resume Maker",
    description: "Create ATS-friendly professional resumes in minutes with smart templates.",
    icon: "📄",
    href: "/resume-maker",
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    description: "Plan your finances easily by calculating Equated Monthly Installments.",
    icon: "🏦",
    href: "/emi-calculator",
  },
];

export const metadata = {
  title: "MoreFusion – AI Tools, Calculators, Resume Maker & Tech Blogs",
  description:
    "Use free AI tools, calculators, resume builders, productivity utilities, and read expert tech blogs. Upgrade your workflow with MoreFusion.",
  keywords:
    "AI tools, productivity tools, tech blog, resume builder, EMI calculator, BMI calculator, workflow automation, AI utilities, MoreFusion",
  alternates: { canonical: "https://morefusion.in/" },
  openGraph: {
    title: "MoreFusion – Free AI Tools & Tech Blog",
    description:
      "Explore calculators, AI utilities, resume builders, and tech insights to enhance your productivity.",
    url: "https://morefusion.in/",
    type: "website",
    siteName: "MoreFusion",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoreFusion – AI Tools & Blogs",
    description:
      "Explore free AI tools, calculators, and expert tech guides to level up your digital workflow.",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default async function HomePage() {
  const recentPosts: BlogPost[] = await getLatestPosts(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MoreFusion",
    url: "https://morefusion.in/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://morefusion.in/search?q={query}",
      "query-input": "required name=query",
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header>
        <section aria-labelledby="main-heading" className="py-20 px-4 border-b border-gray-100">
          <div className="mx-auto max-w-6xl text-center">
            <h1 id="main-heading" className="mb-6 text-5xl md:text-7xl font-extrabold gradient-text">
              AI Tools, Calculators & Tech Insights – All in One Place
            </h1>

            <p className="mb-7 text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              MoreFusion helps you automate work, calculate instantly, create resumes, understand AI trends, and learn modern tech — all through free tools and easy-to-read guides.
            </p>

            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Whether you&apos;re a student, developer, business owner, or creator, our platform offers smart utilities designed to boost productivity, simplify workflow management, and save valuable time.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
              <Button asChild className="btn-vibrant h-11 rounded-md px-8">
                <Link href="/tools">
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-md px-8">
                <Link href="/blog">Read Blogs</Link>
              </Button>
            </div>
          </div>
        </section>
      </header>

      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-3 gradient-text text-4xl font-bold">Why Millions Choose MoreFusion</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-400">
              Our tools are lightning-fast, accurate, and built to make your digital tasks easier and smarter.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <Card className="p-6 text-center border shadow-md bg-white dark:bg-gray-950">
              <Zap className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-3 text-xl font-bold">Instant Calculations</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Reliable tools for EMI, BMI, finance, conversions, estimates & more.
              </p>
            </Card>

            <Card className="p-6 text-center border shadow-md bg-white dark:bg-gray-950">
              <Target className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-3 text-xl font-bold">Expert Tech Articles</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Understand AI, automation, coding, and marketing through easy guides.
              </p>
            </Card>

            <Card className="p-6 text-center border shadow-md bg-white dark:bg-gray-950">
              <Clock className="mx-auto mb-4 h-12 w-12 text-purple-500" />
              <h3 className="mb-3 text-xl font-bold">Save Time Daily</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Use automated tools & templates to get more done in less time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-tools" className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 id="featured-tools" className="mb-6 gradient-text text-3xl font-bold text-center">
            Popular Tools on MoreFusion
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            These tools are used by thousands every day for productivity and quick calculations.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredTools.map((tool, i) => (
              <div key={tool.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/tools">View All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="latest-insights" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 id="latest-insights" className="mb-6 gradient-text text-3xl font-bold text-center">
            Latest Tech & Productivity Insights
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            Read simplified explanations of AI tools, workflow hacks, and coding tips.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            {recentPosts.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No blogs available yet. Check back soon for guides, tutorials, and the latest tech updates.
              </p>
            ) : (
              recentPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <BlogCard post={post} />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/blog">
                Read All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="py-20 bg-white border-t border-gray-200 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <LineChart className="mx-auto text-blue-600 h-14 w-14" />

          <h2 className="text-3xl md:text-4xl font-bold">
            Power Your Day with Tools That Work Smarter, Not Harder
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From finance calculators to productivity enhancers and expert AI insights — 
            MoreFusion is built to simplify your daily tasks and accelerate your success.
          </p>

          <Button asChild className="btn-vibrant rounded-md px-8">
            <Link href="/tools">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
