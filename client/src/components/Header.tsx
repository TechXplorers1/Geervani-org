// client/src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [location, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use transparent style only if prop is true AND not scrolled
  const isTransparent = transparent && !isScrolled;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/events", label: "Events" }, // Added
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const handleGetInvolvedClick = () => {
    if (location === "/") {
      // Already on home → smooth scroll
      document
        .getElementById("get-involved-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Go to home with hash; Home page will handle scrolling
      navigate("/#get-involved-section");
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
        ? "bg-transparent py-4 md:py-6"
        : "bg-white/95 backdrop-blur-md shadow-sm py-2"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="/logo.png"
                alt="RSF Logo"
                className={`transition-all duration-300 object-contain rounded-md ${isTransparent ? "w-12 h-12 md:w-16 md:h-16" : "w-10 h-10 rounded-full"
                  }`}
              />

              <div className={`flex flex-col justify-center transition-all duration-300 ${isTransparent ? "opacity-100" : "opacity-100"}`}>
                <h1 className={`font-heading font-bold leading-none tracking-tight ${isTransparent ? "text-white text-2xl md:text-3xl drop-shadow-md" : "text-gray-900 text-lg"
                  }`}>
                  RSF
                </h1>
                {/* Hide full name on scroll to save space, show at top */}
                <p className={`text-[10px] uppercase font-bold tracking-widest hidden sm:block leading-none mt-1 ${isTransparent ? "text-white/90 drop-shadow-sm" : "text-gray-600"
                  }`}>
                  ROOTSPRING FOUNDATION
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`relative font-medium text-[15px] transition-colors ${location === link.href
                    ? (isTransparent ? "text-white font-bold drop-shadow-md" : "text-primary font-semibold")
                    : (isTransparent ? "text-white/80 hover:text-white hover:drop-shadow-md" : "text-gray-600 hover:text-primary")
                    }`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="navUnderline"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isTransparent ? "bg-white" : "bg-primary"}`}
                    />
                  )}
                </a>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant={isTransparent ? "secondary" : "default"}
              size={isTransparent ? "default" : "sm"}
              className={`font-medium rounded-full px-6 transition-all ${isTransparent && "bg-white text-primary hover:bg-white/90 shadow-lg"
                }`}
              onClick={handleGetInvolvedClick}
            >
              Get Involved
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-full transition-colors ${isTransparent ? "bg-black/20 text-white hover:bg-black/30" : "hover:bg-gray-100 text-gray-900"
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-xl z-40 border-t"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`text-xl font-medium ${location === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Button
                className="w-full rounded-full text-lg py-6"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleGetInvolvedClick();
                }}
              >
                Get Involved
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
