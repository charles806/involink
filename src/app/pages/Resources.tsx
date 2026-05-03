import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap, Book, Video, MessageCircle, FileText, Download, ExternalLink } from "lucide-react";

const resources = {
  documentation: [
    { title: "Getting Started Guide", description: "Learn the basics of setting up your account and creating your first invoice." },
    { title: "Invoice Templates", description: "Explore our collection of professional invoice templates." },
    { title: "Payment Integration Setup", description: "Step-by-step guide to connecting payment gateways." },
    { title: "API Reference", description: "Technical documentation for developers integrating with Involink." },
  ],
  videos: [
    { title: "How to Create Your First Invoice", duration: "3:45" },
    { title: "Setting Up Payment Links", duration: "4:20" },
    { title: "Using the Client Portal", duration: "5:10" },
    { title: "Understanding Your Dashboard", duration: "6:30" },
  ],
  guides: [
    { title: "Invoice Best Practices", description: "Tips for getting paid faster" },
    { title: "Nigerian Tax Guide for Freelancers", description: "Understanding your tax obligations" },
    { title: "Accepting International Payments", description: "How to get paid in USD and other currencies" },
    { title: "Small Business Financial Management", description: "Essential tips for managing your finances" },
  ],
};

export default function Resources() {
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
            <span className="text-emerald-500">Resources</span> Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to get the most out of Involink.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <Book className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Documentation</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {resources.documentation.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-500 transition-colors">{doc.title}</h3>
                <p className="text-muted-foreground">{doc.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Video Tutorials</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {resources.videos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="font-semibold mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.duration}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Guides & Articles</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.guides.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-500 transition-colors">{guide.title}</h3>
                <p className="text-muted-foreground">{guide.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-12 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Need More Help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              Contact Support
              <ExternalLink className="w-5 h-5" />
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
