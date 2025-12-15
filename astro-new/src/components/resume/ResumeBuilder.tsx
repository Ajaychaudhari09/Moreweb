import { useState } from 'react';
import { ResumeEditor } from './ResumeEditor';
import { ResumePreview } from './ResumePreview';
import type { ResumeData, Theme } from './types';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Printer, RotateCcw, FileDown, FileText, AlertTriangle } from 'lucide-react';

const initialData: ResumeData = {
    personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        linkedin: "",
        website: ""
    },
    experiences: [],
    education: [],
    projects: [],
    certifications: [],
    skills: ""
};

const SECTIONS = [
    { id: 'personal', label: 'Personal' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'skills', label: 'Skills' }
] as const;

export default function ResumeBuilder() {
    const [data, setData] = useState<ResumeData>(initialData);
    const [theme, setTheme] = useState<Theme>("modern");
    const [activeSection, setActiveSection] = useState<typeof SECTIONS[number]['id']>('personal');
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);


    const clearForm = () => {
        setIsClearDialogOpen(true);
    };

    const confirmClear = () => {
        setData(initialData);
        setIsClearDialogOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const [generating, setGenerating] = useState(false);

    const generatePDF = async () => {
        const element = document.getElementById('resume-preview');
        if (!element) return;

        setGenerating(true);
        // Small delay to allow UI to update state before heavy work freezes thread (though jsPDF is usually sync-ish)
        // or just to show the spinner for a moment.
        setTimeout(async () => {
            try {
                const { jsPDF } = await import("jspdf");
                const doc = new jsPDF({
                    format: 'a4',
                    unit: 'pt',
                    orientation: 'portrait'
                });

                await doc.html(element, {
                    callback: function (pdf) {
                        pdf.save("resume.pdf");
                        setGenerating(false);
                    },
                    x: 0,
                    y: 0,
                    width: 595.28, // A4 width in points
                    windowWidth: element.scrollWidth, // Ensure content fits
                    autoPaging: 'text',
                    margin: [0, 0, 0, 0]
                });
            } catch (error) {
                console.error("Failed to load jsPDF", error);
                setGenerating(false);
            }
        }, 100);
    };

    const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b bg-white dark:bg-slate-900 shadow-sm z-10 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 mr-4">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg hidden md:inline-block">Resume Builder</span>
                    </div>

                    {/* Mobile View Toggle */}
                    <div className="lg:hidden flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('editor')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'editor' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            Editor
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <Select value={theme} onValueChange={(v: Theme) => setTheme(v)}>
                        <SelectTrigger className="w-[180px] hidden sm:flex border-slate-200 dark:border-slate-800 focus:ring-indigo-500">
                            <SelectValue placeholder="Select Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="modern">Modern Professional</SelectItem>
                            <SelectItem value="classic">Classic Elegant</SelectItem>
                            <SelectItem value="minimal">Minimal Clean</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Button variant="ghost" size="sm" onClick={clearForm} className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors hidden sm:flex">
                        <RotateCcw className="h-4 w-4 mr-2" /> Clear
                    </Button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hidden sm:flex">
                        <Printer className="h-4 w-4 mr-2" /> Print
                    </Button>
                    <Button size="sm" onClick={generatePDF} disabled={generating} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                        {generating ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <FileDown className="h-4 w-4 mr-2" /> Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Editor Panel */}
                <div className={`w-full lg:w-[45%] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col z-0 ${viewMode === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <ResumeEditor data={data} setData={setData} activeSection={activeSection} />

                        {/* Navigation Footer */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
                                    if (currentIndex > 0) setActiveSection(SECTIONS[currentIndex - 1].id);
                                }}
                                disabled={activeSection === 'personal'}
                            >
                                Back
                            </Button>

                            <div className="flex gap-1">
                                {SECTIONS.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`h-2 w-2 rounded-full transition-colors ${activeSection === s.id ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={() => {
                                    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
                                    if (currentIndex < SECTIONS.length - 1) setActiveSection(SECTIONS[currentIndex + 1].id);
                                }}
                                disabled={activeSection === 'skills'}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className={`w-full lg:w-[55%] bg-slate-100/50 dark:bg-slate-950 overflow-y-auto p-4 lg:p-8 justify-center relative ${viewMode === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 pointer-events-none"></div>
                    <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl shadow-slate-200/50 dark:shadow-black/50 print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:m-0 transform transition-transform duration-300 origin-top scale-[0.85] sm:scale-100 lg:scale-[0.9] xl:scale-100 z-10" id="resume-preview">
                        <ResumePreview data={data} theme={theme} />
                    </div>
                </div>
            </div>

            <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-center">Clear all data?</DialogTitle>
                        <DialogDescription className="text-center">
                            This action cannot be undone. All your entered details will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsClearDialogOpen(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmClear} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                            Yes, Clear All Data
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
