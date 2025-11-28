import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free PDF Tools - Merge, Split, Compress & Convert PDF",
    description:
        "A complete suite of free PDF tools. Merge, split, compress, and convert PDFs entirely in your browser. No sign-up required.",
};

export default function PDFToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {children}
        </div>
    );
}
