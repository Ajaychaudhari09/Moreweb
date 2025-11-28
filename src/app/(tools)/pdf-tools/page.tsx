import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileStack,
    Scissors,
    Minimize2,
    Image,
    FileText,
    Lock,
    Unlock,
    RotateCw
} from "lucide-react";

const tools = [
    {
        title: "Merge PDF",
        description: "Combine multiple PDFs into one unified document in your preferred order.",
        icon: <FileStack className="h-8 w-8 text-blue-500" />,
        href: "/pdf-tools/merge",
        status: "ready"
    },
    {
        title: "Split PDF",
        description: "Separate one page or a whole set for easy conversion into independent PDF files.",
        icon: <Scissors className="h-8 w-8 text-orange-500" />,
        href: "/pdf-tools/split",
        status: "ready"
    },
    {
        title: "Compress PDF",
        description: "Reduce file size while optimizing for maximal PDF quality.",
        icon: <Minimize2 className="h-8 w-8 text-green-500" />,
        href: "/pdf-tools/compress",
        status: "ready"
    },
    {
        title: "JPG to PDF",
        description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
        icon: <Image className="h-8 w-8 text-purple-500" />,
        href: "/pdf-tools/jpg-to-pdf",
        status: "ready"
    },
    {
        title: "PDF to JPG",
        description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
        icon: <FileText className="h-8 w-8 text-pink-500" />,
        href: "/pdf-tools/pdf-to-jpg",
        status: "coming-soon"
    },
    {
        title: "Protect PDF",
        description: "Encrypt your PDF with a password to prevent unauthorized access.",
        icon: <Lock className="h-8 w-8 text-slate-700 dark:text-slate-400" />,
        href: "/pdf-tools/protect",
        status: "coming-soon"
    },
    {
        title: "Unlock PDF",
        description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
        icon: <Unlock className="h-8 w-8 text-yellow-500" />,
        href: "/pdf-tools/unlock",
        status: "coming-soon"
    },
    {
        title: "Rotate PDF",
        description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
        icon: <RotateCw className="h-8 w-8 text-indigo-500" />,
        href: "/pdf-tools/rotate",
        status: "coming-soon"
    },
];

export default function PDFToolsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 gradient-text">
                    Every tool you need to work with PDFs
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    All the tools you need to be more productive and work smarter with documents.
                    100% free and client-side secure.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.status === "ready" ? tool.href : "#"}
                        className={tool.status === "coming-soon" ? "cursor-not-allowed opacity-60" : ""}
                    >
                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <div className="mb-4">{tool.icon}</div>
                                <CardTitle className="flex items-center justify-between">
                                    {tool.title}
                                    {tool.status === "coming-soon" && (
                                        <span className="text-xs font-normal px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                                            Soon
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {tool.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
