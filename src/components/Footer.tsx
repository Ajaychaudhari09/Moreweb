import Link from 'next/link';
import { Github, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand + tagline */}
        <div className="md:col-span-1">
          <Link href="/" className="text-lg font-bold tracking-tight">
            MoreFusion
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Free productivity tools and insightful tech content to boost your workflow and streamline your digital life.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://github.com/yourusername/morefusion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="mailto:newsletter@morefusion.in"
              className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Contact Email"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </div>

        {/* Tools */}
        <nav aria-label="Tools">
          <h3 className="text-sm font-semibold mb-3">Popular Tools</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/bmi-calculator" className="text-foreground/80 hover:text-foreground transition-colors">
                BMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/resume-maker" className="text-foreground/80 hover:text-foreground transition-colors">
                Resume Maker
              </Link>
            </li>
            <li>
              <Link href="/emi-calculator" className="text-foreground/80 hover:text-foreground transition-colors">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/calorie-calculator" className="text-foreground/80 hover:text-foreground transition-colors">
                Calorie Calculator
              </Link>
            </li>
            <li>
              <Link href="/diet-generator" className="text-foreground/80 hover:text-foreground transition-colors">
                Diet Generator
              </Link>
            </li>
            <li>
              <Link href="/exercise-generator" className="text-foreground/80 hover:text-foreground transition-colors">
                Exercise Generator
              </Link>
            </li>
          </ul>
        </nav>

        {/* Blog Categories */}
        <nav aria-label="Blog">
          <h3 className="text-sm font-semibold mb-3">Blog Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/blog" className="text-foreground/80 hover:text-foreground transition-colors">
                All Posts
              </Link>
            </li>
            <li>
              <Link
                href="/blog?category=AI"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                AI &amp; Technology
              </Link>
            </li>
            <li>
              <Link
                href="/blog?category=coding"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Development &amp; Coding
              </Link>
            </li>
            <li>
              <Link
                href="/blog?category=general"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                General &amp; Productivity
              </Link>
            </li>
            <li>
              <Link
                href="/blog?category=shopping"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Shopping &amp; Lifestyle
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company & Legal */}
        <nav aria-label="Company">
          <h3 className="text-sm font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                About MoreFusion
              </Link>
            </li>
            <li>
              <a 
                href="mailto:newsletter@morefusion.in"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Contact Support
              </a>
            </li>
            <li>
              <Link href="/blog?category=general" className="text-foreground/80 hover:text-foreground transition-colors">
                Help &amp; FAQ
              </Link>
            </li>
          </ul>
          
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Stay Updated
            </h4>
            <a
              href="mailto:newsletter@morefusion.in?subject=Newsletter Subscription"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Subscribe to Newsletter
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <p>© 2025 MoreFusion. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Built with Next.js & TypeScript</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <Link 
              href="/blog" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/tools" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <Link 
              href="/" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}