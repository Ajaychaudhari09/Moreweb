// src/app/ClientLayout.tsx
"use client";


import { Analytics } from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* Main content area - prevents layout jump */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}
