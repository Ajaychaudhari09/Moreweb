// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-border">
      <nav className="container-max flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="site-logo text-lg md:text-2xl gradient-text">
            MoreFusion
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition ${active ? "bg-primary text-white" : "hover:bg-background/60"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* CTA */}
          <Button asChild className="ml-2">
            <Link href="/tools">Get started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Toggle navigation menu">
                {open ? <Cross2Icon /> : <HamburgerMenuIcon />}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <SheetTitle className="text-lg font-bold gradient-text">
                  MoreFusion
                </SheetTitle>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close menu">
                  <Cross2Icon />
                </Button>
              </div>

              <ul className="flex flex-col space-y-3 mt-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md p-3 font-medium ${pathname === item.href || pathname?.startsWith(item.href + "/")
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:text-text-primary"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <Button asChild className="w-full mt-4">
                    <Link href="/tools">Get started</Link>
                  </Button>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
