import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Users, Award } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/rtdb";
import type { Project } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Fallback if no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <main className="pt-24 min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">No projects found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                Our Projects
              </h1>
              <p className="font-sans text-lg md:text-xl text-muted-foreground">
                Transforming communities through sustainable development initiatives
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                  }}
                >
                  <Card className="overflow-hidden shadow-lg">
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                        }`}
                    >
                      {/* Full Image Section */}
                      <div
                        className={`relative w-full lg:min-h-[450px] ${index % 2 === 1 ? "lg:col-start-2" : ""
                          }`}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div
                        className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1" : ""
                          }`}
                      >
                        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
                          {project.title}
                        </h2>
                        <p className="font-sans text-muted-foreground mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        <Card className="bg-muted/40 p-6 mb-6 border-0 rounded-lg">
                          <h3 className="font-heading font-semibold text-lg mb-4">
                            Project Overview
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Calendar className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Duration</p>
                                <p className="text-sm text-muted-foreground">
                                  {project.duration}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <Users className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Beneficiaries</p>
                                <p className="text-sm text-muted-foreground">
                                  {project.beneficiaries}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <Award className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Partners</p>
                                <p className="text-sm text-muted-foreground">
                                  {project.partners}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <div>
                          <h4 className="font-heading font-semibold mb-2">
                            Key Outcomes
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {project.outcomes}
                          </p>
                        </div>
                      </div>
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
