import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap, Menu, X } from "lucide-react";

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
      scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Involink
            </span>
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
              className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-medium text-sm lg:text-base text-foreground hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-white/10 transition-all duration-300 cursor-pointer"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-medium text-sm lg:text-base bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-white/10 flex items-center justify-center cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 sm:mt-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-white/10"
          >
            <div className="space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm sm:text-base text-foreground hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/20" />
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
                className="block py-2.5 sm:py-3 rounded-xl text-center text-sm sm:text-base font-medium bg-emerald-500 text-white cursor-pointer"
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
