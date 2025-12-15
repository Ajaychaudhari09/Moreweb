"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFToolLayoutProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onProcess: (files: File[]) => Promise<void>;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    actionLabel: string;
}

export default function PDFToolLayout({
    title,
    description,
    icon,
    onProcess,
    accept = { "application/pdf": [".pdf"] },
    maxFiles = 1,
    actionLabel,
}: PDFToolLayoutProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > maxFiles) {
                setError(`You can only upload up to ${maxFiles} files.`);
                return;
            }
            setFiles((prev) => [...prev, ...newFiles]);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(file =>
                Object.keys(accept).some(type => file.type === type || accept[type].some(ext => file.name.endsWith(ext)))
            );

            if (newFiles.length === 0) {
                setError("Invalid file type.");
                return;
            }

            if (files.length + newFiles.length > maxFiles) {
                setError(`You can only upload up to ${maxFiles} files.`);
                return;
            }
            setFiles((prev) => [...prev, ...newFiles]);
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleProcess = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setError(null);

        // Artificial delay for better UX (consistent with other tools)
        // Also helps ensures the UI has time to paint the loading state before any heavy sync work
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            await onProcess(files);
        } catch (err) {
            console.error(err);
            setError("An error occurred while processing your files. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4 text-primary">
                    {icon}
                </div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            </div>

            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="p-8">
                    {files.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-12 cursor-pointer"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">
                                {Object.values(accept).flat().join(", ")} (Max {maxFiles} files)
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                        <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded">
                                            <FileText className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {files.length < maxFiles && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                        <span className="text-xs text-muted-foreground">Add more</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button size="lg" onClick={handleProcess} disabled={isProcessing} className="px-8">
                                    {isProcessing ? (
                                        <>
                                            <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></span>
                                            Processing...
                                        </>
                                    ) : actionLabel}
                                </Button>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept={Object.keys(accept).join(",")}
                        multiple={maxFiles > 1}
                    />
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
