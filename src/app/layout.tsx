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
    default: "MoreFusion — AI Tools & Productivity Tools",
    template: "%s | MoreFusion",
  },
  description:
    "Free AI tools, calculators, resume builder, and practical tech guides to boost your workflow. MoreFusion helps you automate tasks, learn modern tech, and create polished resumes quickly.",
  keywords: [
    "productivity tools",
    "BMI calculator",
    "resume maker",
    "tech blog",
    "AI",
    "coding",
  ],
  authors: [{ name: "MoreFusion Team" }],
  creator: "MoreFusion",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://morefusion.in",
    title: "MoreFusion - Productivity Tools & Tech Blog",
    description: "Free productivity tools and tech insights to boost your workflow",
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
    title: "MoreFusion - Productivity Tools & Tech Blog",
    description: "Free productivity tools and tech insights to boost your workflow",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
