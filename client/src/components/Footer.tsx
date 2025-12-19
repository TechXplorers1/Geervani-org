
import { Link } from "wouter";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNewsletterSubscription } from "@/lib/rtdb";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type PolicyModalType = "privacy" | "terms" | null;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState<PolicyModalType>(null);
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      // apiRequest("POST", "/api/newsletter", { email }) -> createNewsletterSubscription({ email })
      return await createNewsletterSubscription({ email });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const programs = [
    { href: "/#programs", label: "Gender Equality" },
    { href: "/#programs", label: "Youth Development" },
    { href: "/#programs", label: "Community Health" },
    { href: "/#programs", label: "Economic Empowerment" },
  ];

  const renderModalTitle = () => {
    if (openModal === "privacy") return "Privacy Policy";
    if (openModal === "terms") return "Terms of Service";
    return "";
  };

  const renderModalContent = () => {
    if (openModal === "privacy") {
      return (
        <>
          <p>
            We value your privacy. This Privacy Policy explains how TGF
            collects, uses, and protects your personal information when you
            interact with our website, programs, and services.
          </p>
          <p>
            We may collect information such as your name, email address, phone
            number, and any details you provide when subscribing to our
            newsletter, contacting us, or participating in our initiatives.
          </p>
          <p>
            Your information is used only to communicate with you, improve our
            services, and share updates about our work and impact. We do not
            sell your data to third parties.
          </p>
          <p>
            If you wish to update or delete your personal information, you can
            contact us at <span className="font-medium">inquiries@techxplorers.in</span>.
          </p>
        </>
      );
    }

    if (openModal === "terms") {
      return (
        <>
          <p>
            By accessing or using the TGF website, you agree to these Terms
            of Service. Please read them carefully before using our site.
          </p>
          <p>
            The content on this website is provided for informational and
            educational purposes only. You agree not to misuse the site, attempt
            to interfere with its operation, or use it for unlawful activities.
          </p>
          <p>
            TGF reserves the right to update or modify these terms at any
            time. Continued use of the website after changes means you accept
            the updated terms.
          </p>
          <p>
            If you have any questions about these terms, please contact us at{" "}
            <span className="font-medium">inquiries@techxplorers.in</span>.
          </p>
        </>
      );
    }

    return null;
  };

  return (
    <footer className="relative bg-card border-t border-card-border overflow-hidden">
      {/* background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="wave-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 50 Q 25 25, 50 50 T 100 50"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand + social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="TGF Logo"
                className="w-16 h-16 rounded-md shadow-sm"
              />
              <h3 className="font-heading font-bold text-xl">TGF</h3>
            </div>
            <p className="text-muted-foreground mb-4 font-sans text-sm">
              Community Advocacy for Gender and Development. Empowering Indian
              communities through sustainable programs and initiatives.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-testid="button-social-facebook"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-testid="button-social-twitter"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-testid="button-social-instagram"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                data-testid="button-social-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a
                      className="text-muted-foreground hover:text-primary transition-colors font-sans text-sm"
                      data-testid={`link-footer-${link.label
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4">
              Our Programs
            </h4>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program.label}>
                  <a
                    href={program.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-sans text-sm"
                    data-testid={`link-program-${program.label
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {program.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter + contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4">
              Stay Connected
            </h4>
            <p className="text-muted-foreground mb-4 font-sans text-sm">
              Subscribe to our newsletter for updates on our programs and
              impact.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-sans"
                data-testid="input-newsletter-email"
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="default"
                className="w-full font-sans font-medium"
                disabled={newsletterMutation.isPending}
                data-testid="button-newsletter-subscribe"
              >
                {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="font-sans">inquiries@techxplorers.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="font-sans">+91 85220 90765</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="font-sans">Maruthi Nagar 3rd cross, Near Panda Mini mart, Anantapur, 515001</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground font-sans">
              © {new Date().getFullYear()} TGF. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button
                type="button"
                onClick={() => setOpenModal("privacy")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setOpenModal("terms")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Single Policy / Terms Modal */}
      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-dialog-title"
        >
          <div className="relative w-full max-w-lg rounded-xl bg-background p-6 shadow-lg max-h-[80vh] flex flex-col">
            <button
              type="button"
              onClick={() => setOpenModal(null)}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-accent"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <h2
              id="policy-dialog-title"
              className="font-heading text-lg font-semibold mb-3 pr-8"
            >
              {renderModalTitle()}
            </h2>
            <div className="mt-1 space-y-3 text-sm text-muted-foreground overflow-y-auto pr-2">
              {renderModalContent()}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="default"
                onClick={() => setOpenModal(null)}
                className="font-sans text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
