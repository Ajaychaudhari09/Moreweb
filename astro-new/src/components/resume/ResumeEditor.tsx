import type { ResumeData, PersonalInfo, Experience, Education, Project, Certification } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, User, Briefcase, GraduationCap, FolderGit2, Award, Wrench } from "lucide-react";

export type EditorSection = 'personal' | 'experience' | 'education' | 'projects' | 'certifications' | 'skills';

interface ResumeEditorProps {
    data: ResumeData;
    setData: (data: ResumeData) => void;
    activeSection: EditorSection;
}

export function ResumeEditor({ data, setData, activeSection }: ResumeEditorProps) {

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
        <div className="h-full overflow-y-auto pr-2 no-scrollbar pb-32 p-4 sm:p-6">
            {/* Personal Info */}
            {activeSection === 'personal' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-6 w-6 text-blue-600" />
                            Personal Details
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Start with the basics. How can employers contact you?</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="e.g. John Doe" value={data.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="e.g. john@example.com" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="e.g. +1 234 567 890" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                            <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="e.g. New York, USA" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</label>
                                <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="linkedin.com/in/johndoe" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
                                <Input className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="johndoe.com" value={data.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Summary</label>
                            <Textarea className="min-h-[120px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" placeholder="Briefly describe your professional background and key achievements..." value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Experience */}
            {activeSection === 'experience' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="h-6 w-6 text-orange-600" />
                            Experience
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Add your relevant work experience, starting with the most recent.</p>
                    </div>

                    <div className="space-y-4">
                        {data.experiences.map((exp, index) => (
                            <Card key={exp.id} className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Position #{index + 1}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeExperience(exp.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4 bg-white dark:bg-slate-950">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Company</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Google" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Position</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Senior Developer" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 uppercase">Duration</label>
                                        <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Jan 2020 - Present" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                                        <Textarea className="min-h-[100px] bg-white dark:bg-slate-900" placeholder="Describe your key responsibilities and achievements..." value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-14 rounded-xl text-slate-500">
                            <Plus className="h-5 w-5" /> Add Another Position
                        </Button>
                    </div>
                </div>
            )}

            {/* Education */}
            {activeSection === 'education' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-green-600" />
                            Education
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">List your educational background.</p>
                    </div>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <Card key={edu.id} className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">School #{index + 1}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeEducation(edu.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4 bg-white dark:bg-slate-950">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 uppercase">School / University</label>
                                        <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Harvard University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Degree</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Bachelor of Science" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Year</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. 2018 - 2022" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addEducation} variant="outline" className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-14 rounded-xl text-slate-500">
                            <Plus className="h-5 w-5" /> Add Education
                        </Button>
                    </div>
                </div>
            )}

            {/* Projects */}
            {activeSection === 'projects' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FolderGit2 className="h-6 w-6 text-purple-600" />
                            Projects
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Showcase your best work and side projects.</p>
                    </div>

                    <div className="space-y-4">
                        {data.projects.map((proj, index) => (
                            <Card key={proj.id} className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Project #{index + 1}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeProject(proj.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4 bg-white dark:bg-slate-950">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Project Name</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. E-commerce App" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Link (Optional)</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. github.com/project" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                                        <Textarea className="min-h-[80px] bg-white dark:bg-slate-900" placeholder="What did you build? What technologies did you use?" value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addProject} variant="outline" className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-14 rounded-xl text-slate-500">
                            <Plus className="h-5 w-5" /> Add Project
                        </Button>
                    </div>
                </div>
            )}

            {/* Certifications */}
            {activeSection === 'certifications' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className="h-6 w-6 text-yellow-600" />
                            Certifications
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Add any relevant certifications or awards.</p>
                    </div>

                    <div className="space-y-4">
                        {data.certifications.map((cert, index) => (
                            <Card key={cert.id} className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Certification #{index + 1}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => removeCertification(cert.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4 bg-white dark:bg-slate-950">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 uppercase">Name</label>
                                        <Input className="bg-white dark:bg-slate-900" placeholder="e.g. AWS Certified Solutions Architect" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Issuer</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 uppercase">Year</label>
                                            <Input className="bg-white dark:bg-slate-900" placeholder="e.g. 2023" value={cert.year} onChange={(e) => updateCertification(cert.id, 'year', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addCertification} variant="outline" className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-2 h-14 rounded-xl text-slate-500">
                            <Plus className="h-5 w-5" /> Add Certification
                        </Button>
                    </div>
                </div>
            )}

            {/* Skills */}
            {activeSection === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Wrench className="h-6 w-6 text-gray-600" />
                            Skills
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">List your technical and soft skills.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills List</label>
                        <Textarea
                            placeholder="e.g. JavaScript, React, Node.js, Project Management, Communication..."
                            value={data.skills}
                            onChange={(e) => setData({ ...data, skills: e.target.value })}
                            className="min-h-[200px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 text-base"
                        />
                        <p className="text-xs text-slate-500">Tip: Separate skills with commas or new lines.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
