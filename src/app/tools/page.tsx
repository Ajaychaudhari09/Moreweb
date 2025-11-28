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
  // Health
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate BMI with detailed health insights.", icon: "⚖️", href: "/bmi-calculator", category: "Health" },
  { id: "calorie-calculator", name: "Calorie Calculator", description: "Daily calorie needs based on your activity and goal.", icon: "🔥", href: "/calorie-calculator", category: "Health" },
  { id: "diet-generator", name: "Diet Generator", description: "Personalized meal plans for nutrition goals.", icon: "🥗", href: "/diet-generator", category: "Health" },
  { id: "exercise-generator", name: "Exercise Generator", description: "Create tailored workout routines.", icon: "💪", href: "/exercise-generator", category: "Health" },

  // Finance
  { id: "emi-calculator", name: "EMI Calculator", description: "Easy loan EMI breakdown with amortization.", icon: "🏦", href: "/emi-calculator", category: "Finance" },

  // Career
  { id: "resume-maker", name: "Resume Maker", description: "Create ATS-friendly professional resumes in minutes.", icon: "📄", href: "/resume-maker", category: "Career" },

  // Productivity
  { id: "text-editor", name: "Text Editor", description: "Smart writing editor with export options.", icon: "✍️", href: "/text-editor", category: "Productivity" },

  // PDF Tools (Separated)
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one document.", icon: "📑", href: "/pdf-tools/merge", category: "PDF Tools" },
  { id: "split-pdf", name: "Split PDF", description: "Extract specific pages from a PDF.", icon: "✂️", href: "/pdf-tools/split", category: "PDF Tools" },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size without losing quality.", icon: "🗜️", href: "/pdf-tools/compress", category: "PDF Tools" },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert images to PDF format instantly.", icon: "🖼️", href: "/pdf-tools/jpg-to-pdf", category: "PDF Tools" },
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
    <main className="min-h-screen py-20 bg-background transition-colors duration-300">

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
            <span className="text-gradient">Smart Productivity Tools</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Access free, professional-grade tools for health, finance, career, and PDF management.
            No sign-up required.
          </p>
        </div>

        {/* Client Component List Rendering */}
        <ToolsPageClient allTools={allTools} />
      </div>
    </main>
  );
}
