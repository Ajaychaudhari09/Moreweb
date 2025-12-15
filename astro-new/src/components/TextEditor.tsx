"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, FileDown, RotateCcw, Type,
    FileText as FileTextIcon
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Card, CardContent } from "@/components/ui/card";

export default function TextEditor() {
    const [isGenerating, setIsGenerating] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Start typing your document here...',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[800px] p-8 bg-white shadow-sm',
            },
        },
        content: `
            <h1>Untitled Document</h1>
            <p>Start editing this document...</p>
        `,
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const downloadPDF = async () => {
        setIsGenerating(true);
        const element = document.querySelector('.ProseMirror') as HTMLElement;
        if (!element) {
            setIsGenerating(false);
            return;
        }

        setTimeout(async () => {
            try {
                const doc = new jsPDF({
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                });

                await doc.html(element, {
                    callback: function (pdf) {
                        pdf.save('document.pdf');
                        setIsGenerating(false);
                    },
                    x: 40,
                    y: 40,
                    width: 515,
                    windowWidth: 800,
                    autoPaging: 'text'
                });
            } catch (error) {
                console.error("PDF generation failed:", error);
                setIsGenerating(false);
            }
        }, 100);
    };

    const downloadTXT = () => {
        const text = editor.getText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearContent = () => {
        if (confirm("Are you sure you want to clear the document?")) {
            editor.commands.setContent('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[1200px] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                    {/* Toolbar */}
                    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                title="Undo (Ctrl+Z)"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                title="Redo (Ctrl+Y)"
                            >
                                <RotateCcw className="w-4 h-4 scale-x-[-1]" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-2">
                            <Button
                                variant={editor.isActive('bold') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                title="Bold (Ctrl+B)"
                            >
                                <Bold className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive('italic') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                title="Italic (Ctrl+I)"
                            >
                                <Italic className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive('underline') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                title="Underline (Ctrl+U)"
                            >
                                <UnderlineIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive('strike') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                title="Strikethrough"
                            >
                                <span className="line-through text-xs font-bold">S</span>
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-2">
                            <Button
                                variant={editor.isActive('heading', { level: 1 }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                title="Heading 1"
                            >
                                <Type className="w-4 h-4" /> <span className="text-xs ml-1 font-bold">1</span>
                            </Button>
                            <Button
                                variant={editor.isActive('heading', { level: 2 }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                title="Heading 2"
                            >
                                <Type className="w-3 h-3" /> <span className="text-xs ml-1 font-bold">2</span>
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-2">
                            <Button
                                variant={editor.isActive('bulletList') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                title="Bullet List"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive('orderedList') ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                title="Ordered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-2">
                            <Button
                                variant={editor.isActive({ textAlign: 'left' }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                title="Align Left"
                            >
                                <AlignLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive({ textAlign: 'center' }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                title="Align Center"
                            >
                                <AlignCenter className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive({ textAlign: 'right' }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                title="Align Right"
                            >
                                <AlignRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={editor.isActive({ textAlign: 'justify' }) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                title="Justify"
                            >
                                <AlignJustify className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 pr-2 mr-auto">
                            <Button variant="ghost" size="sm" onClick={() => {
                                const text = editor.getText();
                                navigator.clipboard.writeText(text);
                                alert("Copied to clipboard!");
                            }} title="Copy Content">
                                <FileTextIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={downloadTXT} title="Download Text">
                                <span>TXT</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={clearContent} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                            <Button size="sm" onClick={downloadPDF} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <FileDown className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Download PDF'}
                            </Button>
                        </div>
                    </div>
                    {/* Editor Canvas */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-8 cursor-text relative" onClick={() => editor.chain().focus().run()}>
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        <div className="max-w-[800px] mx-auto bg-white min-h-[1000px] shadow-lg print:shadow-none transition-shadow hover:shadow-xl relative z-10">
                            <EditorContent editor={editor} className="h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
