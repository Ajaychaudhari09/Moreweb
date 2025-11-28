
"use client";

import PDFToolLayout from "@/components/pdf-tools/PDFToolLayout";
import { FileStack } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function MergePDFPage() {
    const handleMerge = async (files: File[]) => {
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "merged-document.pdf";
        link.click();
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div>
                <PDFToolLayout
                    title="Merge PDF"
                    description="Combine multiple PDFs into one unified document. Drag and drop files to reorder them."
                    icon={<FileStack className="h-10 w-10" />}
                    onProcess={handleMerge}
                    maxFiles={10}
                    actionLabel="Merge PDFs"
                />
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">How to Merge PDF Files Online?</h2>
                    <ol className="list-decimal pl-6 mb-8 space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Select the PDF files you want to combine or drag and drop them into the file box.</li>
                        <li>Arrange the files in the order you want them to appear in the final document.</li>
                        <li>Click the <strong>"Merge PDFs"</strong> button.</li>
                        <li>Download your merged PDF file instantly.</li>
                    </ol>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">Why use our PDF Merger?</h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">100% Free & Secure</h3>
                            <p className="text-slate-600 dark:text-slate-400">We don't store your files. All processing happens in your browser, ensuring your data remains private.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Fast & Easy</h3>
                            <p className="text-slate-600 dark:text-slate-400">Merge your documents in seconds with our intuitive drag-and-drop interface.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">No Installation Required</h3>
                            <p className="text-slate-600 dark:text-slate-400">Works on any device (Windows, Mac, Linux, Mobile) directly in your browser.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">High Quality</h3>
                            <p className="text-slate-600 dark:text-slate-400">We preserve the quality of your original documents during the merging process.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it safe to merge PDFs here?</AccordionTrigger>
                            <AccordionContent>
                                Yes! We use client-side technology, meaning your files never leave your device. They are processed locally in your browser.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How many files can I merge?</AccordionTrigger>
                            <AccordionContent>
                                You can currently merge up to 10 PDF files at once.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </article>
            </div>
        </div>
    );
}
