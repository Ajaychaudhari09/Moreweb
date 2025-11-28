"use client";

import PDFToolLayout from "./PDFToolLayout";
import { Image as ImageIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function JpgToPdf() {
    const handleConvert = async (files: File[]) => {
        const pdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const image = await pdf.embedJpg(arrayBuffer);
            const page = pdf.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "images.pdf";
        link.click();
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div>
                <PDFToolLayout
                    title="JPG to PDF"
                    description="Convert JPG images to a PDF document."
                    icon={<ImageIcon className="h-10 w-10" />}
                    onProcess={handleConvert}
                    accept={{ "image/jpeg": [".jpg", ".jpeg"] }}
                    maxFiles={20}
                    actionLabel="Convert to PDF"
                />
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Convert Images to PDF</h2>
                    <p className="mb-6 text-slate-700 dark:text-slate-300">
                        Easily combine multiple JPG images into a single PDF document. Perfect for creating portfolios,
                        sharing photo albums, or digitizing documents.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">How it works</h2>
                    <ol className="list-decimal pl-6 mb-8 space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Select your JPG images.</li>
                        <li>Our tool automatically places each image on a new page.</li>
                        <li>Click <strong>"Convert to PDF"</strong>.</li>
                        <li>Download your new PDF document.</li>
                    </ol>
                </article>
            </div>
        </div>
    );
}
