// client/src/pages/program-detail.tsx (or wherever this lives)

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  Program,
  InsertDonation,
  InsertContactMessage,
} from "@shared/schema";
import { insertContactMessageSchema } from "@shared/schema";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { DonateSection } from "@/components/DonateSection";

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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const programImage1 = "/images/Women_economic_empowerment_program_d8422519.png";
const programImage2 = "/images/Youth_development_program_ecd0f2bd.png";
const programImage3 = "/images/Community_health_program_b7634ba0.png";

const programImages: Record<string, string> = {
  "Women's Economic Empowerment": programImage1,
  "Youth Development & Education": programImage2,
  "Community Health Initiatives": programImage3,
};

const titleToDonationProgram: Record<string, InsertDonation["program"]> = {
  "Women's Economic Empowerment": "general",
  "Youth Development & Education": "education",
  "Community Health Initiatives": "healthcare",
};

// Extra content per program
type ProgramExtra = {
  longDescription: string;
  objectives: string[];
  impactAreas: string[];
  stats: { label: string; value: string }[];
};

const defaultExtra: ProgramExtra = {
  longDescription:
    "This program is designed to create sustainable, community-led change through training, advocacy, and direct support.",
  objectives: [
    "Provide targeted support to vulnerable communities",
    "Build local capacity",
    "Create sustainable systems beyond project funding",
  ],
  impactAreas: ["Community awareness", "Partnerships", "Long-term resilience"],
  stats: [
    { label: "People Reached", value: "1,500+" },
    { label: "Communities", value: "10+" },
    { label: "Active Projects", value: "3" },
  ],
};

// Program-specific content
const programExtraByTitle: Record<string, ProgramExtra> = {
  "Women's Economic Empowerment": {
    longDescription:
      "Empowering women with business training, microfinance, and leadership skills.",
    objectives: [
      "Train women in business and financial skills",
      "Increase access to microloans and savings groups",
      "Strengthen women's leadership",
    ],
    impactAreas: ["Livelihoods", "Financial Inclusion", "Leadership"],
    stats: [
      { label: "Women Trained", value: "800+" },
      { label: "Businesses Started", value: "250+" },
      { label: "Savings Groups", value: "35" },
    ],
  },
  "Youth Development & Education": {
    longDescription:
      "Supporting education, career guidance, and youth empowerment initiatives.",
    objectives: [
      "Improve school retention",
      "Teach leadership & digital skills",
      "Connect youth to career paths",
    ],
    impactAreas: ["Education", "Skills", "Mentoring"],
    stats: [
      { label: "Students Reached", value: "1,200+" },
      { label: "Scholarships", value: "95" },
      { label: "Youth Clubs", value: "20" },
    ],
  },
  "Community Health Initiatives": {
    longDescription:
      "Providing health education and access to essential community healthcare.",
    objectives: [
      "Increase healthcare awareness",
      "Support maternal and child health",
      "Strengthen healthcare systems",
    ],
    impactAreas: ["Health Education", "Care Support", "Hygiene"],
    stats: [
      { label: "People Reached", value: "2,000+" },
      { label: "Health Sessions", value: "150+" },
      { label: "Volunteers", value: "60+" },
    ],
  },
};

type ProgramDetailProps = {
  id: string;
};

export default function ProgramDetail({ id }: ProgramDetailProps) {
  const { toast } = useToast();

  const { data: programs, isLoading, error } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const program = programs?.find((p) => p.id === id);

  const image =
    program?.image ||
    (program && programImages[program.title]) ||
    programImage1;

  const donationProgram: InsertDonation["program"] =
    titleToDonationProgram[program?.title || ""] ?? "general";

  // Use dynamic data if available, otherwise fall back to hardcoded
  const extra: ProgramExtra =
    (program?.duration || program?.beneficiaries)
      ? {
        longDescription: program.description,
        objectives: [], // Consider adding to DB later if needed
        impactAreas: program.outcomes ? program.outcomes.split(',').map(s => s.trim()) : [],
        stats: [
          ...(program.duration ? [{ label: "Duration", value: program.duration }] : []),
          ...(program.beneficiaries ? [{ label: "Beneficiaries", value: program.beneficiaries }] : []),
          ...(program.partners ? [{ label: "Partners", value: program.partners }] : [])
        ]
      }
      : (program && programExtraByTitle[program.title]) || defaultExtra;

  // Popup states
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  // Volunteer form setup
  const volunteerForm = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: `I’d like to volunteer for ${program?.title || "TGF"}`,
      message: "",
    },
  });

  // 🔁 Keep subject in sync when program changes (after data load)
  useEffect(() => {
    volunteerForm.setValue(
      "subject",
      `I’d like to volunteer for ${program?.title || "TGF"}`
    );
  }, [program?.title, volunteerForm]);

  const volunteerMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setVolunteerSuccess(true);
      toast({
        title: "Thank you for volunteering!",
        description: "We'll contact you soon.",
      });
      volunteerForm.reset({
        name: "",
        email: "",
        subject: `I’d like to volunteer for ${program?.title || "TGF"}`,
        message: "",
      });
      setTimeout(() => setVolunteerSuccess(false), 3000);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description:
          err?.message ||
          "Failed to submit your volunteer interest. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVolunteerSubmit = (data: InsertContactMessage) =>
    volunteerMutation.mutate(data);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Loading / Error / Content */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-10">
              <Skeleton className="w-full h-72" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : error || !program ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Unable to load this program.
              </p>
              <Link href="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Program Header */}
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={image}
                    alt={program.title}
                    className="w-full h-72 md:h-96 object-cover rounded-xl shadow"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                    {program.category}
                  </span>

                  <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                    {program.title}
                  </h1>

                  <p className="text-muted-foreground mb-4 text-lg">
                    {program.description}
                  </p>

                  <p className="text-foreground/90 mb-6">
                    {extra.longDescription}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => setIsDonationDialogOpen(true)}
                    >
                      Support This Program
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsVolunteerDialogOpen(true)}
                    >
                      Volunteer With Us
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Stats Section */}
              <section className="mt-12">
                <h2 className="font-heading text-2xl mb-4">Program Snapshot</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {extra.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border p-4 shadow-sm bg-card"
                    >
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-heading">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Objectives & Impact Areas */}
              <section className="mt-12 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-xl mb-3">Key Objectives</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {extra.objectives.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-xl mb-3">Impact Areas</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {extra.impactAreas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Donation Popup */}
      <Dialog
        open={isDonationDialogOpen}
        onOpenChange={setIsDonationDialogOpen}
      >
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DonateSection initialProgram={donationProgram} />
        </DialogContent>
      </Dialog>

      {/* Volunteer Popup */}
      <Dialog
        open={isVolunteerDialogOpen}
        onOpenChange={setIsVolunteerDialogOpen}
      >
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Volunteer With Us</DialogTitle>
            <DialogDescription>
              Share your details and we’ll connect with you about volunteering
              for this program.
            </DialogDescription>
          </DialogHeader>

          <Form {...volunteerForm}>
            <form
              onSubmit={volunteerForm.handleSubmit(handleVolunteerSubmit)}
              className="space-y-5 pb-2"
            >
              {/* Hidden subject field so schema is satisfied */}
              <FormField
                control={volunteerForm.control}
                name="subject"
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value} />
                )}
              />

              <FormField
                control={volunteerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Amit Kumar" />
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
                        {...field}
                        type="email"
                        placeholder="amit@example.com"
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
                    <FormLabel>
                      How would you like to help with this program?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        placeholder="Tell us about your skills, availability, and interests..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {volunteerSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you! We’ll be in touch soon.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVolunteerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={volunteerMutation.isPending}
                >
                  {volunteerMutation.isPending
                    ? "Submitting..."
                    : "Submit Interest"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
