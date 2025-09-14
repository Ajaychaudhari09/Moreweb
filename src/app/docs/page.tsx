import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Book, Rocket, Wrench, Code2, Users, HelpCircle } from "lucide-react";

// Type for Lucide icon components
type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface DocSectionLink {
  name: string;
  href: string;
}

interface DocSection {
  icon: Icon;
  title: string;
  description: string;
  links: DocSectionLink[];
}

const documentationSections: DocSection[] = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    links: [
      { name: "Quick Start Guide", href: "#quick-start" },
      { name: "Installation", href: "#installation" },
      { name: "First Steps", href: "#first-steps" },
    ],
  },
  {
    icon: Wrench,
    title: "Tools & Features",
    description: "Comprehensive guide to all our productivity tools",
    links: [
      { name: "Resume Maker", href: "/resume-maker" },
      { name: "Text Editor", href: "/text-editor" },
      { name: "Calculators", href: "/tools" },
    ],
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Technical documentation for developers",
    links: [
      { name: "REST API", href: "#api" },
      { name: "Authentication", href: "#auth" },
      { name: "Rate Limits", href: "#limits" },
    ],
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other users and get support",
    links: [
      { name: "Community Guidelines", href: "#community" },
      { name: "Contribution Guide", href: "#contribute" },
      { name: "Support Forum", href: "#support" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/20 p-4">
                <Book className="h-12 w-12" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Documentation</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-100 md:text-2xl">
              Everything needed to use MoreFusion tools and features effectively
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Quick Navigation */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {documentationSections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-lg bg-blue-100 p-3 text-blue-600">
                  <section.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <p className="mb-6 text-gray-600">{section.description}</p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {link.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-16">
          {/* Quick Start */}
          <section id="quick-start" className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">🚀 Quick Start Guide</h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-lg text-gray-700">
                Get started with MoreFusion in just a few steps:
              </p>
              <ol className="list-inside list-decimal space-y-4 text-gray-700">
                <li>
                  <strong>Browse our tools:</strong> Visit the{" "}
                  <Link href="/tools" className="text-blue-600 hover:underline">
                    Tools section
                  </Link>{" "}
                  to see all available productivity tools
                </li>
                <li>
                  <strong>Start using:</strong> Most tools work immediately without registration
                </li>
                <li>
                  <strong>Save your work:</strong> Create an account to save projects and access
                  premium features
                </li>
                <li>
                  <strong>Get support:</strong> Check documentation or contact for help
                </li>
              </ol>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">📦 Installation & Setup</h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-lg text-gray-700">
                MoreFusion is web-based—no installation required:
              </p>
              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-xl font-semibold">Browser Requirements:</h3>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Chrome 80+ (recommended)</li>
                  <li>Firefox 75+</li>
                  <li>Safari 13+</li>
                  <li>Edge 80+</li>
                </ul>
              </div>
              <p className="text-gray-700">
                Use the latest browser version for the best experience.
              </p>
            </div>
          </section>

          {/* API */}
          <section id="api" className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">🔌 API Reference</h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-lg text-gray-700">
                The public API is in development; here’s what to expect:
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-blue-900">Coming Soon:</h3>
                  <ul className="list-inside list-disc space-y-2 text-blue-800">
                    <li>REST API endpoints</li>
                    <li>Webhook integrations</li>
                    <li>SDK libraries</li>
                    <li>Rate limiting details</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-green-900">Current Features:</h3>
                  <ul className="list-inside list-disc space-y-2 text-green-800">
                    <li>Web-based tools</li>
                    <li>File export/import</li>
                    <li>Local storage</li>
                    <li>Responsive design</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section id="support" className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">❓ Getting Help</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">FAQ</h3>
                <p className="mb-4 text-gray-600">Common questions and answers</p>
                <Link href="#faq" className="font-medium text-blue-600 hover:underline">
                  View FAQ →
                </Link>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Community</h3>
                <p className="mb-4 text-gray-600">Connect with other users</p>
                <Link href="/contact" className="font-medium text-blue-600 hover:underline">
                  Join Community →
                </Link>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Code2 className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Support</h3>
                <p className="mb-4 text-gray-600">Direct technical support</p>
                <Link href="/contact" className="font-medium text-blue-600 hover:underline">
                  Contact Support →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
