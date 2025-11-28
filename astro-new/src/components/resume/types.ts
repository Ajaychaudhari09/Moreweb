export interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin: string;
    website: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    year: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    skills: string;
}

export type Theme = "modern" | "classic" | "minimal";
