import { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Free Online Productivity Tools for Every Need | MoreFusion",
  description: "Explore a comprehensive suite of free online productivity tools, including calculators, resume builders, content generators, and more. Simplify your workflow and boost your efficiency with MoreFusion's tools.",
};

const allTools = [
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index to assess your health and wellness with detailed categorization.",
    icon: "⚖️",
    href: "/bmi-calculator",
  },
  {
    id: "calorie-calculator",
    name: "Calorie Calculator",
    description: "Calculate daily calorie needs based on your lifestyle, age, and fitness goals.",
    icon: "🔥",
    href: "/calorie-calculator",
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    description: "Plan your loans by calculating Equated Monthly Installments with detailed breakdown.",
    icon: "🏦",
    href: "/emi-calculator",
  },
  {
    id: "resume-maker",
    name: "Resume Maker",
    description: "Build and download professional, ATS-friendly resumes with multiple templates.",
    icon: "📄",
    href: "/resume-maker",
  },
  {
    id: "text-editor",
    name: "Text Editor",
    description: "A simple, powerful online editor to write and export documents as PDF.",
    icon: "✍️",
    href: "/text-editor",
  },
  {
    id: "date-time-calculator",
    name: "Date & Time Calculator",
    description: "Calculate duration between dates or find dates by adding/subtracting days.",
    icon: "📅",
    href: "/date-time-calculator",
  },
  {
    id: "diet-generator",
    name: "Diet Generator",
    description: "Generate personalized meal plans based on your dietary preferences and goals.",
    icon: "🥗",
    href: "/diet-generator",
  },
  {
    id: "exercise-generator",
    name: "Exercise Generator",
    description: "Create custom workout routines based on your fitness level and available time.",
    icon: "💪",
    href: "/exercise-generator",
  },
];

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allTools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": tool.name,
      "description": tool.description,
      "url": `https://morefusion.in${tool.href}`
    }))
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block p-3 bg-linear-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Productivity Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover our comprehensive suite of free, powerful tools designed to streamline your workflow,
            enhance productivity, and simplify complex calculations.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for tools..."
              className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400 bg-white dark:bg-gray-800 shadow-lg focus:shadow-xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {allTools.map((tool, index) => (
            <div
              key={tool.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Our Tools?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Built with precision, designed for excellence, and trusted by thousands of users worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Instant calculations and results with no loading delays</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-300">All calculations happen locally - your data never leaves your device</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300">Fully responsive design works perfectly on all devices</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up">
          <div className="bg-linear-to-r from-pink-500 via-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a Tool Idea?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Can&apos;t find the tool you need? We&apos;re constantly expanding our collection based on user feedback and suggestions.
            </p>
            <a
              href="mailto:tools@morefusion.in?subject=Tool Suggestion"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>Suggest a Tool</span>
              <span className="text-xl">🚀</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
