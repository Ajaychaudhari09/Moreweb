"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFToolLayoutProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onProcess: (files: File[]) => Promise<void>;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    actionLabel?: string;
}

export default function PDFToolLayout({
    title,
    description,
    icon,
    onProcess,
    accept = { "application/pdf": [".pdf"] },
    maxFiles = 1,
    actionLabel = "Process PDF",
}: PDFToolLayoutProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedFile, setProcessedFile] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => {
            const newFiles = [...prev, ...acceptedFiles];
            return maxFiles === 1 ? [newFiles[newFiles.length - 1]] : newFiles;
        });
        setProcessedFile(null);
    }, [maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles === 1 ? 0 : maxFiles, // 0 means unlimited in dropzone types if not specified, but we handle logic manually
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setProcessedFile(null);
    };

    const handleProcess = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            await onProcess(files);
        } catch (error) {
            console.error("Processing failed:", error);
            alert("An error occurred while processing your files.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            </div>

            <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-none bg-slate-50/50 dark:bg-slate-900/50">
                <CardContent className="p-8">
                    {files.length === 0 ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex flex-col items-center justify-center h-64 cursor-pointer transition-colors rounded-xl border-2 border-transparent",
                                isDragActive ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="p-4 rounded-full bg-white shadow-sm mb-4 dark:bg-slate-800">
                                <Upload className="h-8 w-8 text-blue-500" />
                            </div>
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                                {isDragActive ? "Drop files here" : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {maxFiles === 1 ? "Upload a single file" : "Upload multiple files"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {files.map((file, i) => (
                                    <div
                                        key={i}
                                        className="relative group p-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm flex items-center gap-3"
                                    >
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-500">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all"
                                        >
                                            <X className="h-4 w-4 text-slate-500" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add more button */}
                                {maxFiles > 1 && (
                                    <div {...getRootProps()} className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <input {...getInputProps()} />
                                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                        <span className="text-xs font-medium text-muted-foreground">Add more</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button
                                    size="lg"
                                    onClick={handleProcess}
                                    disabled={isProcessing}
                                    className="min-w-[200px]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        actionLabel
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Instructions / SEO Content Area */}
            <div className="mt-16 prose dark:prose-invert max-w-none">
                <h3>How to use this tool</h3>
                <ol>
                    <li>Upload your file(s) by dragging them into the box or clicking to select.</li>
                    <li>Arrange them if necessary (for merge).</li>
                    <li>Click <strong>{actionLabel}</strong> to start.</li>
                    <li>Download your processed file instantly.</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                    Files are processed entirely in your browser. No data is uploaded to our servers, ensuring 100% privacy.
                </p>
            </div>
        </div>
    );
}
