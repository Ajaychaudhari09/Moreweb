// src/components/Footer.tsx
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitter
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
            <a
              href="https://x.com/morefusion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://linkedin.com/company/morefusion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://instagram.com/morefusion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://facebook.com/morefusion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://youtube.com/@morefusion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-slate-400 hover:text-white" />
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
