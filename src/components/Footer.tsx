import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand + tagline */}
        <div>
          <Link href="/" className="text-lg font-bold tracking-tight">
            MoreFusion
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Free productivity tools and insightful tech content to boost your workflow.
          </p>
        </div>

        {/* Tools */}
        <nav aria-label="Tools">
          <h3 className="text-sm font-semibold">Tools</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/bmi-calculator" className="text-foreground/80 hover:text-foreground">
                BMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/resume-maker" className="text-foreground/80 hover:text-foreground">
                Resume Maker
              </Link>
            </li>
            <li>
              <Link href="/emi-calculator" className="text-foreground/80 hover:text-foreground">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/calorie-calculator" className="text-foreground/80 hover:text-foreground">
                Calorie Calculator
              </Link>
            </li>
          </ul>
        </nav>

        {/* Blog */}
        <nav aria-label="Blog">
          <h3 className="text-sm font-semibold">Blog</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/blog" className="text-foreground/80 hover:text-foreground">
                All Posts
              </Link>
            </li>
            <li>
              <Link
                href={{ pathname: '/blog', query: { category: 'ai' } }}
                className="text-foreground/80 hover:text-foreground"
              >
                AI &amp; Technology
              </Link>
            </li>
            <li>
              <Link
                href={{ pathname: '/blog', query: { category: 'coding' } }}
                className="text-foreground/80 hover:text-foreground"
              >
                Coding
              </Link>
            </li>
            <li>
              <Link
                href={{ pathname: '/blog', query: { category: 'general' } }}
                className="text-foreground/80 hover:text-foreground"
              >
                General
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company">
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-foreground/80 hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-foreground/80 hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-foreground/80 hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-foreground/80 hover:text-foreground">
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <p className="text-xs text-muted-foreground">© 2025 MoreFusion. All rights reserved.</p>
          <Link href="/" className="text-xs text-foreground/80 hover:text-foreground">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
