"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { Download, User, Briefcase, GraduationCap, Eye, Trash2, FolderGit2, Award, Palette } from "lucide-react";
import jsPDF from "jspdf";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  website: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
  link: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

type Theme = "modern" | "classic" | "minimal";

export default function ResumeMakerPage() {
  const [theme, setTheme] = useState<Theme>("modern");
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    summary: "Experienced software developer with a passion for creating innovative solutions and building scalable applications.",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "Tech Company Inc.",
      position: "Senior Software Developer",
      duration: "Jan 2020 - Present",
      description: "Developed and maintained web applications using React and Node.js. Led a team of 3 developers and improved application performance by 40%."
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    { school: "University of Technology", degree: "Bachelor of Computer Science", year: "2019" }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { name: "E-commerce Platform", description: "Built a full-stack e-commerce platform with Next.js and Stripe.", link: "github.com/johndoe/shop" }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2021" }
  ]);

  const [skills, setSkills] = useState<string>("JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Git");
  const [showPreview, setShowPreview] = useState(true);

  // --- Handlers ---

  const addExperience = () => setExperiences([...experiences, { company: "", position: "", duration: "", description: "" }]);
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };
  const removeExperience = (index: number) => setExperiences(experiences.filter((_, i) => i !== index));

  const addEducation = () => setEducation([...education, { school: "", degree: "", year: "" }]);
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const addProject = () => setProjects([...projects, { name: "", description: "", link: "" }]);
  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };
  const removeProject = (index: number) => setProjects(projects.filter((_, i) => i !== index));

  const addCertification = () => setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };
  const removeCertification = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // --- Theme Config ---
    const fontMain = theme === "classic" ? "times" : "helvetica";
    const headerAlign = theme === "classic" ? "center" : "left";
    const headerColor = theme === "modern" ? [0, 102, 204] : [0, 0, 0]; // Blue for modern, black for others

    // Helper to add text
    const addText = (text: string, size: number, fontStyle: string = "normal", color: any = 0, align: "left" | "center" | "right" = "left") => {
      doc.setFontSize(size);
      doc.setFont(fontMain, fontStyle);
      doc.setTextColor(Array.isArray(color) ? color[0] : color, Array.isArray(color) ? color[1] : 0, Array.isArray(color) ? color[2] : 0);
      
      if (align === "center") {
        doc.text(text, pageWidth / 2, y, { align: "center" });
      } else if (align === "right") {
        doc.text(text, pageWidth - margin, y, { align: "right" });
      } else {
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += (lines.length - 1) * (size / 2); // Adjust y for multiline
      }
      y += size / 2 + 2;
    };

    // --- Header ---
    if (theme === "modern") {
        doc.setFontSize(26);
        doc.setFont(fontMain, "bold");
        doc.text(personalInfo.name, margin, y);
        y += 10;
    } else if (theme === "classic") {
        doc.setFontSize(24);
        doc.setFont(fontMain, "bold");
        doc.text(personalInfo.name.toUpperCase(), pageWidth / 2, y, { align: "center" });
        y += 10;
    } else { // Minimal
        doc.setFontSize(28);
        doc.setFont(fontMain, "normal");
        doc.text(personalInfo.name, margin, y);
        y += 12;
    }

    // Contact Info
    doc.setFontSize(10);
    doc.setFont(fontMain, "normal");
    doc.setTextColor(80);
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website
    ].filter(Boolean).join(" | ");
    
    if (theme === "classic") {
        doc.text(contactInfo, pageWidth / 2, y, { align: "center" });
    } else {
        doc.text(contactInfo, margin, y);
    }
    y += 15;
    doc.setTextColor(0);

    // --- Sections ---
    const addSectionTitle = (title: string) => {
        y += 5;
        doc.setFontSize(12);
        doc.setFont(fontMain, "bold");
        if (theme === "modern") doc.setTextColor(0, 102, 204);
        
        if (theme === "classic") {
            doc.text(title.toUpperCase(), pageWidth / 2, y, { align: "center" });
            doc.setDrawColor(0);
            doc.line(margin + 20, y + 2, pageWidth - margin - 20, y + 2);
        } else if (theme === "minimal") {
            doc.setFont(fontMain, "normal");
            doc.text(title.toUpperCase(), margin, y);
            doc.setDrawColor(200);
            doc.line(margin, y + 2, pageWidth - margin, y + 2);
        } else { // Modern
            doc.text(title.toUpperCase(), margin, y);
            doc.setDrawColor(200);
            doc.line(margin, y + 2, pageWidth - margin, y + 2);
        }
        
        y += 10;
        doc.setTextColor(0);
    };

    if (personalInfo.summary) {
      addSectionTitle("Professional Summary");
      addText(personalInfo.summary, 10);
      y += 5;
    }

    if (experiences.length > 0 && experiences[0].company) {
      addSectionTitle("Experience");
      experiences.forEach(exp => {
        if (!exp.company) return;
        
        // Company & Date
        doc.setFontSize(11);
        doc.setFont(fontMain, "bold");
        doc.text(exp.position, margin, y);
        
        doc.setFont(fontMain, "normal");
        doc.setFontSize(10);
        const dateWidth = doc.getTextWidth(exp.duration);
        doc.text(exp.duration, pageWidth - margin - dateWidth, y);
        y += 5;

        doc.setFont(fontMain, "italic");
        doc.text(exp.company, margin, y);
        y += 6;

        if (exp.description) {
          doc.setFont(fontMain, "normal");
          const lines = doc.splitTextToSize(exp.description, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 5 + 5;
        }
      });
    }

    if (projects.length > 0 && projects[0].name) {
      addSectionTitle("Projects");
      projects.forEach(proj => {
        if (!proj.name) return;
        doc.setFontSize(11);
        doc.setFont(fontMain, "bold");
        doc.text(proj.name, margin, y);
        if (proj.link) {
          doc.setFontSize(9);
          doc.setTextColor(100);
          const linkWidth = doc.getTextWidth(proj.link);
          doc.text(proj.link, pageWidth - margin - linkWidth, y);
          doc.setTextColor(0);
        }
        y += 5;
        if (proj.description) {
          doc.setFontSize(10);
          doc.setFont(fontMain, "normal");
          const lines = doc.splitTextToSize(proj.description, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 5 + 3;
        }
      });
    }

    if (education.length > 0 && education[0].school) {
      addSectionTitle("Education");
      education.forEach(edu => {
        if (!edu.school) return;
        doc.setFontSize(11);
        doc.setFont(fontMain, "bold");
        doc.text(edu.school, margin, y);
        doc.setFont(fontMain, "normal");
        doc.setFontSize(10);
        doc.text(edu.year, pageWidth - margin - doc.getTextWidth(edu.year), y);
        y += 5;
        doc.text(edu.degree, margin, y);
        y += 8;
      });
    }

    if (certifications.length > 0 && certifications[0].name) {
      addSectionTitle("Certifications");
      certifications.forEach(cert => {
        if (!cert.name) return;
        doc.setFontSize(10);
        doc.text(`• ${cert.name} - ${cert.issuer} (${cert.year})`, margin, y);
        y += 6;
      });
    }

    if (skills) {
      addSectionTitle("Skills");
      addText(skills, 10);
    }

    const fileName = personalInfo.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'resume';
    doc.save(`${fileName}.pdf`);
  };

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setPersonalInfo({ name: "", email: "", phone: "", location: "", summary: "", linkedin: "", website: "" });
      setExperiences([{ company: "", position: "", duration: "", description: "" }]);
      setEducation([{ school: "", degree: "", year: "" }]);
      setProjects([{ name: "", description: "", link: "" }]);
      setCertifications([{ name: "", issuer: "", year: "" }]);
      setSkills("");
    }
  };

  const ResumePreview = () => {
    // Theme Classes
    const containerClass = `bg-white text-black p-8 shadow-lg rounded-lg min-h-[800px] text-sm border ${
        theme === 'classic' ? 'font-serif' : 'font-sans'
    }`;

    const headerClass = theme === 'classic' ? 'text-center border-b-2 border-black pb-6 mb-6' : 
                        theme === 'minimal' ? 'pb-6 mb-6' : 
                        'border-b-2 border-gray-800 pb-6 mb-6'; // Modern

    const nameClass = theme === 'classic' ? 'text-3xl font-bold uppercase tracking-widest' :
                      theme === 'minimal' ? 'text-4xl font-normal tracking-tight' :
                      'text-4xl font-bold text-gray-900 uppercase tracking-tight';

    const sectionTitleClass = theme === 'classic' ? 'text-center font-bold uppercase tracking-widest border-b border-black pb-1 mb-4' :
                              theme === 'minimal' ? 'font-normal uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-4' :
                              'text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1';

    return (
        <div className={containerClass}>
        {/* Header */}
        <div className={headerClass}>
            <h1 className={nameClass}>{personalInfo.name || 'Your Name'}</h1>
            <div className={`flex flex-wrap gap-3 mt-3 text-gray-600 text-xs font-medium ${theme === 'classic' ? 'justify-center' : ''}`}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
            </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
        )}

        {/* Experience */}
        {experiences.some(exp => exp.company) && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Experience</h2>
            {experiences.map((exp, index) => (
                exp.company && (
                <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800 text-base">{exp.position}</h3>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-4">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 font-medium italic mb-1">{exp.company}</p>
                    {exp.description && (
                    <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                </div>
                )
            ))}
            </div>
        )}

        {/* Projects */}
        {projects.some(p => p.name) && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Projects</h2>
            {projects.map((proj, index) => (
                proj.name && (
                <div key={index} className="mb-3">
                    <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800">{proj.name}</h3>
                    {proj.link && <span className="text-xs text-blue-600">{proj.link}</span>}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{proj.description}</p>
                </div>
                )
            ))}
            </div>
        )}

        {/* Education */}
        {education.some(edu => edu.school) && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Education</h2>
            {education.map((edu, index) => (
                edu.school && (
                <div key={index} className="mb-2">
                    <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800">{edu.school}</h3>
                    <span className="text-xs text-gray-500 font-medium">{edu.year}</span>
                    </div>
                    <p className="text-gray-700 text-xs">{edu.degree}</p>
                </div>
                )
            ))}
            </div>
        )}

        {/* Certifications */}
        {certifications.some(c => c.name) && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Certifications</h2>
            <ul className="list-disc list-inside text-xs text-gray-700">
                {certifications.map((cert, index) => (
                cert.name && <li key={index}><span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.year})</li>
                ))}
            </ul>
            </div>
        )}

        {/* Skills */}
        {skills && (
            <div className="mb-6">
            <h2 className={sectionTitleClass}>Skills</h2>
            <p className="text-gray-700 text-xs leading-relaxed">{skills}</p>
            </div>
        )}
        </div>
    );
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <BackButton href="/tools" label="Back to Tools" />

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Advanced Resume Maker</h1>
          <p className="text-muted-foreground">
            Create a professional, ATS-optimized resume in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Theme Selector */}
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Select Theme
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={theme} onValueChange={(v: Theme) => setTheme(v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="modern">Modern (Blue & Bold)</SelectItem>
                            <SelectItem value="classic">Classic (Serif & Centered)</SelectItem>
                            <SelectItem value="minimal">Minimal (Clean & Simple)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Full Name" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                  <Input placeholder="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                  <Input placeholder="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                  <Input placeholder="Location" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                  <Input placeholder="LinkedIn (Optional)" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                  <Input placeholder="Website (Optional)" value={personalInfo.website} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} />
                </div>
                <Textarea placeholder="Professional Summary" value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} className="min-h-[100px]" />
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-orange-500" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative bg-slate-50/50 dark:bg-slate-900/50">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-600" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                      <Input placeholder="Position" value={exp.position} onChange={(e) => updateExperience(index, 'position', e.target.value)} />
                    </div>
                    <Input placeholder="Duration" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} />
                    <Textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
                  </div>
                ))}
                <Button onClick={addExperience} variant="outline" className="w-full border-dashed">Add Experience</Button>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderGit2 className="h-5 w-5 text-purple-500" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((proj, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative bg-slate-50/50 dark:bg-slate-900/50">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <Input placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(index, 'name', e.target.value)} />
                      <Input placeholder="Link (Optional)" value={proj.link} onChange={(e) => updateProject(index, 'link', e.target.value)} />
                    </div>
                    <Textarea placeholder="Description" value={proj.description} onChange={(e) => updateProject(index, 'description', e.target.value)} />
                  </div>
                ))}
                <Button onClick={addProject} variant="outline" className="w-full border-dashed">Add Project</Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative bg-slate-50/50 dark:bg-slate-900/50">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                      <Input placeholder="School" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                      <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                      <Input placeholder="Year" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full border-dashed">Add Education</Button>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative bg-slate-50/50 dark:bg-slate-900/50">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                      <Input placeholder="Name" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} />
                      <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateCertification(index, 'issuer', e.target.value)} />
                      <Input placeholder="Year" value={cert.year} onChange={(e) => updateCertification(index, 'year', e.target.value)} />
                    </div>
                  </div>
                ))}
                <Button onClick={addCertification} variant="outline" className="w-full border-dashed">Add Certification</Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="List your skills..." value={skills} onChange={(e) => setSkills(e.target.value)} className="min-h-[100px]" />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="sticky bottom-4 bg-white dark:bg-slate-950 p-4 border rounded-lg shadow-lg flex gap-4 z-10">
              <Button onClick={generatePDF} className="flex-1 btn-vibrant">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="lg:hidden">
                <Eye className="h-4 w-4" />
              </Button>
              <Button onClick={clearForm} variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`lg:block ${showPreview ? 'block' : 'hidden'}`}>
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" /> Live Preview
                </h2>
                <span className="text-xs text-muted-foreground">A4 Format</span>
              </div>
              <div className="border rounded-lg overflow-hidden shadow-2xl">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
