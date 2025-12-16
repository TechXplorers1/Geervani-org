import {
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type ContactMessage,
  type InsertContactMessage,
  type BlogPost,
  type Program,
  type Story,
  type InsertStory,
  type InsertProgram,
  type InsertBlogPost,
  type SiteConfig,
  type InsertSiteConfig,
  type Donation,
  type InsertDonation,
  type Value,
  type InsertValue,
  type Staff,
  type InsertStaff,
  type Project,
  type InsertProject,
  type ImpactStat,
  type InsertImpactStat,
  type Partner,
  type InsertPartner,
  type Trustee,
  type InsertTrustee,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: string): Promise<void>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  getAllPrograms(): Promise<Program[]>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;
  getAllStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: string, story: Partial<InsertStory>): Promise<Story>;
  deleteStory(id: string): Promise<void>;
  getSiteConfig(): Promise<SiteConfig>;
  updateSiteConfig(config: Partial<InsertSiteConfig>): Promise<SiteConfig>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  getAllDonations(): Promise<Donation[]>;
  // Staff
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(id: string): Promise<void>;
  // Trustees
  getAllTrustees(): Promise<Trustee[]>;
  createTrustee(trustee: InsertTrustee): Promise<Trustee>;
  updateTrustee(id: string, trustee: Partial<InsertTrustee>): Promise<Trustee>;
  deleteTrustee(id: string): Promise<void>;
  // Events
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  // Values
  getAllValues(): Promise<Value[]>;
  createValue(value: InsertValue): Promise<Value>;
  updateValue(id: string, value: Partial<InsertValue>): Promise<Value>;
  deleteValue(id: string): Promise<void>;
  // Projects
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  // Impact Stats
  getAllImpactStats(): Promise<ImpactStat[]>;
  createImpactStat(stat: InsertImpactStat): Promise<ImpactStat>;
  updateImpactStat(id: string, stat: Partial<InsertImpactStat>): Promise<ImpactStat>;
  deleteImpactStat(id: string): Promise<void>;
  // Partners
  getAllPartners(): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, partner: Partial<InsertPartner>): Promise<Partner>;
  deletePartner(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private contactMessages: Map<string, ContactMessage>;
  private blogPosts: Map<string, BlogPost>;
  private programs: Map<string, Program>;
  private stories: Map<string, Story>;
  private donations: Map<string, Donation>;
  private staff: Map<string, Staff>;
  private trustees: Map<string, Trustee>;
  private events: Map<string, Event>;
  private values: Map<string, Value>;
  private projects: Map<string, Project>;
  private impactStats: Map<string, ImpactStat>;
  private partners: Map<string, Partner>;
  private siteConfig: SiteConfig;

  constructor() {
    this.newsletterSubscriptions = new Map();
    this.contactMessages = new Map();
    this.blogPosts = new Map();
    this.programs = new Map();
    this.stories = new Map();
    this.donations = new Map();
    this.staff = new Map();
    this.trustees = new Map();
    this.events = new Map();
    this.values = new Map();
    this.projects = new Map();
    this.impactStats = new Map();
    this.partners = new Map();
    this.siteConfig = {
      id: 1,
      email: "inquiries@techxplorers.in",
      phone: "+91 85220 90765",
      address: "Maruthi Nagar 3rd cross, Near Panda Mini mart, Anantapur, 515001",
      workingHours: "Monday – Friday, 9:00 AM – 6:00 PM IST",
      contactHeroTitle: "Get in Touch",
      contactHeroSubtitle: "Have questions or want to get involved? We'd love to hear from you.",
      contactFormTitle: "Send us a message",
      contactFormSubtitle: "Fill out the form below and we'll get back to you within 24 hours.",
      aboutHeroTitle: "About TGF",
      aboutHeroSubtitle: "Community Advocacy for Gender and Development",
      missionTitle: "Our Mission",
      missionDescription: "To empower African communities through sustainable development programs that promote gender equality, youth development, and economic empowerment. We work alongside local communities to create lasting change that transforms lives and builds resilient societies.",
      visionTitle: "Our Vision",
      visionDescription: "A future where every community in Africa has equal access to opportunities, resources, and the power to shape their own development. We envision thriving communities where gender equality is the norm, youth are empowered to lead, and sustainable development is a reality.",
      approachTitle: "Our Approach",
      approachDescription: "We believe in community-led development. Our approach centers on listening to the voices of those we serve, partnering with local leaders, and implementing programs that address the root causes of inequality and poverty. Through capacity building, advocacy, and direct service delivery, we create sustainable impact that extends beyond our immediate interventions.",
      valuesTitle: "Our Values",
      valuesDescription: "The principles that guide our work and define who we are as an organization.",
      teamTitle: "Meet Our Team",
      teamDescription: "Dedicated professionals committed to creating sustainable change in communities across Africa.",
    };
    this.seedData();
  }

  private seedData() {
    const blogImage = "/images/project_indian_literacy.png";
    const programImage1 = "/images/hero_indian_women_empowerment_v2.png";
    const programImage2 = "/images/hero_indian_youth_education_v2.png";
    const programImage3 = "/images/hero_indian_community_health_v2.png";

    const blogPosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "Breaking Barriers: How Women's Literacy Programs Transform Communities",
        excerpt: "Discover the powerful impact of adult literacy programs in empowering women and creating ripple effects of change across entire communities.",
        content: "Full content here...",
        image: "/images/project_indian_literacy.png",
        category: "Education",
        readTime: 5,
        publishedAt: new Date("2024-03-15"),
      },
      {
        id: randomUUID(),
        title: "Youth Leadership: Nurturing the Next Generation of Change-Makers",
        excerpt: "Our youth leadership academy is creating a new generation of community leaders equipped with skills and vision for sustainable development.",
        content: "Full content here...",
        image: "/images/hero_indian_youth_education.png",
        category: "Youth",
        readTime: 4,
        publishedAt: new Date("2024-03-10"),
      },
      {
        id: randomUUID(),
        title: "Community Health Champions: A Model for Sustainable Healthcare",
        excerpt: "How training local health volunteers is creating sustainable healthcare access in underserved communities.",
        content: "Full content here...",
        image: "/images/hero_indian_community_health.png",
        category: "Health",
        readTime: 6,
        publishedAt: new Date("2024-03-05"),
      },
    ];

    const programs: Program[] = [
      {
        id: randomUUID(),
        title: "Women's Economic Empowerment",
        description: "Supporting women entrepreneurs through skills training, microfinance, and market access to build sustainable livelihoods.",
        image: programImage1,
        category: "Economic Development",
        duration: "6 Months",
        beneficiaries: "500 Women",
        partners: "Local Gov, Women Co-ops",
        outcomes: "Increased income, Business registrations",
      },
      {
        id: randomUUID(),
        title: "Youth Development & Education",
        description: "Providing quality education, mentorship, and vocational training to empower the next generation of leaders.",
        image: programImage2,
        category: "Education",
        duration: "1 Year",
        beneficiaries: "1200 Students",
        partners: "Schools, Tech Companies",
        outcomes: "Higher pass rates, Job placements",
      },
      {
        id: randomUUID(),
        title: "Community Health Initiatives",
        description: "Improving access to healthcare services and health education in underserved communities across the region.",
        image: programImage3,
        category: "Health",
        duration: "Ongoing",
        beneficiaries: "50 Villages",
        partners: "Health Dept, Red Cross",
        outcomes: "Reduced mortality, Better hygiene",
      },
    ];

    const stories: Story[] = [
      {
        id: randomUUID(),
        name: "Priya Sharma",
        role: "Program Beneficiary",
        quote: "TGF's women's empowerment program gave me the skills and confidence to start my own business. Today, I employ five women from my community.",
        image: "/images/story_indian_woman_beneficiary_1765786639910.png",
      },
      {
        id: randomUUID(),
        name: "Rahul Verma",
        role: "Community Leader",
        quote: "The youth development initiatives have transformed our community. Our young people now have hope and opportunities for a better future.",
        image: "/images/story_indian_youth_leader_1765786661001.png",
      },
      {
        id: randomUUID(),
        name: "Anjali Gupta",
        role: "Health Volunteer",
        quote: "Through TGF's health programs, we've been able to reach remote villages and provide essential healthcare services to those who need it most.",
        image: "/images/story_indian_health_worker_1765786679800.png",
      },
    ];

    const initialStaff: Staff[] = [
      {
        id: randomUUID(),
        name: "Dr. Aditi Rao",
        role: "Executive Director",
        bio: "Leading TGF with 15+ years of experience in community development and gender advocacy.",
        image: "/images/team_indian_leader_female.png",
        email: "aditi@tgf.org",
        linkedin: "",
        instagram: "",
      },
      {
        id: randomUUID(),
        name: "Rajesh Kumar",
        role: "Program Coordinator",
        bio: "Coordinating our youth development initiatives across multiple regions with proven impact.",
        image: "/images/team_indian_member_male.png",
        email: "rajesh@tgf.org",
        linkedin: "",
        instagram: "",
      },
      {
        id: randomUUID(),
        name: "Sneha Patel",
        role: "Community Outreach Lead",
        bio: "Bridging the gap between our programs and the communities we serve with passion and dedication.",
        image: "/images/team_indian_educator_female.png",
        email: "sneha@tgf.org",
        linkedin: "",
        instagram: "",
      },
    ];

    const initialValues: Value[] = [
      {
        id: randomUUID(),
        title: "Empowerment",
        description: "We believe in equipping communities with the tools and knowledge to drive their own development.",
        icon: "Target",
        order: 1,
      },
      {
        id: randomUUID(),
        title: "Transparency",
        description: "We maintain open communication and accountability in all our programs and partnerships.",
        icon: "Eye",
        order: 2,
      },
      {
        id: randomUUID(),
        title: "Compassion",
        description: "We approach our work with empathy, understanding the unique challenges each community faces.",
        icon: "Heart",
        order: 3,
      },
      {
        id: randomUUID(),
        title: "Collaboration",
        description: "We partner with local communities, organizations, and stakeholders to maximize impact.",
        icon: "Users",
        order: 4,
      },
      {
        id: randomUUID(),
        title: "Collaboration",
        description: "We partner with local communities, organizations, and stakeholders to maximize impact.",
        icon: "Users",
        order: 4,
      },
    ];

    const initialProjects: Project[] = [
      {
        id: randomUUID(),
        title: "Clean Water & Sanitation",
        category: "Infrastructure",
        description: "Installing sustainable handpumps and sanitation facilities in drought-prone villages.",
        image: "/images/project_clean_water_india.png",
        duration: "2023 - Present",
        beneficiaries: "15,000+ villagers",
        partners: "Local Panchayats, WaterAid",
        outcomes: "50+ pumps installed, 90% reduction in waterborne diseases",
      },
      {
        id: randomUUID(),
        title: "Digital Literacy Mission",
        category: "Education",
        description: "Bridging the digital divide by providing tablets and smart classrooms to rural schools.",
        image: "/images/project_digital_literacy_india.png",
        duration: "2022 - Present",
        beneficiaries: "8,000+ students",
        partners: "Tech Corp CSR, State Education Dept",
        outcomes: "40 smart classrooms established, 95% student engagement rate",
      },
    ];

    const initialImpactStats: ImpactStat[] = [
      {
        id: randomUUID(),
        label: "Lives Impacted",
        value: 15000,
        suffix: "+",
        icon: "Users",
        order: 1,
      },
      {
        id: randomUUID(),
        label: "Active Programs",
        value: 250,
        suffix: "+",
        icon: "Heart",
        order: 2,
      },
      {
        id: randomUUID(),
        label: "Years of Service",
        value: 12,
        suffix: "",
        icon: "Award",
        order: 3,
      },
      {
        id: randomUUID(),
        label: "Success Rate",
        value: 95,
        suffix: "%",
        icon: "TrendingUp",
        order: 4,
      },
    ];

    const initialPartners: Partner[] = [
      {
        id: randomUUID(),
        name: "UN Women",
        logo: "/images/logo.png",
        category: "Funding",
        website: "https://www.unwomen.org",
      },
    ];

    const initialTrustees: Trustee[] = [
      {
        id: randomUUID(),
        name: "Dr. Meera Reddy",
        role: "Chairperson",
        category: "Board of Trustees",
        bio: "Leading the board with a vision for sustainable community development and over 20 years of experience in the nonprofit sector.",
        image: "/images/team_indian_leader_female.png",
        linkedin: "",
      },
      {
        id: randomUUID(),
        name: "Rajesh Kumar",
        role: "Secretary",
        category: "Board of Trustees",
        bio: "Dedicated to ensuring transparent and effective governance, bringing valuable legal and administrative expertise.",
        image: "/images/team_indian_member_male.png",
        linkedin: "",
      },
      {
        id: randomUUID(),
        name: "Priya Patel",
        role: "Advisory Member",
        category: "Advisory Board",
        bio: "Providing strategic guidance on educational initiatives and community outreach programs.",
        image: "/images/team_indian_educator_female.png",
        linkedin: "",
      },
    ];

    const initialEvents: Event[] = [
      {
        id: randomUUID(),
        title: "Annual Community Health Camp",
        description: "Free health check-ups and awareness sessions for rural communities.",
        date: new Date("2025-01-15T09:00:00"),
        location: "Anantapur District Center",
        image: "/images/hero_indian_community_health_v2.png",
      },
      {
        id: randomUUID(),
        title: "Women's Day Entrepreneurship Summit",
        description: "Celebrating women entrepreneurs with workshops and networking.",
        date: new Date("2024-03-08T10:00:00"), // Past event
        location: "City Hall, Anantapur",
        image: "/images/hero_indian_women_empowerment_v2.png",
      },
    ];

    blogPosts.forEach(post => this.blogPosts.set(post.id, post));
    programs.forEach(program => this.programs.set(program.id, program));
    stories.forEach(story => this.stories.set(story.id, story));
    initialStaff.forEach(s => this.staff.set(s.id, s));
    initialTrustees.forEach(t => this.trustees.set(t.id, t));
    initialEvents.forEach(e => this.events.set(e.id, e));
    initialValues.forEach(v => this.values.set(v.id, v));
    initialProjects.forEach(p => this.projects.set(p.id, p));
    initialImpactStats.forEach(s => this.impactStats.set(s.id, s));
    initialPartners.forEach(p => this.partners.set(p.id, p));
  }

  // ... (previous methods)

  async getSiteConfig(): Promise<SiteConfig> {
    return this.siteConfig;
  }

  async updateSiteConfig(config: Partial<InsertSiteConfig>): Promise<SiteConfig> {
    this.siteConfig = { ...this.siteConfig, ...config };
    return this.siteConfig;
  }

  async createNewsletterSubscription(
    insertSubscription: InsertNewsletterSubscription
  ): Promise<NewsletterSubscription> {
    const existing = await this.getNewsletterSubscriptionByEmail(insertSubscription.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      subscribedAt: new Date(),
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscriptionByEmail(
    email: string
  ): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      (sub) => sub.email === email
    );
  }

  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).sort(
      (a, b) => (b.subscribedAt?.getTime() || 0) - (a.subscribedAt?.getTime() || 0)
    );
  }

  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteContactMessage(id: string): Promise<void> {
    this.contactMessages.delete(id);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  async createBlogPost(insertPost: any): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updatePost: Partial<any>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) throw new Error("Blog post not found");
    const updated = { ...existing, ...updatePost };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    this.blogPosts.delete(id);
  }

  async getAllPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }

  async createProgram(insertProgram: any): Promise<Program> {
    const id = randomUUID();
    const program: Program = {
      ...insertProgram,
      id,
    };
    this.programs.set(id, program);
    return program;
  }

  async updateProgram(id: string, updateProgram: Partial<any>): Promise<Program> {
    const existing = this.programs.get(id);
    if (!existing) throw new Error("Program not found");
    const updated = { ...existing, ...updateProgram };
    this.programs.set(id, updated);
    return updated;
  }

  async deleteProgram(id: string): Promise<void> {
    this.programs.delete(id);
  }

  async getAllStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: new Date(),
      donorName: insertDonation.donorName ?? null, // Ensure explicit null if undefined
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  // Staff Methods
  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = randomUUID();
    const staff: Staff = {
      ...insertStaff,
      id,
      email: insertStaff.email ?? null,
      linkedin: insertStaff.linkedin ?? null,
      instagram: insertStaff.instagram ?? null,
    };
    this.staff.set(id, staff);
    return staff;
  }

  async updateStaff(id: string, updateStaff: Partial<InsertStaff>): Promise<Staff> {
    const existing = this.staff.get(id);
    if (!existing) throw new Error("Staff member not found");
    const updated: Staff = {
      ...existing,
      ...updateStaff,
      email: updateStaff.email === undefined ? existing.email : (updateStaff.email ?? null),
      linkedin: updateStaff.linkedin === undefined ? existing.linkedin : (updateStaff.linkedin ?? null),
      instagram: updateStaff.instagram === undefined ? existing.instagram : (updateStaff.instagram ?? null),
    };
    this.staff.set(id, updated);
    return updated;
  }

  async deleteStaff(id: string): Promise<void> {
    this.staff.delete(id);
  }

  // Trustees Methods
  async getAllTrustees(): Promise<Trustee[]> {
    return Array.from(this.trustees.values());
  }

  async createTrustee(insertTrustee: InsertTrustee): Promise<Trustee> {
    const id = randomUUID();
    const trustee: Trustee = {
      ...insertTrustee,
      id,
      linkedin: insertTrustee.linkedin ?? null,
    };
    this.trustees.set(id, trustee);
    return trustee;
  }

  async updateTrustee(id: string, updateTrustee: Partial<InsertTrustee>): Promise<Trustee> {
    const existing = this.trustees.get(id);
    if (!existing) throw new Error("Trustee not found");
    const updated: Trustee = {
      ...existing,
      ...updateTrustee,
      linkedin: updateTrustee.linkedin === undefined ? existing.linkedin : (updateTrustee.linkedin ?? null),
    };
    this.trustees.set(id, updated);
    return updated;
  }

  async deleteTrustee(id: string): Promise<void> {
    this.trustees.delete(id);
  }

  // Events Methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updateEvent: Partial<InsertEvent>): Promise<Event> {
    const existing = this.events.get(id);
    if (!existing) throw new Error("Event not found");
    const updated: Event = {
      ...existing,
      ...updateEvent,
    };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    this.events.delete(id);
  }

  // Values Methods
  async getAllValues(): Promise<Value[]> {
    return Array.from(this.values.values()).sort((a, b) => a.order - b.order);
  }

  async createValue(insertValue: InsertValue): Promise<Value> {
    const id = randomUUID();
    const value: Value = {
      ...insertValue,
      id,
      order: insertValue.order ?? 0,
    };
    this.values.set(id, value);
    return value;
  }

  async updateValue(id: string, updateValue: Partial<InsertValue>): Promise<Value> {
    const existing = this.values.get(id);
    if (!existing) throw new Error("Value not found");
    const updated: Value = {
      ...existing,
      ...updateValue,
      order: updateValue.order ?? existing.order,
    };
    this.values.set(id, updated);
    return updated;
  }

  async deleteValue(id: string): Promise<void> {
    this.values.delete(id);
  }

  // Projects Methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateProject: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");
    const updated = { ...existing, ...updateProject };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // Impact Stats Methods
  async getAllImpactStats(): Promise<ImpactStat[]> {
    return Array.from(this.impactStats.values()).sort((a, b) => a.order - b.order);
  }

  async createImpactStat(insertStat: InsertImpactStat): Promise<ImpactStat> {
    const id = randomUUID();
    const stat: ImpactStat = {
      ...insertStat,
      id,
      order: insertStat.order ?? 0,
    };
    this.impactStats.set(id, stat);
    return stat;
  }

  async updateImpactStat(id: string, updateStat: Partial<InsertImpactStat>): Promise<ImpactStat> {
    const existing = this.impactStats.get(id);
    if (!existing) throw new Error("Impact Stat not found");
    const updated = { ...existing, ...updateStat };
    this.impactStats.set(id, updated);
    return updated;
  }

  async deleteImpactStat(id: string): Promise<void> {
    this.impactStats.delete(id);
  }

  // Partners Methods
  async getAllPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const id = randomUUID();
    const partner: Partner = {
      ...insertPartner,
      id,
      website: insertPartner.website ?? null,
    };
    this.partners.set(id, partner);
    return partner;
  }

  async updatePartner(id: string, updatePartner: Partial<InsertPartner>): Promise<Partner> {
    const existing = this.partners.get(id);
    if (!existing) throw new Error("Partner not found");
    const updated = {
      ...existing,
      ...updatePartner,
      website: updatePartner.website === undefined ? existing.website : (updatePartner.website ?? null)
    };
    this.partners.set(id, updated);
    return updated;
  }

  async deletePartner(id: string): Promise<void> {
    this.partners.delete(id);
  }
  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      ...insertStory,
      id,
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: string, updateStory: Partial<InsertStory>): Promise<Story> {
    const existing = this.stories.get(id);
    if (!existing) throw new Error("Story not found");
    const updated = { ...existing, ...updateStory };
    this.stories.set(id, updated);
    return updated;
  }

  async deleteStory(id: string): Promise<void> {
    this.stories.delete(id);
  }
}

export const storage = new MemStorage();
