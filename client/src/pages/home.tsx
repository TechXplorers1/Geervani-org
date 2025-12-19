// client/src/pages/home.tsx

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import StatsSection from "@/components/StatsSection";
import ProgramsSection from "@/components/ProgramsSection";
import StoriesSection from "@/components/StoriesSection";
import { DonateSection } from "@/components/DonateSection";
import TransparencySection from "@/components/TransparencySection";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { HandHeart, Users, Handshake, CheckCircle } from "lucide-react";
import type { InsertDonation, InsertContactMessage } from "@shared/schema";
import { insertContactMessageSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
import { createContactMessage } from "@/lib/rtdb";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();

  // 🔽 Auto Scroll to target section when hash is used
  useEffect(() => {
    if (window.location.hash === "#get-involved-section") {
      const el = document.getElementById("get-involved-section");
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          100
        );
      }
    }
  }, []);

  // Donation popup
  const [donationProgram, setDonationProgram] =
    useState<InsertDonation["program"]>("general");
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);

  // Volunteer popup
  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  const volunteerForm = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "I’d like to volunteer with TGF",
      message: "",
    },
  });

  const volunteerMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) =>
      // await apiRequest("POST", "/api/contact", data),
      await createContactMessage(data),
    onSuccess: () => {
      setVolunteerSuccess(true);
      toast({
        title: "Thank you for volunteering!",
        description: "Our team will contact you within 24 hours.",
      });
      volunteerForm.reset();
      setTimeout(() => setVolunteerSuccess(false), 3000);
    },
  });

  const handleVolunteerSubmit = (data: InsertContactMessage) =>
    volunteerMutation.mutate(data);

  // Partner popup
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [partnerSuccess, setPartnerSuccess] = useState(false);

  const partnerForm = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "I’d like to partner with TGF",
      message: "",
    },
  });

  const partnerMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) =>
      // await apiRequest("POST", "/api/contact", data),
      await createContactMessage(data),
    onSuccess: () => {
      setPartnerSuccess(true);
      toast({
        title: "Thank you for your interest in partnering!",
        description: "We’ll get back to you soon.",
      });
      partnerForm.reset();
      setTimeout(() => setPartnerSuccess(false), 3000);
    },
  });

  const handlePartnerSubmit = (data: InsertContactMessage) =>
    partnerMutation.mutate(data);

  // CTA Cards
  const ctaCards = [
    {
      icon: HandHeart,
      title: "Support Our Cause",
      description:
        "Your contribution helps us create lasting change in communities across India.",
      cta: "Make a Difference",
    },
    {
      icon: Users,
      title: "Volunteer With Us",
      description:
        "Join our team of dedicated volunteers and directly impact lives in your community.",
      cta: "Join Our Team",
    },
    {
      icon: Handshake,
      title: "Partner With Us",
      description:
        "Collaborate with TGF to amplify our impact and reach more communities.",
      cta: "Become a Partner",
    },
  ];

  const handleGetInvolvedTodayClick = () => {
    document
      .getElementById("get-involved-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header transparent={true} />

      <main className="pt-0">
        <HeroCarousel />
        <StatsSection />
        <ProgramsSection />

        <StoriesSection
          onSupportChild={() => setIsDonationDialogOpen(true)}
          onVolunteer={() => setIsVolunteerDialogOpen(true)}
          onPartner={() => setIsPartnerDialogOpen(true)}
        />

        <TransparencySection />

        {/* CTA BUTTONS */}
        <section id="get-involved-section" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                How You Can Help
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                There are many ways to support our mission.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ctaCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Card
                      className="p-6 text-center flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-t-4 border-t-transparent hover:border-t-primary"
                    >
                      <Icon className="h-12 w-12 mx-auto mb-4 text-primary bg-primary/10 p-2.5 rounded-full" />
                      <h3 className="text-xl font-heading font-bold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground flex-1 font-sans">
                        {card.description}
                      </p>
                      <Button
                        className="mt-6 w-full font-medium"
                        onClick={() =>
                          card.title === "Support Our Cause"
                            ? setIsDonationDialogOpen(true)
                            : card.title === "Volunteer With Us"
                              ? setIsVolunteerDialogOpen(true)
                              : setIsPartnerDialogOpen(true)
                        }
                      >
                        {card.cta}
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DONATION POPUP */}
        <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Support Our Cause</DialogTitle>
              <DialogDescription>
                You are supporting: <strong>{donationProgram}</strong>
              </DialogDescription>
            </DialogHeader>
            <DonateSection />
          </DialogContent>
        </Dialog>

        {/* VOLUNTEER POPUP */}
        <Dialog open={isVolunteerDialogOpen} onOpenChange={setIsVolunteerDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Volunteer With Us</DialogTitle>
              <DialogDescription>
                Fill the form and we will contact you.
              </DialogDescription>
            </DialogHeader>

            <Form {...volunteerForm}>
              <form
                onSubmit={volunteerForm.handleSubmit(handleVolunteerSubmit)}
                className="space-y-4 pb-4"
              >
                <FormField
                  control={volunteerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Amit Kumar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={volunteerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="amit@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={volunteerForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How would you like to help?</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder="Describe your interests and skills"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {volunteerSuccess && (
                  <p className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Submitted
                    successfully!
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVolunteerDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={volunteerMutation.isPending}>
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* PARTNER POPUP */}
        <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partner With Us</DialogTitle>
              <DialogDescription>
                Share organization details and partnership ideas.
              </DialogDescription>
            </DialogHeader>

            <Form {...partnerForm}>
              <form
                onSubmit={partnerForm.handleSubmit(handlePartnerSubmit)}
                className="space-y-4 pb-4"
              >
                <FormField
                  control={partnerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Amit Kumar" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={partnerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <Input placeholder="amit@company.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={partnerForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partnership Details</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder="Tell us how you'd like to collaborate"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {partnerSuccess && (
                  <p className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Request submitted!
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPartnerDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={partnerMutation.isPending}>
                    Send
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
}
