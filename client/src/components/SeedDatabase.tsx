import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { seedDatabase } from "@/lib/rtdb";
import { useToast } from "@/hooks/use-toast";

export default function SeedDatabase() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        try {
            // 1. Define Data (Converted from Arrays to Objects for RTDB)
            const data = {
                // Site Config
                site_config: {
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
                },

                // Blog Posts
                blog_posts: {
                    "post_1": {
                        id: "post_1",
                        title: "Breaking Barriers: How Women's Literacy Programs Transform Communities",
                        excerpt: "Discover the powerful impact of adult literacy programs in empowering women and creating ripple effects of change across entire communities.",
                        content: "Full content here...",
                        image: "/images/project_indian_literacy.png",
                        category: "Education",
                        readTime: 5,
                        publishedAt: new Date("2024-03-15").toISOString(),
                    },
                    "post_2": {
                        id: "post_2",
                        title: "Youth Leadership: Nurturing the Next Generation of Change-Makers",
                        excerpt: "Our youth leadership academy is creating a new generation of community leaders equipped with skills and vision for sustainable development.",
                        content: "Full content here...",
                        image: "/images/hero_indian_youth_education.png",
                        category: "Youth",
                        readTime: 4,
                        publishedAt: new Date("2024-03-10").toISOString(),
                    },
                    "post_3": {
                        id: "post_3",
                        title: "Community Health Champions: A Model for Sustainable Healthcare",
                        excerpt: "How training local health volunteers is creating sustainable healthcare access in underserved communities.",
                        content: "Full content here...",
                        image: "/images/hero_indian_community_health.png",
                        category: "Health",
                        readTime: 6,
                        publishedAt: new Date("2024-03-05").toISOString(),
                    }
                },

                // Programs
                programs: {
                    "prog_1": {
                        id: "prog_1",
                        title: "Women's Economic Empowerment",
                        description: "Supporting women entrepreneurs through skills training, microfinance, and market access to build sustainable livelihoods.",
                        image: "/images/hero_indian_women_empowerment_v2.png",
                        category: "Economic Development",
                        duration: "6 Months",
                        beneficiaries: "500 Women",
                        partners: "Local Gov, Women Co-ops",
                        outcomes: "Increased income, Business registrations",
                    },
                    "prog_2": {
                        id: "prog_2",
                        title: "Youth Development & Education",
                        description: "Providing quality education, mentorship, and vocational training to empower the next generation of leaders.",
                        image: "/images/hero_indian_youth_education_v2.png",
                        category: "Education",
                        duration: "1 Year",
                        beneficiaries: "1200 Students",
                        partners: "Schools, Tech Companies",
                        outcomes: "Higher pass rates, Job placements",
                    },
                    "prog_3": {
                        id: "prog_3",
                        title: "Community Health Initiatives",
                        description: "Improving access to healthcare services and health education in underserved communities across the region.",
                        image: "/images/hero_indian_community_health_v2.png",
                        category: "Health",
                        duration: "Ongoing",
                        beneficiaries: "50 Villages",
                        partners: "Health Dept, Red Cross",
                        outcomes: "Reduced mortality, Better hygiene",
                    }
                },

                // Stories
                stories: {
                    "story_1": {
                        id: "story_1",
                        name: "Priya Sharma",
                        role: "Program Beneficiary",
                        quote: "TGF's women's empowerment program gave me the skills and confidence to start my own business. Today, I employ five women from my community.",
                        image: "/images/story_indian_woman_beneficiary_1765786639910.png",
                    },
                    "story_2": {
                        id: "story_2",
                        name: "Rahul Verma",
                        role: "Community Leader",
                        quote: "The youth development initiatives have transformed our community. Our young people now have hope and opportunities for a better future.",
                        image: "/images/story_indian_youth_leader_1765786661001.png",
                    },
                    "story_3": {
                        id: "story_3",
                        name: "Anjali Gupta",
                        role: "Health Volunteer",
                        quote: "Through TGF's health programs, we've been able to reach remote villages and provide essential healthcare services to those who need it most.",
                        image: "/images/story_indian_health_worker_1765786679800.png",
                    }
                },

                // Staff
                staff: {
                    "staff_1": {
                        id: "staff_1",
                        name: "Dr. Aditi Rao",
                        role: "Executive Director",
                        bio: "Leading TGF with 15+ years of experience in community development and gender advocacy.",
                        image: "/images/team_indian_leader_female.png",
                        email: "aditi@tgf.org",
                        linkedin: "",
                        instagram: "",
                    },
                    "staff_2": {
                        id: "staff_2",
                        name: "Rajesh Kumar",
                        role: "Program Coordinator",
                        bio: "Coordinating our youth development initiatives across multiple regions with proven impact.",
                        image: "/images/team_indian_member_male.png",
                        email: "rajesh@tgf.org",
                        linkedin: "",
                        instagram: "",
                    },
                    "staff_3": {
                        id: "staff_3",
                        name: "Sneha Patel",
                        role: "Community Outreach Lead",
                        bio: "Bridging the gap between our programs and the communities we serve with passion and dedication.",
                        image: "/images/team_indian_educator_female.png",
                        email: "sneha@tgf.org",
                        linkedin: "",
                        instagram: "",
                    }
                },

                // Values, Projects, ImpactStats, Partners - Reduced for Brevity but can be added fully if needed
                // For now, let's verify these main sections first.
            };

            await seedDatabase(data);
            toast({ title: "Success", description: "Database has been seeded!" });
        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 flex justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Initialize Database</CardTitle>
                    <CardDescription>
                        Click below to populate your Firebase Realtime Database with the default website content.
                        Warning: This might overwrite existing data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleSeed}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Seeding..." : "Seed Database Now"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
