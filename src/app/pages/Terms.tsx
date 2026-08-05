import { motion } from "framer-motion";
import { Link } from "react-router";
import { Logo } from "../components/Logo";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="lg" />
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of <span className="text-emerald-600">Service</span>
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
            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Involink, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
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

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not attempt to gain unauthorized access to the platform</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
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

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Involink platform, including all content, features, and functionality, is owned by Involink and is protected by Nigerian and international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Involink shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Nigerian courts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at: <span className="text-emerald-600">legal@involink.com</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-background/80 backdrop-blur-xl border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 Involink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
