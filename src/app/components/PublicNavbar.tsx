import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-e1" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Involink home">
            <Logo size="md" />
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link
              to="/login"
              className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-medium text-sm lg:text-base text-foreground hover:bg-accent border border-border transition-all duration-300 cursor-pointer"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-medium text-sm lg:text-base bg-emerald-600 text-white hover:bg-emerald-700 shadow-e2 transition-all duration-300 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-card border border-border shadow-e1 flex items-center justify-center cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 sm:mt-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-e3"
          >
            <div className="space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm sm:text-base text-foreground hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm sm:text-base text-foreground font-medium cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block py-2.5 sm:py-3 rounded-xl text-center text-sm sm:text-base font-medium bg-emerald-600 text-white cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
