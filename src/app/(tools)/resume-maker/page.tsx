"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { Download, User, Briefcase, GraduationCap, Eye, Trash2 } from "lucide-react";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
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

export default function ResumeMakerPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    summary: "Experienced software developer with a passion for creating innovative solutions and building scalable applications.",
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

  const [skills, setSkills] = useState<string>("JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Git");
  const [showPreview, setShowPreview] = useState(true);

  const addExperience = () => {
    setExperiences([...experiences, { company: "", position: "", duration: "", description: "" }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const generatePDF = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let yPosition = 30;

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(personalInfo.name || 'Your Name', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, 20, yPosition);
      yPosition += 20;

      // Summary
      if (personalInfo.summary) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Summary', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += summaryLines.length * 4 + 10;
      }

      // Experience
      if (experiences.some(exp => exp.company)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Work Experience', 20, yPosition);
        yPosition += 8;

        experiences.forEach((exp) => {
          if (exp.company) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${exp.position} at ${exp.company}`, 20, yPosition);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text(exp.duration, 20, yPosition + 5);
            yPosition += 12;

            if (exp.description) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              const descLines = doc.splitTextToSize(exp.description, 170);
              doc.text(descLines, 20, yPosition);
              yPosition += descLines.length * 4 + 8;
            }
          }
        });
        yPosition += 5;
      }

      // Education
      if (education.some(edu => edu.school)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Education', 20, yPosition);
        yPosition += 8;

        education.forEach((edu) => {
          if (edu.school) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${edu.degree}`, 20, yPosition);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${edu.school} - ${edu.year}`, 20, yPosition + 5);
            yPosition += 15;
          }
        });
      }

      // Skills
      if (skills) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Skills', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const skillsLines = doc.splitTextToSize(skills, 170);
        doc.text(skillsLines, 20, yPosition);
      }

      const fileName = personalInfo.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'resume';
      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const clearForm = () => {
    setPersonalInfo({
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    });
    setExperiences([{ company: "", position: "", duration: "", description: "" }]);
    setEducation([{ school: "", degree: "", year: "" }]);
    setSkills("");
  };

  const ResumePreview = () => (
    <div className="bg-white text-black p-8 shadow-lg rounded-lg min-h-[600px] text-sm border">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-gray-600 mt-2">
          {personalInfo.email} {personalInfo.phone && `| ${personalInfo.phone}`} {personalInfo.location && `| ${personalInfo.location}`}
        </p>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">Work Experience</h2>
          {experiences.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                  <span className="text-sm text-gray-600 font-medium">{exp.duration}</span>
                </div>
                <p className="text-gray-600 font-medium">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {education.some(edu => edu.school) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">Education</h2>
          {education.map((edu, index) => (
            edu.school && (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{edu.year}</span>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">Skills</h2>
          <p className="text-gray-700 leading-relaxed">{skills}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <BackButton href="/tools" label="Back to Tools" />
        
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Resume Maker</h1>
          <p className="text-muted-foreground">
            Build and download a professional, ATS-friendly resume in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  />
                  <Input
                    placeholder="Location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  />
                </div>
                <Textarea
                  placeholder="Professional Summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                    {experiences.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                      <Input
                        placeholder="Position Title"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Duration (e.g., Jan 2020 - Present)"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    />
                    <Textarea
                      placeholder="Job Description and Achievements"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
                <Button onClick={addExperience} variant="outline" className="w-full">
                  Add Another Experience
                </Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                    {education.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="School/University"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                      <Input
                        placeholder="Degree/Certification"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <Input
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full">
                  Add Another Education
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="List your skills (e.g., JavaScript, React, Node.js, etc.)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
              <Button onClick={generatePDF} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button 
                onClick={() => setShowPreview(!showPreview)} 
                variant="outline"
                className="flex-1 lg:hidden"
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button 
                onClick={clearForm} 
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`animate-slide-up ${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </h2>
              <div className="border rounded-lg overflow-hidden">
                <ResumePreview />
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Tip:</strong> Your resume is automatically updated as you type. 
                  The PDF will match this preview exactly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
