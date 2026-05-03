import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap } from "lucide-react";

export default function Privacy() {
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
            <Link to="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Legal
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: March 25, 2026</p>
        </motion.div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg dark:prose-invert max-w-none space-y-8"
          >
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>1. Introduction</h2>
              <p className="text-muted-foreground">
                At Involink, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoicing platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Account information (name, email, phone number, business name)</li>
                <li>Invoice and billing data</li>
                <li>Client information you add to the platform</li>
                <li>Payment transaction records</li>
                <li>Communication preferences</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information, such as updates and security alerts</li>
                <li>Respond to your comments, questions, and provide customer service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>4. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share information with service providers who assist us in operating our platform.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>6. Your Rights</h2>
              <p className="text-muted-foreground mb-4">Under Nigerian Data Protection Regulation (NDPR), you have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal information</li>
                <li>Rectify inaccurate personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at: <span className="text-emerald-500">privacy@involink.com</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-t border-white/30 dark:border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 Involink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
