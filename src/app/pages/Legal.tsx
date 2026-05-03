import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap, Shield, FileText, Cookie, ArrowRight } from "lucide-react";

const legalDocs = [
  {
    icon: Shield,
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal information.",
    link: "/privacy"
  },
  {
    icon: FileText,
    title: "Terms of Service",
    description: "The rules and guidelines for using Involink's services.",
    link: "/terms"
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    description: "Understanding how we use cookies to improve your experience.",
    link: "/cookies"
  }
];

export default function Legal() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Involink</span>
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="text-emerald-500">Legal</span> Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Important policies and legal information about using Involink.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            {legalDocs.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={doc.link}
                  className="block p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <doc.icon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2 group-hover:text-emerald-500 transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {doc.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">{doc.description}</p>
                      <span className="inline-flex items-center gap-2 text-emerald-500 font-medium">
                        Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Compliance
            </h2>
            <p className="text-muted-foreground mb-6">
              Involink is committed to complying with all applicable Nigerian laws and regulations, including:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Nigeria Data Protection Regulation (NDPR)
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Central Bank of Nigeria (CBN) Guidelines
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Nigerian Financial Services Act
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Consumer Protection Council Act
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Questions About Our Policies?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              If you have any questions about our legal policies, please don't hesitate to contact our legal team.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-600 font-semibold hover:bg-white/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-t border-white/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 Involink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
