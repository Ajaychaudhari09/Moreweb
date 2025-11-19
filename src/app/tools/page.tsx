import type { Metadata } from "next";
import Script from "next/script";
import ToolsPageClient from "@/components/ToolsPageClient";

export const metadata: Metadata = {
  title: "Free Productivity Tools | Calculators, AI Tools, Resume Builder",
  description:
    "Explore free online calculators, AI tools, resume builder, and productivity utilities. Built for speed, accuracy, and mobile responsiveness.",
  alternates: { canonical: "https://morefusion.in/tools" },
  openGraph: {
    title: "Productivity Tools | MoreFusion",
    description:
      "Smart tools for productivity, finance, fitness, and tech automation.",
    url: "https://morefusion.in/tools",
    type: "website",
    siteName: "MoreFusion",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Productivity Tools | MoreFusion",
    description:
      "Smart, mobile-friendly tools for calculations, AI, career, fitness, and automation.",
  },
};

const allTools = [
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate BMI with detailed health insights.", icon: "⚖️", href: "/bmi-calculator", category: "Health" },
  { id: "calorie-calculator", name: "Calorie Calculator", description: "Daily calorie needs based on your activity and goal.", icon: "🔥", href: "/calorie-calculator", category: "Health" },
  { id: "emi-calculator", name: "EMI Calculator", description: "Easy loan EMI breakdown with amortization.", icon: "🏦", href: "/emi-calculator", category: "Finance" },
  { id: "resume-maker", name: "Resume Maker", description: "Create ATS-friendly professional resumes in minutes.", icon: "📄", href: "/resume-maker", category: "Career" },
  { id: "text-editor", name: "Text Editor", description: "Smart writing editor with export options.", icon: "✍️", href: "/text-editor", category: "Productivity" },
  { id: "diet-generator", name: "Diet Generator", description: "Personalized meal plans for nutrition goals.", icon: "🥗", href: "/diet-generator", category: "Health" },
  { id: "exercise-generator", name: "Exercise Generator", description: "Create tailored workout routines.", icon: "💪", href: "/exercise-generator", category: "Health" },
];

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://morefusion.in${tool.href}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://morefusion.in" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://morefusion.in/tools" },
    ],
  };

  return (
    <main className="min-h-screen py-12 bg-linear-to-b from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* JSON-LD Structured Data */}
      <Script
        id="tools-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumbs-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Smart Productivity Tools
        </h1>
        <p className="text-center text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          Access free tools for health, finance, career, and productivity. 
          Optimized for speed, accuracy, and mobile use.
        </p>

        {/* Client Component List Rendering */}
        <ToolsPageClient allTools={allTools} />
      </div>
    </main>
  );
}
