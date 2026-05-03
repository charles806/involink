import { motion } from "framer-motion";
import { Link } from "react-router";
import { Zap } from "lucide-react";

export default function Terms() {
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
            Terms of <span className="text-emerald-500">Service</span>
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
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Involink, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                Involink provides an online invoicing platform that enables Nigerian entrepreneurs to create, send, and manage invoices. The service includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Invoice creation and customization</li>
                <li>Client management</li>
                <li>Payment tracking</li>
                <li>Financial reporting</li>
                <li>Integration with Nigerian payment gateways</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>3. User Obligations</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not attempt to gain unauthorized access to the platform</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>4. Payment Terms</h2>
              <p className="text-muted-foreground mb-4">
                Certain features of the service require payment. Subscription fees are:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Billed in Nigerian Naira (NGN)</li>
                <li>Non-refundable unless required by law</li>
                <li>Subject to change with 30 days notice</li>
                <li>Automatically renewed unless cancelled</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Involink platform, including all content, features, and functionality, is owned by Involink and is protected by Nigerian and international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Involink shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>7. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Nigerian courts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at: <span className="text-emerald-500">legal@involink.com</span>
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
