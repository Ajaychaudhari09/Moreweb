'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  const baseLink =
    'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500';
  const active = 'bg-blue-500 text-white';
  const inactive = 'text-foreground/80 hover:bg-blue-50 dark:hover:bg-blue-900/30';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-x-0 focus:top-2 focus:z-50 mx-auto w-max rounded bg-indigo-600 px-3 py-2 text-white"
      >
        Skip to content
      </a>

      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-bold tracking-tight">
            MoreFusion
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`${baseLink} ${isActive ? active : inactive}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-indigo-50 dark:hover:bg-indigo-900/30 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        className={`md:hidden ${open ? 'block' : 'hidden'}`}
      >
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`block ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-foreground/90 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                    } rounded-lg px-4 py-2 text-sm font-medium`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
