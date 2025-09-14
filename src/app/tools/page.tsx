import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Productivity Tools",
  description: "Discover our suite of free productivity tools designed to simplify your workflow and boost efficiency.",
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
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Productivity Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A suite of free tools designed to simplify your workflow and boost your productivity
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* CTA Section */}
        <div className="text-center mt-16 animate-slide-up">
          <h2 className="text-2xl font-bold mb-4">Need a Specific Tool?</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for? We&apos;re always adding new tools based on user feedback.
          </p>
          <a 
            href="mailto:tools@morefusion.com" 
            className="text-primary hover:underline font-medium"
          >
            Suggest a Tool →
          </a>
        </div>
      </div>
    </div>
  );
}
