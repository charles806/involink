import { motion } from "framer-motion";
import { Link } from "react-router";
import { Logo } from "../components/Logo";

export default function Cookies() {
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
            Cookie <span className="text-emerald-600">Policy</span>
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
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
                <li><strong>Analytical Cookies:</strong> Help us understand how visitors use our platform</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization</li>
                <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions you take, such as logging in or filling in forms.</p>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">Performance Cookies</h3>
              <p className="text-muted-foreground mb-4">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">Functional Cookies</h3>
              <p className="text-muted-foreground mb-4">These cookies enable enhanced functionality and personalization, such as live chat support and videos.</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">4. Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site.
              </p>
              <p className="text-muted-foreground">
                To manage cookies in your browser, please refer to your browser's help documentation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. You should check the third-party websites for more information about their cookies and how to manage them.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">6. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-e2">
              <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our Cookie Policy, please contact us at: <span className="text-emerald-600">privacy@involink.com</span>
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
