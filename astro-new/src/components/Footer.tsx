// src/components/Footer.tsx
import {
  Mail
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand & Description */}
        <div>
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            MoreFusion
          </a>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Free productivity tools and tech content to simplify your workflow,
            boost efficiency, and support smarter decisions.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            {/* <a
              href="https://github.com/morefusion"
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-5 h-5 text-slate-400 hover:text-white"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a> */}
            <a
              href="mailto:newsletter@morefusion.in"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
          </div>
        </div>

        {/* Product */}
        <nav aria-label="Product">
          <h3 className="text-sm font-semibold mb-3 text-white">Product</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><a href="/tools" className="hover:text-white">All Tools</a></li>
            <li><a href="/docs" className="hover:text-white">Documentation</a></li>
            <li><a href="/resume-maker" className="hover:text-white">Resume Maker</a></li>
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company">
          <h3 className="text-sm font-semibold mb-3 text-white">Company</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Support */}
        <nav aria-label="Support">
          <h3 className="text-sm font-semibold mb-3 text-white">Support</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><a href="/faq" className="hover:text-white">Help & FAQ</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-slate-400">
          <p>© 2025 MoreFusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
