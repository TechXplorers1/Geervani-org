import { useQuery } from "@tanstack/react-query";
import { getSiteConfig, getTeam } from "@/lib/rtdb";
import { SiteConfig, Value, Staff } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrusteesSection from "@/components/TrusteesSection";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Users,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const { data: config } = useQuery<SiteConfig>({
    queryKey: ["site-config"],
    queryFn: async () => await getSiteConfig()
  });

  /* const { data: values = [] } = useQuery<Value[]>({
    queryKey: ["/api/values"],
  }); */

  const { data: team = [] } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getTeam,
  });

  /* const IconMap: Record<string, any> = {
    Target,
    Eye,
    Heart,
    Users,
  }; */

  const values = [
    {
      icon: Target,
      title: "Empowerment",
      description:
        "We believe in equipping communities with the tools and knowledge to drive their own development.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "We maintain open communication and accountability in all our programs and partnerships.",
    },
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach our work with empathy, understanding the unique challenges each community faces.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We partner with local communities, organizations, and stakeholders to maximize impact.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="pt-24">
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                About RSF
              </h1>
              <p className="font-sans text-lg md:text-xl text-muted-foreground">
                Community Advocacy for Gender and Development
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                  Our Mission
                </h2>
                <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                  To empower African communities through sustainable development
                  programs that promote gender equality, youth development, and
                  economic empowerment. We work alongside local communities to
                  create lasting change that transforms lives and builds
                  resilient societies.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                  Our Vision
                </h2>
                <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                  A future where every community in Africa has equal access to
                  opportunities, resources, and the power to shape their own
                  development. We envision thriving communities where gender
                  equality is the norm, youth are empowered to lead, and
                  sustainable development is a reality.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                  Our Approach
                </h2>
                <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                  We believe in community-led development. Our approach centers
                  on listening to the voices of those we serve, partnering with
                  local leaders, and implementing programs that address the root
                  causes of inequality and poverty. Through capacity building,
                  advocacy, and direct service delivery, we create sustainable
                  impact that extends beyond our immediate interventions.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Our Values
              </h2>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide our work and define who we are as an
                organization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Card className="p-6 h-full hover-elevate active-elevate-2 transition-all">
                      <div className="bg-primary/10 inline-flex p-3 rounded-lg mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-xl mb-3">
                        {value.title}
                      </h3>
                      <p className="font-sans text-muted-foreground">
                        {value.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <TrusteesSection />

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Meet Our Team
              </h2>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                Dedicated professionals committed to creating sustainable change
                in communities across Africa.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card className="overflow-hidden h-full hover-elevate active-elevate-2 transition-all">
                    <div className="relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <motion.div
                        className="absolute inset-0 bg-primary/90 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      >
                        {member.email && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10"
                            data-testid={`button-team-email-${index}`}
                            aria-label="Email"
                            asChild
                          >
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {member.linkedin && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10"
                            data-testid={`button-team-linkedin-${index}`}
                            aria-label="LinkedIn"
                            asChild
                          >
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {member.instagram && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10"
                            data-testid={`button-team-instagram-${index}`}
                            aria-label="Instagram"
                            asChild
                          >
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                              <Instagram className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-xl mb-1">
                        {member.name}
                      </h3>
                      <p className="text-primary font-sans font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="font-sans text-muted-foreground text-sm">
                        {member.bio}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
