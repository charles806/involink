import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap, Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@involink.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234 800 000 0000",
      description: "Mon-Fri, 9am-6pm WAT"
    },
    {
      icon: MapPin,
      title: "Office",
      value: "Lagos, Nigeria",
      description: "Victoria Island, Lagos"
    },
    {
      icon: Clock,
      title: "Support Hours",
      value: "24/7",
      description: "We're always here to help"
    }
  ];

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
            Get in <span className="text-emerald-500">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold mb-1">{info.title}</h3>
                  <p className="text-emerald-500 font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-center"
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Need Immediate Help?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Check our help center or join our community for quick answers to common questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resources"
                className="px-6 py-3 rounded-2xl bg-white text-emerald-600 font-semibold hover:bg-white/90 transition-colors"
              >
                Visit Help Center
              </Link>
              <button className="px-6 py-3 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors">
                Join Community
              </button>
            </div>
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
