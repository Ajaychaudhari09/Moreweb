"use client";

import PDFToolLayout from "./PDFToolLayout";
import { Scissors } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SplitPDF() {
    const [pageRange, setPageRange] = useState("");

    const handleSplit = async (files: File[]) => {
        if (!pageRange) {
            alert("Please enter page numbers to extract (e.g., 1, 3-5)");
            return;
        }

        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();
        const totalPages = pdf.getPageCount();

        // Parse range "1, 3-5" -> [0, 2, 3, 4] (0-indexed)
        const pagesToKeep = new Set<number>();
        const parts = pageRange.split(",");

        for (const part of parts) {
            const range = part.trim().split("-");
            if (range.length === 1) {
                const p = parseInt(range[0]) - 1;
                if (p >= 0 && p < totalPages) pagesToKeep.add(p);
            } else if (range.length === 2) {
                const start = parseInt(range[0]) - 1;
                const end = parseInt(range[1]) - 1;
                for (let i = start; i <= end; i++) {
                    if (i >= 0 && i < totalPages) pagesToKeep.add(i);
                }
            }
        }

        if (pagesToKeep.size === 0) {
            alert("No valid pages selected.");
            return;
        }

        const copiedPages = await newPdf.copyPages(pdf, Array.from(pagesToKeep).sort((a, b) => a - b));
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `split-${file.name}`;
        link.click();
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="relative">
                <PDFToolLayout
                    title="Split PDF"
                    description="Extract specific pages from your PDF document."
                    icon={<Scissors className="h-10 w-10" />}
                    onProcess={handleSplit}
                    maxFiles={1}
                    actionLabel="Extract Pages"
                />

                {/* Overlay input for page range */}
                <div className="max-w-md mx-auto -mt-32 mb-32 relative z-10 px-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                        <Label htmlFor="range" className="text-base font-semibold mb-2 block">Page Range (e.g., 1, 3-5)</Label>
                        <Input
                            id="range"
                            placeholder="1, 3-5"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">How to Split PDF Files?</h2>
                    <ol className="list-decimal pl-6 mb-8 space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Upload your PDF file.</li>
                        <li>Enter the page numbers or ranges you want to extract (e.g., "1, 3-5").</li>
                        <li>Click <strong>"Extract Pages"</strong>.</li>
                        <li>Download your new PDF containing only the selected pages.</li>
                    </ol>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">Why use our PDF Splitter?</h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Precise Extraction</h3>
                            <p className="text-slate-600 dark:text-slate-400">Select exactly the pages you need, whether it's a single page or multiple ranges.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Secure & Private</h3>
                            <p className="text-slate-600 dark:text-slate-400">Your documents are processed locally. No one else sees your files.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">FAQ</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Can I split a password-protected PDF?</AccordionTrigger>
                            <AccordionContent>
                                Currently, you need to unlock the PDF before splitting it.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </article>
            </div>
        </div>
    );
}
