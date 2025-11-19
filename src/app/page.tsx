// src/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Target, Clock, LineChart } from "lucide-react";
import { Mail, BadgeDollarSign } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { getLatestPosts } from "@/lib/posts";
import type { BlogPost } from "@/types";

// Lazy-load cards to keep initial bundle small
const ToolCard = dynamic(() => import("@/components/ToolCard"), {
  loading: () => (
    <div className="h-40 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

const BlogCard = dynamic(() => import("@/components/BlogCard"), {
  loading: () => (
    <div className="h-40 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

const featuredTools = [
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Quickly calculate your Body Mass Index and get health insights.",
    icon: "⚖️",
    href: "/bmi-calculator",
  },
  {
    id: "resume-maker",
    name: "Resume Maker",
    description: "Build ATS-friendly resumes in minutes with smart templates.",
    icon: "📄",
    href: "/resume-maker",
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    description: "Plan your loans easily by calculating Equated Monthly Instalments.",
    icon: "🏦",
    href: "/emi-calculator",
  },
];

export const metadata: Metadata = {
  title: "MoreFusion — AI Tools, Calculators & Tech Blog",
  description:
    "Use free AI tools, smart calculators, and a powerful resume builder. Read practical tech blogs about AI, coding, productivity and workflows. MoreFusion helps students, developers and creators work faster and smarter.",
  keywords: [
    "AI tools",
    "productivity tools",
    "tech blog",
    "resume builder",
    "EMI calculator",
    "BMI calculator",
    "workflow automation",
    "MoreFusion",
  ],
  alternates: { canonical: "https://morefusion.in/" },
  openGraph: {
    title: "MoreFusion — Free AI Tools, Calculators & Tech Guides",
    description:
      "A modern toolkit of AI utilities, calculators, and in-depth tech content to improve your daily workflow.",
    url: "https://morefusion.in/",
    type: "website",
    siteName: "MoreFusion",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "MoreFusion Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoreFusion — AI Tools & Tech Blog",
    description:
      "Discover free AI tools, calculators, and practical tech guides to level up your work.",
    images: ["/android-chrome-512x512.png"],
  },
};

export default async function HomePage() {
  const recentPosts: BlogPost[] = await getLatestPosts(3);

  // Structured data: WebSite
  const websiteLd = {
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

  // Structured data: Organization
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MoreFusion",
    url: "https://morefusion.in",
    logo: "https://morefusion.in/android-chrome-512x512.png",
  };

  // Structured data: FAQ for landing page
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is MoreFusion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MoreFusion is a platform that offers free AI tools, calculators, a resume builder, and practical tech blogs to help you improve productivity and understand modern technology.",
        },
      },
      {
        "@type": "Question",
        name: "Who is MoreFusion for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MoreFusion is built for students, developers, creators, and professionals who want simple tools and clear explanations to make better decisions and save time.",
        },
      },
      {
        "@type": "Question",
        name: "Are the tools on MoreFusion free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all the tools currently available on MoreFusion are free to use. Some future premium features may be added, but core utilities will remain free.",
        },
      },
    ],
  };

  return (
    <main
      id="main"
      className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 dark:from-slate-950 dark:to-slate-900"
    >
      {/* JSON-LD schemas (non-blocking) */}
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <Script
        id="org-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* HERO */}
      <header
        aria-labelledby="home-main-heading"
        className="border-b border-gray-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/70 backdrop-blur"
      >
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:py-20">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Tools · Automation · Clarity
            </p>
            <h1
              id="home-main-heading"
              className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white gradient-text"
            >
              AI tools and calculators that actually help you get work done.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-700 md:text-lg dark:text-slate-300">
              Use simple tools to calculate, plan, and automate your daily tasks. Then go deeper
              with clear tech guides covering AI, coding, and productivity.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="btn-vibrant h-11 px-7">
                <Link href="/tools">
                  Explore free tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-7">
                <Link href="/blog">Read tech explainers</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              No sign-up required · Free utilities · Built for real daily tasks
            </p>
          </div>

          {/* Right side: quick value cards */}
          <div className="flex-1 space-y-4">
            <Card className="border-none bg-slate-900 text-white shadow-xl dark:bg-slate-900">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fast, focused tools</p>
                  <p className="text-xs text-slate-300">
                    Built to do one job well—no bloated dashboards or distractions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-none bg-white/90 shadow-md backdrop-blur dark:bg-slate-900/80">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">For students, devs & creators</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Make better decisions with calculators, guides and AI tool reviews.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-none bg-white/90 shadow-md backdrop-blur dark:bg-slate-900/80">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Save time every day</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Use calculators and templates to reduce manual work and guesswork.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </header>

      {/* SOCIAL PROOF / WHO IT'S FOR */}
      <section className="border-b border-gray-100 bg-white/70 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
          <p className="font-medium">
            Built for{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              students, developers, solo founders, creators
            </span>{" "}
            who want practical tools — not just theory.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              ⚙️ Planning & calculations
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              🤖 AI tools & explainers
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              💼 Resume & career
            </span>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS */}
      <section id="benefits" className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold gradient-text md:text-4xl">
            Why people use MoreFusion every week
          </h2>
          <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300 md:text-base">
            Clear tools + clear explanations. No noise, no paywall surprises.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Actionable, not theoretical</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Every tool and article is written so you can apply it today — from EMI planning
                to resume tweaks and AI workflows.
              </p>
            </Card>

            <Card className="border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Fast, mobile-friendly tools</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Designed for phones and laptops. Lightweight pages keep Core Web Vitals in
                good shape.
              </p>
            </Card>

            <Card className="border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Content you can trust</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Honest breakdowns of tools, practical checklists, and no fake “hype list”
                articles.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section
        aria-labelledby="featured-tools"
        className="bg-gray-50 py-16 px-4 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2
                id="featured-tools"
                className="text-3xl font-bold gradient-text md:text-4xl"
              >
                Popular tools on MoreFusion
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
                Start with these frequently used tools — they solve real problems in minutes.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/tools">Browse all tools</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featuredTools.map((tool, i) => (
              <div
                key={tool.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG POSTS + SPONSORED / NEWSLETTER */}
      <section
        aria-labelledby="latest-insights"
        className="py-16 px-4 bg-white/90 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2
                id="latest-insights"
                className="text-3xl font-bold gradient-text md:text-4xl"
              >
                Latest tech & productivity insights
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
                Short, focused articles about AI tools, coding, buying decisions and real
                workflow upgrades.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/blog">
                View all posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Blog cards */}
            <div>
              {recentPosts.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No blog posts yet. New guides are coming soon.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recentPosts.map((post, i) => (
                    <div
                      key={post.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: newsletter + sponsored */}
            <aside className="space-y-8">
              <div className="rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg shadow-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">
                    Stay ahead without doomscrolling
                  </h3>
                </div>
                <p className="mt-3 text-sm text-indigo-100">
                  Get short, practical updates when we publish new tools and explainers. No spam,
                  no daily noise.
                </p>
                <div className="mt-4">
                  <div className="[&_input]:border-white/30 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-indigo-100/80 [&_button]:bg-white [&_button]:text-indigo-600 [&_button]:hover:bg-indigo-50">
                    <NewsletterForm />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-slate-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sponsored
                  </h4>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Ads help keep MoreFusion free for everyone.
                </p>
                {/* Ad placeholder can go here if needed */}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        aria-labelledby="home-faq-heading"
        className="border-t border-gray-200 bg-white py-16 px-4 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="home-faq-heading"
            className="text-center text-3xl font-bold gradient-text md:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
            A quick overview before you dive into the tools and articles.
          </p>

          <div className="mt-8 space-y-4">
            <details className="group rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
                What can I do with MoreFusion?
                <span className="ml-4 text-xl leading-none text-slate-500 group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                You can calculate BMI and EMI, build resumes, plan your day, and understand new AI
                tools with clear explainers. Our goal is to give you “ready-to-use” utilities and
                mental models, not just news.
              </p>
            </details>

            <details className="group rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
                Is any login or payment required?
                <span className="ml-4 text-xl leading-none text-slate-500 group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                No. You can use tools and read articles without creating an account. If we add
                premium features in the future, they will be clearly marked as optional.
              </p>
            </details>

            <details className="group rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
                How often is new content added?
                <span className="ml-4 text-xl leading-none text-slate-500 group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                New posts and tools are added based on what users actually need — AI tools worth
                using, buying guides, and practical “how to get this done” content.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-gray-200 bg-white py-16 px-4 text-center dark:border-slate-800 dark:bg-slate-950">
        <LineChart className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
        <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
          Ready to make your day a little easier?
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm text-slate-700 dark:text-slate-300 md:text-base">
          Start with a calculator, test a tool, or read a single article. MoreFusion is designed to
          fit into your existing workflow — not replace it.
        </p>
        <Button asChild className="btn-vibrant mt-6 px-8">
          <Link href="/tools">Start using tools for free</Link>
        </Button>
      </section>
    </main>
  );
}
