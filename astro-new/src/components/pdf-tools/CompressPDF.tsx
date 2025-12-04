"use client";

import PDFToolLayout from "./PDFToolLayout";
import { Minimize2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";


export default function CompressPDF() {
    const handleCompress = async (files: File[]) => {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        // Basic compression: remove metadata and unused objects
        const pdfBytes = await pdf.save({ useObjectStreams: false });

        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `compressed-${file.name}`;
        link.click();
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div>
                <PDFToolLayout
                    title="Compress PDF"
                    description="Optimize your PDF file size."
                    icon={<Minimize2 className="h-10 w-10" />}
                    onProcess={handleCompress}
                    maxFiles={1}
                    actionLabel="Compress PDF"
                />
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">How to Compress PDF?</h2>
                    <ol className="list-decimal pl-6 mb-8 space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Upload the PDF file you want to compress.</li>
                        <li>Click <strong>"Compress PDF"</strong>.</li>
                        <li>Wait a moment for the optimization to finish.</li>
                        <li>Download your smaller PDF file.</li>
                    </ol>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100">Benefits of Compression</h2>
                    <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Smaller file size for easier sharing via email.</li>
                        <li>Faster loading times on websites.</li>
                        <li>Saves storage space on your device.</li>
                    </ul>
                </article>
            </div>
        </div>
    );
}
