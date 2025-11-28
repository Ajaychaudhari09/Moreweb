import type { ResumeData, PersonalInfo, Experience, Education, Project, Certification } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, User, Briefcase, GraduationCap, FolderGit2, Award, Wrench } from "lucide-react";

interface ResumeEditorProps {
    data: ResumeData;
    setData: (data: ResumeData) => void;
}

export function ResumeEditor({ data, setData }: ResumeEditorProps) {

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setData({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
    };

    // Experience Handlers
    const addExperience = () => {
        const newExp: Experience = {
            id: Math.random().toString(36).substr(2, 9),
            company: "",
            position: "",
            duration: "",
            description: ""
        };
        setData({ ...data, experiences: [...data.experiences, newExp] });
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setData({
            ...data,
            experiences: data.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        });
    };

    const removeExperience = (id: string) => {
        setData({ ...data, experiences: data.experiences.filter(exp => exp.id !== id) });
    };

    // Education Handlers
    const addEducation = () => {
        const newEdu: Education = {
            id: Math.random().toString(36).substr(2, 9),
            school: "",
            degree: "",
            year: ""
        };
        setData({ ...data, education: [...data.education, newEdu] });
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setData({
            ...data,
            education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        });
    };

    const removeEducation = (id: string) => {
        setData({ ...data, education: data.education.filter(edu => edu.id !== id) });
    };

    // Project Handlers
    const addProject = () => {
        const newProj: Project = {
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            description: "",
            link: ""
        };
        setData({ ...data, projects: [...data.projects, newProj] });
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        setData({
            ...data,
            projects: data.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
        });
    };

    const removeProject = (id: string) => {
        setData({ ...data, projects: data.projects.filter(proj => proj.id !== id) });
    };

    // Certification Handlers
    const addCertification = () => {
        const newCert: Certification = {
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            issuer: "",
            year: ""
        };
        setData({ ...data, certifications: [...data.certifications, newCert] });
    };

    const updateCertification = (id: string, field: keyof Certification, value: string) => {
        setData({
            ...data,
            certifications: data.certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
        });
    };

    const removeCertification = (id: string) => {
        setData({ ...data, certifications: data.certifications.filter(cert => cert.id !== id) });
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2 no-scrollbar pb-32 p-6">
            {/* Personal Info */}
            <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <User className="h-5 w-5" />
                        </div>
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Full Name" value={data.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Phone" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Location" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="LinkedIn (Optional)" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                        <Input className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Website (Optional)" value={data.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
                    </div>
                    <Textarea className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 min-h-[100px]" placeholder="Professional Summary" value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Experience */}
                <AccordionItem value="experience" className="border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm px-2">
                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                        <span className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            Experience
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4 space-y-6">
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="space-y-4 p-5 border border-slate-100 dark:border-slate-800 rounded-xl relative bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeExperience(exp.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                                </div>
                                <Input className="bg-white dark:bg-slate-900" placeholder="Duration (e.g., Jan 2020 - Present)" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} />
                                <Textarea className="bg-white dark:bg-slate-900 min-h-[100px]" placeholder="Description (Achievements, responsibilities...)" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} />
                            </div>
                        ))}
                        <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-12 rounded-xl">
                            <Plus className="h-4 w-4" /> Add Experience
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education" className="border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm px-2">
                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                        <span className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            Education
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4 space-y-6">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="space-y-4 p-5 border border-slate-100 dark:border-slate-800 rounded-xl relative bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeEducation(edu.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                                    <Input className="bg-white dark:bg-slate-900" placeholder="School/University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <Button onClick={addEducation} variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-12 rounded-xl">
                            <Plus className="h-4 w-4" /> Add Education
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Projects */}
                <AccordionItem value="projects" className="border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm px-2">
                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                        <span className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <FolderGit2 className="h-5 w-5" />
                            </div>
                            Projects
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4 space-y-6">
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="space-y-4 p-5 border border-slate-100 dark:border-slate-800 rounded-xl relative bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeProject(proj.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Link (Optional)" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} />
                                </div>
                                <Textarea className="bg-white dark:bg-slate-900 min-h-[80px]" placeholder="Description" value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
                            </div>
                        ))}
                        <Button onClick={addProject} variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-12 rounded-xl">
                            <Plus className="h-4 w-4" /> Add Project
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Certifications */}
                <AccordionItem value="certifications" className="border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm px-2">
                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                        <span className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                <Award className="h-5 w-5" />
                            </div>
                            Certifications
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4 space-y-6">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="space-y-4 p-5 border border-slate-100 dark:border-slate-800 rounded-xl relative bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeCertification(cert.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
                                    <Input className="bg-white dark:bg-slate-900" placeholder="Year" value={cert.year} onChange={(e) => updateCertification(cert.id, 'year', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <Button onClick={addCertification} variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-12 rounded-xl">
                            <Plus className="h-4 w-4" /> Add Certification
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                <AccordionItem value="skills" className="border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm px-2">
                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                        <span className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                                <Wrench className="h-5 w-5" />
                            </div>
                            Skills
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4">
                        <Textarea
                            placeholder="List your skills (e.g., JavaScript, React, Project Management...)"
                            value={data.skills}
                            onChange={(e) => setData({ ...data, skills: e.target.value })}
                            className="min-h-[120px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
