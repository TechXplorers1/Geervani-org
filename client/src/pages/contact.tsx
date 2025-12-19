import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertContactMessageSchema,
  type InsertContactMessage,
} from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";

// import { apiRequest } from "@/lib/queryClient";
import { createContactMessage, getSiteConfig } from "@/lib/rtdb";
import { useToast } from "@/hooks/use-toast";

import { type SiteConfig } from "@shared/schema";

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const { data: config } = useQuery<SiteConfig>({
    queryKey: ["site-config"],
    queryFn: async () => await getSiteConfig()
  });

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      // return await apiRequest("POST", "/api/contact", data);
      return await createContactMessage(data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: config?.email || "inquiries@techxplorers.in",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      content: config?.phone || "+91 85220 90765",
      description: "Mon–Fri from 9am to 6pm IST",
    },
    {
      icon: MapPin,
      title: "Office",
      content: config?.address || "Anantapur, 515001",
      description: "Maruthi Nagar 3rd cross, Near Panda Mini mart",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: config?.workingHours || "Monday – Friday",
      description: "9:00 AM – 6:00 PM IST",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="pt-28 md:pt-32">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
                {config?.contactHeroTitle || "Get in Touch"}
              </h1>
              <p className="font-sans text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {config?.contactHeroSubtitle || "Have questions or want to get involved? We'd love to hear from you."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form and Contact Info */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="space-y-6"
              >
                <h2 className="font-heading font-bold text-3xl mb-2">
                  {config?.contactFormTitle || "Send us a message"}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-6">
                  {config?.contactFormSubtitle || "Fill out the form below and we'll get back to you within 24 hours."}
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Amit Kumar" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="amit@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              rows={6}
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Sending..." : isSuccess ? "Message Sent!" : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="space-y-4"
              >
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{info.title}</h3>
                          <p className="font-medium">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
