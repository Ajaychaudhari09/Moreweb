// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://morefusion.in"),
  title: {
    default: "MoreFusion — Free AI Tools, Calculators & Tech Blog for Productivity",
    template: "%s | MoreFusion",
  },
  description:
    "Discover free AI tools, calculators, and in-depth tech guides to boost your workflow. Automate tasks, build resumes, and make smarter decisions with MoreFusion.",
  keywords: [
    "productivity tools",
    "BMI calculator",
    "resume maker",
    "tech blog",
    "AI tools",
    "coding guides",
    "automation",
    "calculators",
  ],
  authors: [{ name: "MoreFusion Team" }],
  creator: "MoreFusion",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://morefusion.in",
    title: "MoreFusion — Free AI Tools, Calculators & Tech Blog",
    description: "Free productivity tools and tech insights to boost your workflow. Automate tasks and learn modern tech.",
    siteName: "MoreFusion",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "MoreFusion Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoreFusion — Free AI Tools, Calculators & Tech Blog",
    description: "Free productivity tools and tech insights to boost your workflow. Automate tasks and learn modern tech.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MoreFusion",
    url: "https://morefusion.in",
    logo: "https://morefusion.in/android-chrome-512x512.png",
    sameAs: [
      "https://twitter.com/morefusion",
      "https://www.facebook.com/morefusion",
      "https://www.instagram.com/morefusion",
      "https://www.linkedin.com/company/morefusion",
      "https://www.youtube.com/@morefusion"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "newsletter@morefusion.in",
      contactType: "customer support"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Defer Next's main stylesheet to avoid render-blocking: set media to print then restore onload */}
        <Script
          id="defer-main-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const links = Array.from(document.querySelectorAll('link[rel="stylesheet"][data-precedence]'));
                links.forEach((l) => {
                  // If not already deferred
                  if (!l.dataset.__deferred) {
                    l.dataset.__deferred = '1';
                    l.media = 'print';
                    l.onload = function() { l.media = 'all'; };
                  }
                });
              } catch (e) { /* ignore */ }
            })();`,
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
