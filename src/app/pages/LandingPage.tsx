import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Send,
  Wallet,
  TrendingUp,
  Menu,
  X,
  MapPin,
  MousePointer2,
  Zap,
  Calculator,
  Users,
  Building2,
  CreditCard,
  Download,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router";
import { Logo } from "../components/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm"
            >
              Start Free
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-200"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="block py-2 text-gray-700 dark:text-gray-200 font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block py-3 text-center rounded-xl font-medium bg-emerald-500 text-white"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg)");
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      animate={{ transform }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const ScrollReveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900" />

      <motion.div className="absolute inset-0" style={{ y }}>
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-emerald-400/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-400/20 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-300/10 blur-[120px] rounded-full" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Launch Special: Free Forever Plan</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
            >
              Create invoices.{" "}
              <span className="text-emerald-600">Get paid.</span>
              <br />
              <span className="text-gray-900">Simple.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
            >
              Send professional invoices in Naira, track payments in real-time,
              and get paid faster. No complex apps, no foreign integrations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105"
              >
                See Demo
                <MousePointer2 className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>2-min setup</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="hidden lg:block perspective-1000"
          >
            <TiltCard className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 blur-3xl rounded-full" />
              <div
                className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FileText className="w-8 h-8 text-white" />
                </motion.div>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Invoice
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      INV-0001
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                    DRAFT
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Website Design</span>
                    </div>
                    <span className="font-semibold">₦150,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Development</span>
                    </div>
                    <span className="font-semibold">₦200,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium">Consultation</span>
                    </div>
                    <span className="font-semibold">₦50,000</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t-2 border-emerald-500">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="font-bold text-2xl text-emerald-600">
                    ₦400,000
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <CreditCard className="w-4 h-4" />
                  <span>Powered by Involink</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-emerald-500"
          />
        </div>
      </motion.div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="py-16 border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                <AnimatedCounter end={25} />
              </p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                ₦<AnimatedCounter end={150000} />
              </p>
              <p className="text-sm text-gray-500">Total Invoiced</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                <AnimatedCounter end={50} />
              </p>
              <p className="text-sm text-gray-500">Invoices Created</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                100%
              </p>
              <p className="text-sm text-gray-500">Support Response</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const InteractiveFeatureCard = ({
  icon: Icon,
  title,
  description,
  features,
  color = "emerald",
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  features: string[];
  color?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all hover:shadow-xl cursor-pointer overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {description}
        </p>

        <ul className="space-y-2">
          {features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <Check className={`w-4 h-4 text-${color}-500 shrink-0`} />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const featureGroups = [
    {
      icon: FileText,
      title: "Invoice Creation",
      description: "Professional invoices in minutes",
      features: [
        "Custom invoice numbers",
        "Line items + discounts",
        "VAT/tax support",
        "Your branding",
      ],
      color: "emerald",
    },
    {
      icon: Send,
      title: "Send & Share",
      description: "Reach clients your way",
      features: [
        "Email delivery",
        "WhatsApp sharing",
        "Payment links",
        "PDF export",
      ],
      color: "blue",
    },
    {
      icon: Wallet,
      title: "Track Payments",
      description: "Never miss a payment",
      features: [
        "Real-time status",
        "Payment reminders",
        "Auto-receipts",
        "Bank transfer tracking",
      ],
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Business Insights",
      description: "Know your numbers",
      features: [
        "Revenue reports",
        "Outstanding totals",
        "Client history",
        "Export to Excel",
      ],
      color: "amber",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features, no complexity. Just what Nigerian entrepreneurs
              need to get paid.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureGroups.map((group, i) => (
            <InteractiveFeatureCard key={i} {...group} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Sign Up", desc: "Create your account in 2 minutes" },
    { num: "02", title: "Add Client", desc: "Enter your client's details" },
    { num: "03", title: "Create Invoice", desc: "Add items, set price, done" },
    { num: "04", title: "Get Paid", desc: "Send and track payment" },
  ];

  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-400">
              From sign-up to getting paid in 4 simple steps
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative p-8 rounded-3xl bg-gray-800 border border-gray-700 hover:border-emerald-500 transition-all cursor-pointer group"
              >
                <span className="text-6xl font-bold text-emerald-500/20 absolute top-4 right-4">
                  {step.num}
                </span>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const ValueProps = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Nigeria
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We get it. Foreign apps don't always work here. We built Involink
              specifically for Nigerian entrepreneurs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          <ScrollReveal delay={0}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-200 dark:border-emerald-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ₦Naira-First
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built from the ground up for Naira. No currency confusion —
                ₦150,000 is exactly ₦150,000.
              </p>
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Simple Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bank transfers, payment links that work with Nigerian banks. No
                Stripe, no PayPal needed.
              </p>
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-200 dark:border-purple-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Fast Setup
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up, add client, send invoice — done in 2 minutes. No credit
                card to start.
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "₦0",
      description: "Perfect for starting out",
      features: [
        "10 invoices/month",
        "Basic templates",
        "Email support",
        "Naira currency",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₦2,900",
      period: "/month",
      description: "For serious businesses",
      features: [
        "Unlimited invoices",
        "Your branding",
        "Priority support",
        "Payment links",
        "Client portal",
      ],
      cta: "Start Trial",
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start free. Upgrade when you're ready.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative p-8 rounded-3xl transition-all cursor-pointer ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-900 text-sm font-bold">
                    BEST VALUE
                  </span>
                )}

                <h3
                  className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${plan.highlighted ? "text-emerald-100" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span
                    className={`text-5xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-emerald-100" : "text-gray-500"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`w-5 h-5 ${plan.highlighted ? "text-emerald-200" : "text-emerald-500"}`}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-white/90"
                            : "text-gray-600 dark:text-gray-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-white text-emerald-600 hover:bg-gray-100"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 -left-20 w-60 h-60 bg-white/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 -right-20 w-60 h-60 bg-white/10 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to get paid?
              </h2>
              <p className="text-emerald-100 text-xl mb-8 max-w-xl mx-auto">
                Join Nigerian entrepreneurs who use Involink to create
                professional invoices and track payments.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-white text-emerald-600 font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Create Free Account
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nigeria's simplest invoicing platform. Create professional
              invoices, send to clients, and track payments — all in Naira.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#features" className="hover:text-emerald-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-500">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-500">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/about" className="hover:text-emerald-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-500">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Involink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <Stats />
      <FeaturesSection />
      <HowItWorks />
      <ValueProps />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
