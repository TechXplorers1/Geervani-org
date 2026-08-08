
import { QueryClient } from "@tanstack/react-query";

// Types
export interface Program {
    id: number | string;
    title: string;
    category: string;
    description: string;
    image: string;
    stats: {
        duration: string;
        beneficiaries: string;
        partners: string;
        outcomes: string;
    };
}

export interface Project {
    id: number | string;
    title: string;
    category: string;
    description: string;
    image: string;
    stats: {
        duration: string;
        beneficiaries: string;
        partners: string;
        outcomes: string;
    };
}

// Initial Data (Sourced from your previous hardcoded values)

// Imports for images (We can't import images directly in this non-component file easily if we want to run it in node, 
// but for client-side bundle it's fine. However, to keep it simple, we will use string paths or require assumes standard build).
// Actually, let's keep the initial data empty or rely on the components to seed it if empty? 
// Better: Define the initial data here with hardcoded paths/imports if possible, or string placeholders that components resolve.
// Since Vite handles imports, we can import here.

import cleanWaterImage from "@assets/project_clean_water_india.png";
import digitalLiteracyImage from "@assets/project_digital_literacy_india.png";
import empowermentImage from "@assets/hero_indian_women_empowerment.png";
import ruralDevImage from "@assets/program_rural_development.png";
import literacyImage from "@assets/project_indian_literacy.png";
import youthImage from "@assets/hero_indian_youth_education.png";
import healthImage from "@assets/hero_indian_community_health.png";
import differentlyAbledImage from "@assets/program_differently_abled.png";
import youthEmpowermentImage from "@assets/program_youth_empowerment.png";

import blogImage from "@assets/project_indian_literacy.png";
import teamImage1 from "@assets/team_indian_leader_female.png";
import teamImage2 from "@assets/team_indian_member_male.png";
import teamImage3 from "@assets/team_indian_educator_female.png";

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
    readTime: number;
    publishedAt: Date | string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string; // Changed from photoUrl to image for consistency or map it
    email?: string;
    linkedin?: string;
    instagram?: string;
    isActive: boolean;
}

const INITIAL_PROGRAMS: Program[] = [
    {
        id: 1,
        title: "Women's Literacy & Skills Development",
        category: "Education",
        description: "A comprehensive program providing adult literacy classes and vocational skills training to women in rural communities.",
        image: literacyImage,
        stats: {
            duration: "2022 - Present",
            beneficiaries: "5,000+ women",
            partners: "Local Education Authority, Women's Cooperative",
            outcomes: "85% participants now literate, 60% started small businesses",
        },
    },
    {
        id: 2,
        title: "Youth Leadership Academy",
        category: "Youth Development",
        description: "An intensive leadership and entrepreneurship training program for young people aged 18-25.",
        image: youthImage,
        stats: {
            duration: "2021 - Present",
            beneficiaries: "2,500+ youth",
            partners: "University Partnership, Business Incubators",
            outcomes: "200+ youth-led initiatives launched, 75% employment rate",
        },
    },
    {
        id: 3,
        title: "Community Health Champions",
        category: "Health",
        description: "Training community health volunteers to provide essential healthcare education and services in underserved areas.",
        image: healthImage,
        stats: {
            duration: "2020 - Present",
            beneficiaries: "25,000+ community members",
            partners: "Ministry of Health, Local Clinics",
            outcomes: "40% reduction in preventable diseases, 150 trained health volunteers",
        },
    },
    {
        id: 4,
        title: "Differently Abled Training & Placement",
        category: "Vocational Training",
        description: "Specialized vocational training and job placement support for differently abled individuals.",
        image: differentlyAbledImage,
        stats: {
            duration: "2023 - Present",
            beneficiaries: "500+ individuals",
            partners: "Inclusive Corporations, Skill India",
            outcomes: "300+ placed in permanent jobs, 90% retention rate",
        },
    },
    {
        id: 5,
        title: "Rural Development Initiative",
        category: "Community Development",
        description: "Holistic rural development focusing on infrastructure, sustainable agriculture, and access to clean water.",
        image: ruralDevImage,
        stats: {
            duration: "2019 - Present",
            beneficiaries: "10,000+ villagers",
            partners: "Gram Panchayats, Rural Banks",
            outcomes: "50 villages impacted, 100% electrification in target areas",
        },
    },
    {
        id: 6,
        title: "Youth Empowerment & Skill Building",
        category: "Youth Development",
        description: "Empowering youth with 21st-century skills, career counseling, and mentorship.",
        image: youthEmpowermentImage,
        stats: {
            duration: "2022 - Present",
            beneficiaries: "3,000+ youth",
            partners: "Tech Companies, Youth Centers",
            outcomes: "1,200+ internships secured, 50+ youth-led startups",
        },
    },
];

const INITIAL_PROJECTS: Project[] = [
    {
        id: 1,
        title: "Clean Water & Sanitation",
        category: "Infrastructure",
        description: "Installing sustainable handpumps and sanitation facilities in drought-prone villages.",
        image: cleanWaterImage,
        stats: {
            duration: "2023 - Present",
            beneficiaries: "15,000+ villagers",
            partners: "Local Panchayats, WaterAid",
            outcomes: "50+ pumps installed, 90% reduction in waterborne diseases",
        },
    },
    {
        id: 2,
        title: "Digital Literacy Mission",
        category: "Education",
        description: "Bridging the digital divide by providing tablets and smart classrooms to rural schools.",
        image: digitalLiteracyImage,
        stats: {
            duration: "2022 - Present",
            beneficiaries: "8,000+ students",
            partners: "Tech Corp CSR, State Education Dept",
            outcomes: "40 smart classrooms established, 95% student engagement rate",
        },
    },
    {
        id: 3,
        title: "Women Entrepreneurs Program",
        category: "Livelihood",
        description: "A comprehensive support system for women self-help groups (SHGs) providing micro-loans and training.",
        image: empowermentImage,
        stats: {
            duration: "2021 - Present",
            beneficiaries: "4,500+ women",
            partners: "State Livelihood Mission, NABARD",
            outcomes: "300+ micro-enterprises launched, avg income increased by 40%",
        },
    },
    {
        id: 4,
        title: "Sustainable Agriculture Initiative",
        category: "Environment",
        description: "Promoting organic farming techniques, soil health management, and water conservation methods.",
        image: ruralDevImage,
        stats: {
            duration: "2020 - Present",
            beneficiaries: "2,000+ farmers",
            partners: "Agri-Universities, KVKs",
            outcomes: "500 acres converted to organic, 30% reduction in input costs",
        },
    },
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        title: "Empowering Women through Rural Education Programs",
        category: "Education",
        excerpt: "Our rural education initiative is unlocking opportunities for young women...",
        content: `Access to education transforms lives, especially for women in rural areas.\n\nOur program focuses on:\n• Adult literacy classes\n• Digital skill training\n• Scholarships for girls\n\nThese women are now running small businesses, joining local councils, and inspiring others to dream bigger.`,
        readTime: 5,
        image: blogImage,
        publishedAt: new Date("2025-02-10T10:00:00Z"),
    },
    {
        id: "2",
        title: "Health Camps Reached 4,200 Families Last Month",
        category: "Health",
        excerpt: "Mobile health camps are bringing critical medical services to remote communities...",
        content: `In remote regions where hospitals are far away, our mobile health camps are a lifesaver.\n\nLast month alone:\n• 4,200 families served\n• 800 children vaccinated\n• 350 prenatal checkups.`,
        readTime: 4,
        image: blogImage,
        publishedAt: new Date("2025-02-05T08:00:00Z"),
    },
    {
        id: "3",
        title: "Youth Leadership Program Expands Nationwide",
        category: "Youth",
        excerpt: "The youth leadership initiative is now active in 12 districts with over 600 participants...",
        content: "Tomorrow's leaders are being shaped today.\n\nThe Youth Leadership Program trains students in:\n• Public speaking\n• Community organizing\n• Problem-solving.",
        readTime: 3,
        image: blogImage,
        publishedAt: new Date("2025-02-01T07:30:00Z"),
    },
];

const INITIAL_STAFF: Staff[] = [
    {
        id: "1",
        name: "Dr. Aditi Rao",
        role: "Executive Director",
        bio: "Leading RSF with 15+ years of experience in community development and gender advocacy.",
        image: teamImage1,
        email: "aditi@tgf.org",
        isActive: true,
    },
    {
        id: "2",
        name: "Rajesh Kumar",
        role: "Program Coordinator",
        bio: "Coordinating our youth development initiatives across multiple regions with proven impact.",
        image: teamImage2,
        email: "rajesh@tgf.org",
        isActive: true,
    },
    {
        id: "3",
        name: "Sneha Patel",
        role: "Community Outreach Lead",
        bio: "Bridging the gap between our programs and the communities we serve with passion and dedication.",
        image: teamImage3,
        email: "sneha@tgf.org",
        isActive: true,
    },
];

const KEYS = {
    PROGRAMS: "tgf_programs_v1",
    PROJECTS: "tgf_projects_v1",
    BLOG: "tgf_blog_v1",
    STAFF: "tgf_staff_v1",
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
    getPrograms: async (): Promise<Program[]> => {
        await delay(300);
        const stored = localStorage.getItem(KEYS.PROGRAMS);
        if (!stored) {
            localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
            return INITIAL_PROGRAMS;
        }
        return JSON.parse(stored);
    },

    createProgram: async (program: Omit<Program, "id" | "stats">): Promise<Program> => {
        await delay(300);
        const programs = await db.getPrograms();
        const newProgram: Program = {
            ...program,
            id: Math.max(...programs.map(p => Number(p.id)), 0) + 1,
            stats: {
                duration: "New Program",
                beneficiaries: "0",
                partners: "None",
                outcomes: "Starting..."
            }
        };
        programs.push(newProgram);
        localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(programs));
        return newProgram;
    },

    updateProgram: async (updatedProgram: Program): Promise<Program> => {
        await delay(300);
        const programs = await db.getPrograms();
        const index = programs.findIndex((p) => p.id == updatedProgram.id);
        if (index !== -1) {
            programs[index] = updatedProgram;
            localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(programs));
        }
        return updatedProgram;
    },

    deleteProgram: async (id: string | number): Promise<void> => {
        await delay(300);
        let programs = await db.getPrograms();
        programs = programs.filter(p => p.id != id);
        localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(programs));
    },

    // Projects
    getProjects: async (): Promise<Project[]> => {
        await delay(300);
        const stored = localStorage.getItem(KEYS.PROJECTS);
        if (!stored) {
            localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
            return INITIAL_PROJECTS;
        }
        return JSON.parse(stored);
    },

    createProject: async (project: Omit<Project, "id" | "stats">): Promise<Project> => {
        await delay(300);
        const projects = await db.getProjects();
        const newProject: Project = {
            ...project,
            id: Math.max(...projects.map(p => Number(p.id)), 0) + 1,
            stats: {
                duration: "New Project",
                beneficiaries: "0",
                partners: "None",
                outcomes: "Starting..."
            }
        };
        projects.push(newProject);
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
        return newProject;
    },

    updateProject: async (updatedProject: Project): Promise<Project> => {
        await delay(300);
        const projects = await db.getProjects();
        const index = projects.findIndex((p: Project) => p.id == updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
        }
        return updatedProject;
    },

    deleteProject: async (id: string | number): Promise<void> => {
        await delay(300);
        let projects = await db.getProjects();
        projects = projects.filter(p => p.id != id);
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    },

    // Blog Posts
    getBlogPosts: async (): Promise<BlogPost[]> => {
        await delay(300);
        const stored = localStorage.getItem(KEYS.BLOG);
        if (!stored) {
            localStorage.setItem(KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
            return INITIAL_BLOG_POSTS;
        }
        return JSON.parse(stored);
    },

    createBlogPost: async (post: Omit<BlogPost, "id" | "publishedAt">): Promise<BlogPost> => {
        await delay(300);
        const posts = await db.getBlogPosts();
        // Generate a string ID since existing ones are strings "1", "2"
        const newId = (Math.max(...posts.map(p => Number(p.id)), 0) + 1).toString();

        const newPost: BlogPost = {
            ...post,
            id: newId,
            publishedAt: new Date(), // Set current date for new posts
        };
        posts.push(newPost);
        localStorage.setItem(KEYS.BLOG, JSON.stringify(posts));
        return newPost;
    },

    updateBlogPost: async (updatedPost: BlogPost): Promise<BlogPost> => {
        await delay(300);
        const posts = await db.getBlogPosts();
        const index = posts.findIndex((p) => p.id == updatedPost.id);
        if (index !== -1) {
            posts[index] = updatedPost;
            localStorage.setItem(KEYS.BLOG, JSON.stringify(posts));
        }
        return updatedPost;
    },

    deleteBlogPost: async (id: string | number): Promise<void> => {
        await delay(300);
        let posts = await db.getBlogPosts();
        posts = posts.filter(p => p.id != id);
        localStorage.setItem(KEYS.BLOG, JSON.stringify(posts));
    },

    // Staff
    getStaff: async (): Promise<Staff[]> => {
        await delay(300);
        const stored = localStorage.getItem(KEYS.STAFF);
        if (!stored) {
            localStorage.setItem(KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
            return INITIAL_STAFF;
        }
        return JSON.parse(stored);
    },

    createStaff: async (member: Omit<Staff, "id">): Promise<Staff> => {
        await delay(300);
        const staff = await db.getStaff();
        const newId = (Math.max(...staff.map(p => Number(p.id)), 0) + 1).toString();

        const newMember: Staff = {
            ...member,
            id: newId,
        };
        staff.push(newMember);
        localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
        return newMember;
    },

    updateStaff: async (updatedMember: Staff): Promise<Staff> => {
        await delay(300);
        const staff = await db.getStaff();
        const index = staff.findIndex((p) => p.id == updatedMember.id);
        if (index !== -1) {
            staff[index] = updatedMember;
            localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
        }
        return updatedMember;
    },

    deleteStaff: async (id: string | number): Promise<void> => {
        await delay(300);
        let staff = await db.getStaff();
        staff = staff.filter(p => p.id != id);
        localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
    },
};
