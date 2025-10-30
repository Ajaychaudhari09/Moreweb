import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ToolCard from "@/components/ToolCard";
import BlogCard from "@/components/BlogCard";
import { ArrowRight, Zap, Target, Clock, LineChart } from "lucide-react"; // ✅ Removed unused Share2, BookOpen
import { getRecentPosts } from "@/lib/blog";
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
  title: "MoreFusion – Free Productivity Tools, AI Tech Blogs & Digital Workflow Hub",
  description:
    "Boost productivity with free online tools and expert AI tech blogs. Explore calculators, resume builders, tutorials, and automation guides – all at MoreFusion.",
  keywords:
    "productivity tools, AI blogs, resume builder, EMI calculator, BMI calculator, workflow automation, tech guides, MoreFusion",
  alternates: { canonical: "https://morefusion.in/" },
};

export default async function HomePage() {
  const recentPosts: BlogPost[] = await getRecentPosts(3);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      {/* === HERO SECTION === */}
      <header>
        <section aria-labelledby="main-heading" className="py-20 px-4 border-b border-gray-100">
          <div className="mx-auto max-w-5xl text-center">
            <h1 id="main-heading" className="mb-6 text-6xl font-extrabold md:text-7xl gradient-text">
              MoreFusion – Smart Tools & AI Knowledge Hub
            </h1>
            <p className="mb-7 text-2xl md:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Explore free productivity tools, learn from expert tech blogs, and enhance your digital workflow with actionable insights.
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

      {/* === FEATURE SECTION === */}
      <section id="features" className="py-16 px-4">
        <div className="mx-auto container">
          <div className="mb-14 text-center">
            <h2 className="mb-3 gradient-text text-4xl font-bold">Why Choose MoreFusion?</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-700 dark:text-gray-400">
              Save time, learn faster, and make smarter decisions with precision tools and educational AI content.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <Card className="vibrant-card p-6 text-center border-2 border-blue-200 bg-blue-50/90 shadow-md">
              <Zap className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-2 text-xl font-bold">Fast, Reliable Calculators</h3>
              <p className="text-gray-700">
                Access instant results with accurate EMI, BMI, and finance calculators – no sign-up required.
              </p>
            </Card>
            <Card className="vibrant-card p-6 text-center border-2 border-green-200 bg-green-50/90 shadow-md">
              <Target className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2 text-xl font-bold">Actionable Tech Blogs</h3>
              <p className="text-gray-700">
                Learn about AI tools, coding strategies, digital marketing, and modern tech stacks with simplified blogs.
              </p>
            </Card>
            <Card className="vibrant-card p-6 text-center border-2 border-purple-200 bg-purple-50/90 shadow-md">
              <Clock className="mx-auto mb-4 h-12 w-12 text-purple-500" />
              <h3 className="mb-2 text-xl font-bold">Boost Productivity</h3>
              <p className="text-gray-700">
                Streamline workflows with guides, templates, and automation tips for students, professionals, and creators.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* === FEATURED TOOLS === */}
      <section aria-labelledby="featured-tools" className="bg-gray-50 py-16 px-4 dark:bg-gray-900">
        <div className="mx-auto container">
          <div className="mb-12 text-center">
            <h2 id="featured-tools" className="mb-4 gradient-text text-3xl font-bold md:text-4xl">
              Top Free Tools on MoreFusion
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Trusted by creators, students, and professionals for daily productivity and automation.
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

      {/* === BLOG PREVIEW === */}
      <section aria-labelledby="latest-insights" className="py-16 px-4">
        <div className="mx-auto container">
          <div className="mb-12 text-center">
            <h2 id="latest-insights" className="mb-4 gradient-text text-3xl font-bold md:text-4xl">
              Latest from Our Blog
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Read expert insights on productivity, AI trends, and coding best practices.
            </p>
          </div>
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            {recentPosts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No posts yet. Check back soon for guides, tutorials, and news.
              </p>
            ) : (
              recentPosts.map((post, idx) => (
                <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <BlogCard post={post} />
                </div>
              ))
            )}
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

      {/* === CTA SECTION === */}
      <section className="py-20 bg-white border-t border-gray-200 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <LineChart className="mx-auto text-blue-600 h-14 w-14" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Power Your Day with Tools That Work Smarter, Not Harder
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            From financial planning to productivity tracking, MoreFusion helps you save time, stay focused, and achieve more.
          </p>
          <Button asChild className="btn-vibrant rounded-md px-8">
            <Link href="/tools">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
