import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://morefusion.in"),
  title: {
    default: "MoreFusion - Productivity Tools & Tech Blog",
    template: "%s | MoreFusion",
  },
  description:
    "Free productivity tools and insightful tech blogs covering AI, coding, entertainment, and more. Boost your workflow with our suite of tools.",
  keywords: ["productivity tools", "BMI calculator", "resume maker", "tech blog", "AI", "coding"],
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 animate-fadeUp">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}