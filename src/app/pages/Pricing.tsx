import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { Zap, Check, ArrowRight } from "lucide-react";

const PricingCard = ({ 
  name, 
  price, 
  description, 
  features, 
  highlighted = false,
  delay = 0 
}: { 
  name: string, 
  price: string, 
  description: string, 
  features: string[], 
  highlighted?: boolean,
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-3xl ${
        highlighted 
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/30' 
          : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-900 text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${highlighted ? 'text-white' : ''}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
          {name}
        </h3>
        <p className={`text-sm ${highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
          {description}
        </p>
      </div>
      
      <div className="mb-6">
        <span className={`text-5xl font-bold ${highlighted ? 'text-white' : ''}`}>
          {price}
        </span>
        {price !== "Free" && (
          <span className={`text-sm ${highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
            /month
          </span>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              highlighted ? 'bg-white/20' : 'bg-emerald-500/20'
            }`}>
              <Check className={`w-3 h-3 ${highlighted ? 'text-white' : 'text-emerald-500'}`} />
            </div>
            <span className={highlighted ? 'text-white/90' : ''}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer ${
        highlighted 
          ? 'bg-white text-emerald-600 hover:bg-white/90 hover:shadow-lg' 
          : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30'
      }`}>
        {name === "Free MVP" ? "Get Started Free" : "Choose Plan"}
      </button>
    </motion.div>
  );
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  
  const plans = [
    {
      name: "Free MVP",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "5 invoices per month",
        "Basic invoice templates",
        "Email support",
        "Naira currency support"
      ]
    },
    {
      name: "Enterprise",
      price: isYearly ? "₦27,840" : "₦2,900",
      description: "For growing businesses",
      features: [
        "Unlimited invoices",
        "Custom branding (logo & colors)",
        "Priority WhatsApp support",
        "Payment link generation",
        "Client portal access",
        "Multi-user access",
        "Invoice reminders"
      ],
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Is there a free trial?",
      answer: "Our Free MVP tier lets you try the platform at no cost. Upgrade when you're ready for more features."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including bank transfers, debit/credit cards, and USSD."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. No questions asked."
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
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
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
            Simple, <span className="text-emerald-500">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business. Start free, upgrade when you're ready.
          </p>
          
          <div className="inline-flex items-center gap-4 p-2 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                !isYearly 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                isYearly 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <PricingCard 
                key={i}
                {...plan}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
            className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Still Have Questions?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Our team is here to help you choose the right plan for your business.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-600 font-semibold hover:bg-white/90 transition-colors"
            >
              Contact Sales
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
