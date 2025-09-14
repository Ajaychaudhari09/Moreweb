"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Type } from "lucide-react";

export default function TextEditorPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(14);

  const exportAsPDF = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Add title
      if (title) {
        doc.setFontSize(20);
        doc.text(title, 20, 30);
      }
      
      // Add content
      doc.setFontSize(fontSize);
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, title ? 50 : 30);
      
      // Save the PDF
      doc.save(`${title || 'document'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'document'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearEditor = () => {
    setTitle("");
    setContent("");
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Text Editor</h1>
          <p className="text-muted-foreground">
            A simple, powerful online editor to write and export documents
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Title</label>
                  <Input
                    placeholder="Enter document title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    placeholder="Start writing your document here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] resize-none"
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Words: {wordCount} | Characters: {charCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="lg:col-span-1">
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <Input
                    type="number"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 14)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Button onClick={exportAsPDF} className="w-full" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  
                  <Button onClick={exportAsText} variant="outline" className="w-full" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export as TXT
                  </Button>
                  
                  <Button onClick={clearEditor} variant="destructive" className="w-full" size="sm">
                    Clear Editor
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Stats</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Words: {wordCount}</div>
                    <div>Characters: {charCount}</div>
                    <div>Characters (no spaces): {content.replace(/\s/g, '').length}</div>
                    <div>Paragraphs: {content.split('\n\n').filter(p => p.trim()).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
