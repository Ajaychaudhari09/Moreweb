// src/components/Footer.tsx
import Link from "next/link";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
} from "@phosphor-icons/react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand & Description */}
        <div>
          <Link href="/" className="text-lg font-bold tracking-tight">
            MoreFusion
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Free productivity tools and tech content to simplify your workflow,
            boost efficiency, and support smarter decisions.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubLogoIcon  className="text-gray-500 hover:text-gray-900 dark:hover:text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon  className="text-gray-500 hover:text-blue-600" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramLogoIcon size={22} className="text-gray-500 hover:text-pink-600" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookLogoIcon size={22} className="text-gray-500 hover:text-blue-700" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Main links">
          <h3 className="text-sm font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          </ul>
        </nav>

        {/* Popular Tools */}
        <nav aria-label="Popular tools">
          <h3 className="text-sm font-semibold mb-3">Popular Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bmi-calculator" className="hover:text-foreground">BMI Calculator</Link></li>
            <li><Link href="/resume-maker" className="hover:text-foreground">Resume Maker</Link></li>
            <li><Link href="/emi-calculator" className="hover:text-foreground">EMI Calculator</Link></li>
          </ul>
        </nav>

        {/* Support */}
        <nav aria-label="Support">
          <h3 className="text-sm font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:newsletter@morefusion.in"
                className="hover:text-foreground"
              >
                Contact
              </a>
            </li>
            <li>
              <Link
                href="/blog?category=general"
                className="hover:text-foreground"
              >
                Help & FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground">
          <p>© 2025 MoreFusion. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
