import type { ResumeData, Theme } from "./types";

interface ResumePreviewProps {
    data: ResumeData;
    theme: Theme;
}

export function ResumePreview({ data, theme }: ResumePreviewProps) {
    // Theme Classes
    const containerClass = `bg-white text-black p-8 shadow-lg rounded-lg min-h-[800px] text-sm border ${theme === 'classic' ? 'font-serif' : 'font-sans'}`;

    const headerClass = theme === 'classic' ? 'text-center border-b-2 border-black pb-6 mb-6' :
        theme === 'minimal' ? 'pb-6 mb-6' :
            'border-b-2 border-gray-800 pb-6 mb-6'; // Modern

    const nameClass = theme === 'classic' ? 'text-3xl font-bold uppercase tracking-widest' :
        theme === 'minimal' ? 'text-4xl font-normal tracking-tight' :
            'text-4xl font-bold text-gray-900 uppercase tracking-tight';

    const sectionTitleClass = theme === 'classic' ? 'text-center font-bold uppercase tracking-widest border-b border-black pb-1 mb-4' :
        theme === 'minimal' ? 'font-normal uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-4' :
            'text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1';

    const { personalInfo, experiences, education, projects, certifications, skills } = data;

    return (
        <div className={containerClass} id="resume-preview">
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
            {experiences.length > 0 && experiences.some(exp => exp.company) && (
                <div className="mb-6">
                    <h2 className={sectionTitleClass}>Experience</h2>
                    {experiences.map((exp) => (
                        exp.company && (
                            <div key={exp.id} className="mb-4">
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
            {projects.length > 0 && projects.some(p => p.name) && (
                <div className="mb-6">
                    <h2 className={sectionTitleClass}>Projects</h2>
                    {projects.map((proj) => (
                        proj.name && (
                            <div key={proj.id} className="mb-3">
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
            {education.length > 0 && education.some(edu => edu.school) && (
                <div className="mb-6">
                    <h2 className={sectionTitleClass}>Education</h2>
                    {education.map((edu) => (
                        edu.school && (
                            <div key={edu.id} className="mb-2">
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
            {certifications.length > 0 && certifications.some(c => c.name) && (
                <div className="mb-6">
                    <h2 className={sectionTitleClass}>Certifications</h2>
                    <ul className="list-disc list-inside text-xs text-gray-700">
                        {certifications.map((cert) => (
                            cert.name && <li key={cert.id}><span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.year})</li>
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
}
