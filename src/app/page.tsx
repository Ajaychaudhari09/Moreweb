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
import SocialShareButtons from "@/components/SocialShareButtons";
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
    "Free AI tools, calculators, and tech guides. Automate tasks and build resumes with MoreFusion.",
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
      className="min-h-screen bg-background"
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
      <section className="border-b border-border relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 lg:py-24 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 mx-auto lg:mx-0">
              Tools · Automation · Clarity
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              <span className="text-gradient">AI tools and calculators</span> that actually help you get work done.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground mx-auto lg:mx-0 leading-relaxed">
              Use simple tools to calculate, plan, and automate your daily tasks. Then go deeper
              with clear tech guides covering AI, coding, and productivity.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-center lg:justify-start pt-4">
              <Button asChild className="btn-3d h-12 px-8 text-lg border-none w-full sm:w-auto shadow-lg shadow-primary/20">
                <Link href="/tools" className="text-white flex items-center">
                  Explore free tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 text-lg border-border hover:bg-accent hover:text-accent-foreground w-full sm:w-auto">
                <Link href="/blog">Read tech explainers</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No sign-up required · Free utilities · Built for real daily tasks
            </p>
          </div>

          {/* Right side: quick value cards */}
          <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none space-y-6 perspective-1000 mt-8 lg:mt-0">
            <div className="card-3d p-6 bg-primary text-primary-foreground border-none transform rotate-y-12 hover:rotate-0 transition-transform duration-500 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Fast, focused tools</p>
                  <p className="text-sm text-blue-100">
                    Built to do one job well—no bloated dashboards or distractions.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d p-6 transform -rotate-y-6 hover:rotate-0 transition-transform duration-500 bg-card border border-border shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Target className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">For students, devs & creators</p>
                  <p className="text-sm text-muted-foreground">
                    Make better decisions with calculators, guides and AI tool reviews.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d p-6 transform rotate-y-6 hover:rotate-0 transition-transform duration-500 bg-card border border-border shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Save time every day</p>
                  <p className="text-sm text-muted-foreground">
                    Use calculators and templates to reduce manual work and guesswork.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / WHO IT'S FOR */}
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-base text-center md:text-left">
            Built for{" "}
            <span className="font-bold text-foreground">
              students, developers, solo founders, creators
            </span>{" "}
            who want practical tools — not just theory.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              ⚙️ Planning & calculations
            </span>
            <span className="rounded-full bg-pink-50 px-4 py-2 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border border-pink-100 dark:border-pink-900">
              🤖 AI tools & explainers
            </span>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
              💼 Resume & career
            </span>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS */}
      <section id="benefits" className="py-24 px-4 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">
              Why people use MoreFusion every week
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Clear tools + clear explanations. No noise, no paywall surprises.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card-3d p-8">
              <h3 className="text-xl font-bold mb-3 text-foreground">Actionable, not theoretical</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every tool and article is written so you can apply it today — from EMI planning
                to resume tweaks and AI workflows. We focus on real-world utility over abstract concepts.
              </p>
            </div>

            <div className="card-3d p-8">
              <h3 className="text-xl font-bold mb-3 text-foreground">Fast, mobile-friendly tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Designed for phones and laptops. Lightweight pages keep Core Web Vitals in
                good shape, ensuring you get answers quickly even on slow connections.
              </p>
            </div>

            <div className="card-3d p-8">
              <h3 className="text-xl font-bold mb-3 text-foreground">Content you can trust</h3>
              <p className="text-muted-foreground leading-relaxed">
                Honest breakdowns of tools, practical checklists, and no fake “hype list”
                articles. We verify everything we publish to ensure accuracy and relevance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: ABOUT / MISSION SECTION (SEO Content - Expanded) */}
      <section className="py-24 px-4 bg-accent/10 border-y border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-8 text-foreground">
            What is MoreFusion?
          </h2>
          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed text-justify md:text-center">
            <p>
              In a world overflowing with complex software and endless subscriptions, <strong>MoreFusion</strong> stands for simplicity. We believe that the tools you use every day should be fast, free, and accessible to everyone—whether you're a student calculating your grades, a developer formatting JSON, or a founder building a resume. We strip away the clutter to focus on what matters: solving your problem efficiently.
            </p>
            <p>
              Our mission is to bridge the gap between <em>utility</em> and <em>knowledge</em>. We don't just give you a black box; we explain how things work. From understanding how your BMI is calculated to learning the logic behind an EMI schedule, we empower you with information. This educational approach ensures that you not only get the result you need but also understand the context behind it, leading to better decision-making in your personal and professional life.
            </p>
            <div className="bg-card p-8 rounded-2xl border border-border text-left mt-8">
              <h3 className="text-xl font-bold mb-4 text-foreground text-center">Who is this for?</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">✓</span>
                  <span><strong>Students</strong> needing quick calculators and study aids.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">✓</span>
                  <span><strong>Developers</strong> looking for formatters, converters, and tech guides.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs font-bold">✓</span>
                  <span><strong>Creators</strong> building assets and optimizing workflows.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">✓</span>
                  <span><strong>Solo Founders</strong> managing finances and documents.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center pt-8">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Find this useful? Share it with your network:
              </p>
              <SocialShareButtons
                title="MoreFusion — Free AI Tools & Calculators"
                url="https://morefusion.in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section
        aria-labelledby="featured-tools"
        className="bg-background py-24 px-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2
                id="featured-tools"
                className="text-3xl font-bold text-white md:text-4xl"
              >
                Popular tools on MoreFusion
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Start with these frequently used tools — they solve real problems in minutes.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2 border-border hover:bg-accent hover:text-accent-foreground">
              <Link href="/tools">Browse all tools</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
        className="py-24 px-4 bg-accent/10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2
                id="latest-insights"
                className="text-3xl font-bold gradient-text md:text-4xl"
              >
                Latest tech & productivity insights
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Short, focused articles about AI tools, coding, buying decisions and real
                workflow upgrades.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2 border-border hover:bg-accent hover:text-accent-foreground">
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
                <p className="text-sm text-muted-foreground">
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
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg shadow-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">
                    Stay ahead without doomscrolling
                  </h3>
                </div>
                <p className="mt-3 text-sm text-blue-100">
                  Get short, practical updates when we publish new tools and explainers. No spam,
                  no daily noise.
                </p>
                <div className="mt-4">
                  <div className="[&_input]:border-white/30 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-blue-100/80 [&_button]:bg-white [&_button]:text-blue-600 [&_button]:hover:bg-blue-50">
                    <NewsletterForm />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sponsored
                  </h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
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
        className="border-t border-border bg-background py-24 px-4"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="home-faq-heading"
            className="text-center text-3xl font-bold gradient-text md:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            A quick overview before you dive into the tools and articles.
          </p>

          <div className="mt-8 space-y-4">
            <details className="group rounded-lg border border-border bg-card p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                What can I do with MoreFusion?
                <span className="ml-4 text-xl leading-none text-muted-foreground group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                You can calculate BMI and EMI, build resumes, plan your day, and understand new AI
                tools with clear explainers. Our goal is to give you “ready-to-use” utilities and
                mental models, not just news.
              </p>
            </details>

            <details className="group rounded-lg border border-border bg-card p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                Is any login or payment required?
                <span className="ml-4 text-xl leading-none text-muted-foreground group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No. You can use tools and read articles without creating an account. If we add
                premium features in the future, they will be clearly marked as optional.
              </p>
            </details>

            <details className="group rounded-lg border border-border bg-card p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                How often is new content added?
                <span className="ml-4 text-xl leading-none text-muted-foreground group-open:rotate-90 transition-transform">
                  ›
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                New posts and tools are added based on what users actually need — AI tools worth
                using, buying guides, and practical “how to get this done” content.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border bg-background py-24 px-4 text-center">
        <LineChart className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-2xl font-bold text-foreground md:text-3xl">
          Ready to make your day a little easier?
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground md:text-base">
          Start with a calculator, test a tool, or read a single article. MoreFusion is designed to
          fit into your existing workflow — not replace it.
        </p>
        <Button asChild className="btn-3d mt-6 px-8 border-none">
          <Link href="/tools">Start using tools for free</Link>
        </Button>
      </section>
    </main>
  );
}
