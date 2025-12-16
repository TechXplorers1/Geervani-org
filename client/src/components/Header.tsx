// client/src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "border-b shadow-sm py-5" : "py-7"
        }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ rotate: -3, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.img
                src="/logo.png"
                alt="TGF Logo"
                className="w-20 h-20 rounded-md shadow-sm"
                whileHover={{ scale: 1.05 }}
              />

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="font-heading font-bold text-3xl text-foreground hidden sm:block">
                  TGF
                </h1>
                <p className="text-sm text-muted-foreground hidden lg:block">
                  Techxplorers Global Foundation
                </p>
              </motion.div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.a
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`relative font-sans font-medium text-lg ${location === link.href
                    ? "text-primary"
                    : "text-foreground/70"
                    } hover:text-primary`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.a>
              </Link>
            ))}
          </nav>

          {/* Desktop Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" }}
            className="hidden md:block"
          >
            <Button
              variant="default"
              size="lg"
              className="font-sans font-medium px-6 py-3 text-lg"
              onClick={handleGetInvolvedClick}
            >
              Get Involved
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-6 py-5 flex flex-col space-y-5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    className={`block py-2 font-medium text-lg ${location === link.href
                      ? "text-primary"
                      : "text-foreground"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                </Link>
              ))}

              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  className="w-full text-lg py-3"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGetInvolvedClick();
                  }}
                >
                  Get Involved
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
