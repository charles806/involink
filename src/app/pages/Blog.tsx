import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap, ArrowRight, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How to Create Professional Invoices That Get Paid Faster",
    excerpt: "Learn the best practices for creating invoices that not only look professional but also encourage your clients to pay promptly.",
    category: "Invoicing Tips",
    date: "March 15, 2026",
    author: "Adesuwa Okonkwo",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Understanding Nigerian Tax Requirements for Freelancers",
    excerpt: "A comprehensive guide to tax obligations for freelancers and small business owners in Nigeria.",
    category: "Tax Guide",
    date: "March 10, 2026",
    author: "Chidi Eze",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "5 Payment Methods Every Nigerian Business Should Accept",
    excerpt: "From bank transfers to USSD, discover the payment methods that will help you get paid by more customers.",
    category: "Payments",
    date: "March 5, 2026",
    author: "Fatima Abubakar",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "How to Manage Late Payments Without Damaging Client Relationships",
    excerpt: "Strategies for handling late payments professionally while maintaining good client relationships.",
    category: "Business Tips",
    date: "February 28, 2026",
    author: "Emeka Nwachukwu",
    readTime: "7 min read"
  },
  {
    id: 5,
    title: "The Future of Digital Payments in Nigeria",
    excerpt: "Exploring the trends shaping digital payments in Nigeria and what they mean for your business.",
    category: "Industry Insights",
    date: "February 20, 2026",
    author: "Adesuwa Okonkwo",
    readTime: "6 min read"
  },
  {
    id: 6,
    title: "Setting Up Your Business for Growth with Automations",
    excerpt: "How to use automated invoicing to save time and scale your business efficiently.",
    category: "Productivity",
    date: "February 15, 2026",
    author: "Chidi Eze",
    readTime: "5 min read"
  },
];

export default function Blog() {
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
            Our <span className="text-emerald-500">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and news for Nigerian entrepreneurs and small business owners.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4">
                  {post.category}
                </div>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-emerald-500 transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
              </motion.article>
            ))}
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
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Get the latest articles, tips, and updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="px-8 py-3 rounded-2xl bg-white text-emerald-600 font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="w-5 h-5" />
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
