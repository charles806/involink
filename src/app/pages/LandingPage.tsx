import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  Menu,
  X,
  MapPin,
  FileText,
  Send,
  Wallet,
  BarChart3,
  ShieldCheck,
  Zap,
  CreditCard,
  Building2,
} from "lucide-react";
import { Link } from "react-router";
import { Logo } from "../components/Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-emerald-900/10 bg-background/85 backdrop-blur-xl shadow-e1"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="Involink home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-emerald-600"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-e1 transition-all hover:bg-emerald-700 hover:shadow-e2 active:scale-[0.98]"
          >
            Start Free
          </Link>
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-4 mb-4 rounded-2xl border border-emerald-900/10 bg-card p-4 shadow-e2 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="my-2 h-px paper-rule" />
              <Link
                to="/login"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="mt-1 rounded-lg bg-emerald-600 px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* The signature: an invoice as a counterfoil ledger slip              */
/* ------------------------------------------------------------------ */

function LedgerSlip() {
  const reduce = useReducedMotion();

  const items = [
    { label: "Website design", qty: "1 pcs", amount: "150,000" },
    { label: "Development", qty: "1 pcs", amount: "200,000" },
    { label: "Consultation", qty: "2 hrs", amount: "50,000" },
  ];

  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="relative select-none">
      {/* soft desk shadow */}
      <div className="absolute -inset-6 rounded-[40px] bg-emerald-600/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 32, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        className="relative"
      >
        {/* slip */}
        <div className="relative overflow-hidden rounded-xl bg-paper shadow-e3">
          {/* giant naira watermark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 font-display text-[180px] font-bold leading-none text-emerald-600/6"
          >
            ₦
          </span>

          {/* counterfoil side */}
          <div className="flex">
            <div className="paper-line flex w-7 shrink-0 flex-col items-center justify-between border-r border-dashed bg-paper-muted px-1 py-4">
              <span className="font-ledger text-[9px] uppercase tracking-widest text-muted-foreground">
                Inv
              </span>
              <span className="h-full w-px bg-paper-line" />
              <span className="font-ledger text-[9px] uppercase tracking-widest text-muted-foreground">
                Copy
              </span>
            </div>

            <div className="flex-1 p-6 sm:p-7">
              {/* header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Invoice
                  </p>
                  <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                    INV-0042
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-600/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span className="font-ledger text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    {isPaid ? "Paid" : "Sent"}
                  </span>
                </div>
              </div>

              {/* bill to */}
              <div className="mb-6">
                <p className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Bill to
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Chukwudi's Kitchen
                </p>
                <p className="text-xs text-muted-foreground">
                  Ikeja, Lagos
                </p>
              </div>

              {/* items */}
              <div className="paper-line border-t border-b">
                {items.map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-paper-line"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="font-ledger text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.qty}
                      </p>
                    </div>
                    <p className="font-ledger text-sm text-foreground">
                      ₦{item.amount}
                    </p>
                  </div>
                ))}
              </div>

              {/* totals */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-ledger">₦400,000</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>VAT (7.5%)</span>
                  <span className="font-ledger">₦30,000</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t-2 border-foreground pt-3">
                  <span className="font-display text-sm font-semibold">
                    Total due
                  </span>
                  <span className="font-ledger text-xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
                    ₦430,000
                  </span>
                </div>
              </div>

              {/* stamp */}
              <AnimatePresence>
                {isPaid && (
                  <motion.div
                    initial={{ scale: reduce ? 1 : 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 22,
                    }}
                    className="pointer-events-none absolute bottom-10 right-8"
                  >
                    <div className="-rotate-12 rounded-lg border-[3px] border-emerald-600/70 px-4 py-1.5 font-display text-xl font-bold uppercase tracking-[0.25em] text-emerald-600/80">
                      Paid
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* manual payment receipt chip */}
        <motion.button
          onClick={() => setIsPaid((v) => !v)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5, ease: EASE }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="absolute -bottom-5 left-8 flex items-center gap-2 rounded-lg border border-emerald-900/10 bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-e2 transition-colors hover:border-emerald-600/40"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Payment of ₦430,000 received
        </motion.button>

        {/* whatsapp chip */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
          className="absolute -right-3 -top-4 flex items-center gap-2 rounded-lg border border-emerald-900/10 bg-card px-3 py-2 text-xs font-medium text-foreground shadow-e2"
        >
          <Send className="h-4 w-4 text-emerald-600" />
          Shared on WhatsApp
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/[0.07] via-transparent to-transparent" />
        <div className="absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-8%] h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3.5 py-1.5 font-ledger text-[11px] font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Built for Nigerian businesses
          </p>

          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Create professional invoices{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              in seconds
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Invoice clients in Naira, send payment links that work, and watch
            what's paid, pending, and overdue — without chasing anyone.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-semibold text-white shadow-e2 transition-all hover:bg-emerald-700 hover:shadow-e3 active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/app"
              className="rounded-xl border border-emerald-900/15 bg-card px-7 py-3.5 font-semibold text-foreground transition-all hover:border-emerald-600/40 hover:shadow-e1 active:scale-[0.98]"
            >
              See Demo
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> No credit card
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> 2-minute setup
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> ₦ Naira native
            </span>
          </div>
        </motion.div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <LedgerSlip />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ledger stats band                                                   */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "60s", label: "to first invoice" },
  { value: "5", label: "free invoices a month" },
  { value: "7.5%", label: "VAT built in" },
  { value: "₦0", label: "to start" },
];

function LedgerStats() {
  return (
    <section className="border-y border-emerald-900/10 bg-card/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-emerald-900/10 px-5 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
            className="flex flex-col gap-1 px-4 py-8 text-center sm:py-10"
          >
            <span className="font-ledger text-3xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
              {stat.value}
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: FileText,
    title: "Invoice creation",
    description: "Numbered, branded invoices with line items, units, discounts and VAT — in under a minute.",
    points: ["Custom invoice numbers", "Line items + discounts", "VAT / tax support", "Your branding"],
  },
  {
    icon: Send,
    title: "Send & share",
    description: "Email, WhatsApp or a plain payment link. Your client opens it and pays from their phone.",
    points: ["Email delivery", "WhatsApp sharing", "Payment links", "PDF export"],
  },
  {
    icon: Wallet,
    title: "Track payments",
    description: "Status updates in real time — paid, pending, overdue — with reminders that actually go out.",
    points: ["Real-time status", "Payment reminders", "Auto-receipts", "Bank transfer tracking"],
  },
  {
    icon: BarChart3,
    title: "Business insights",
    description: "Know your outstanding totals and client history without any spreadsheet gymnastics.",
    points: ["Revenue reports", "Outstanding totals", "Client history", "Export to Excel"],
  },
];

function Features() {
  return (
    <section id="features" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 font-ledger text-xs uppercase tracking-[0.25em] text-emerald-600">
            Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to get paid
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful on purpose, simple by design — built for how Nigerian
            businesses actually invoice.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-emerald-900/10 bg-card p-6 shadow-e1 transition-shadow hover:shadow-e2"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
              <ul className="space-y-2 border-t border-emerald-900/10 pt-4">
                {f.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works — a real sequence, so numbering is earned              */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Sign up",
    desc: "Create your account in two minutes. No card, no calls, no waiting.",
  },
  {
    title: "Add client",
    desc: "Name, email, phone — the details you already have on your phone.",
  },
  {
    title: "Create invoice",
    desc: "Add items and set prices. VAT and totals calculate themselves.",
  },
  {
    title: "Get paid",
    desc: "Share the link, track the status, and know the day money lands.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-emerald-950 py-24 text-emerald-50 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 font-ledger text-xs uppercase tracking-[0.25em] text-emerald-400">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From sign-up to paid in four steps
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="relative rounded-2xl border border-emerald-100/10 bg-emerald-900/40 p-6 backdrop-blur-sm"
            >
              <span className="font-ledger text-sm font-semibold text-emerald-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="my-4 h-px w-10 bg-emerald-400/40" />
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-emerald-100/70">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Built for Nigeria                                                   */
/* ------------------------------------------------------------------ */

const LOCAL = [
  {
    title: "Naira-first",
    desc: "Built from the ground up for Naira. ₦150,000 is exactly ₦150,000 — no currency confusion.",
  },
  {
    title: "Simple payments",
    desc: "Bank transfers and payment links that work with Nigerian banks. No Stripe, no PayPal needed.",
  },
  {
    title: "Fast setup",
    desc: "Sign up, add a client, send an invoice — done in two minutes. Free to start.",
  },
];

function BuiltForNigeria() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-ledger text-xs uppercase tracking-[0.25em] text-emerald-600">
            Built for Nigeria
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Foreign apps don't always work here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Involink was built for Nigerian entrepreneurs — the currency, the
            payments, the way business actually happens.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {LOCAL.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="rounded-2xl border border-emerald-600/15 bg-emerald-600/[0.04] p-7"
            >
              <span className="mb-4 block font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₦
              </span>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing (aligned with the real plans)                               */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: "Free MVP",
    price: "₦0",
    period: "forever",
    description: "For starting out",
    features: ["5 invoices a month", "Basic invoice templates", "Email support", "Naira currency"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "₦2,900",
    period: "/month",
    description: "For serious businesses",
    features: [
      "Unlimited invoices",
      "Custom branding (logo & colors)",
      "Payment link generation",
      "Invoice reminders",
      "Priority WhatsApp support",
    ],
    cta: "Choose Plan",
    highlighted: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-card/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-ledger text-xs uppercase tracking-[0.25em] text-emerald-600">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Start free. Upgrade when you're ready — in Naira, of course.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-emerald-600 text-white shadow-e3"
                  : "border border-emerald-900/10 bg-card shadow-e1"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3.5 py-1 font-ledger text-[10px] font-semibold uppercase tracking-widest text-amber-950">
                  Best value
                </span>
              )}

              <h3 className="text-lg font-semibold tracking-tight">
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${plan.highlighted ? "text-emerald-50/80" : "text-muted-foreground"}`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-ledger text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${plan.highlighted ? "text-emerald-50/80" : "text-muted-foreground"}`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="mt-7 mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-emerald-200" : "text-emerald-600"}`}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-emerald-50/95" : "text-foreground/80"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.highlighted ? "/pricing" : "/signup"}
                className={`mt-auto rounded-xl px-6 py-3.5 text-center font-semibold transition-all active:scale-[0.98] ${
                  plan.highlighted
                    ? "bg-white text-emerald-700 hover:bg-emerald-50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ + CTA + Footer                                                  */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan is free forever — 5 invoices a month with email support.",
  },
  {
    q: "How do my clients pay me?",
    a: "Share the payment link and your client pays with card or bank transfer. You can also record bank transfer payments manually.",
  },
  {
    q: "Can I put my own branding on invoices?",
    a: "Yes, on the Enterprise plan. Add your logo, brand colour and business details to every invoice.",
  },
  {
    q: "What happens when I upgrade?",
    a: "Changes take effect immediately. You keep all your invoices and clients.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="contact" className="py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-ledger text-xs uppercase tracking-[0.25em] text-emerald-600">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </motion.div>

        <div className="divide-y divide-emerald-900/10 rounded-2xl border border-emerald-900/10 bg-card px-6 shadow-e1">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <span
                    className={`font-ledger text-sm text-emerald-600 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-emerald-950 px-6 py-16 text-center text-emerald-50 sm:px-12 sm:py-20"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-14 font-display text-[200px] font-bold leading-none text-emerald-400/10"
        >
          ₦
        </span>
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to get paid?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/80">
            Join Nigerian entrepreneurs who invoice with Involink — and stop
            chasing payments.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-emerald-700 transition-all hover:bg-emerald-50 active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="rounded-xl border border-emerald-100/25 px-8 py-4 font-semibold text-emerald-50 transition-colors hover:bg-emerald-100/10"
            >
              Compare Plans
            </Link>
          </div>
          <p className="mt-6 text-sm text-emerald-100/60">
            No credit card required • Free forever plan
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Nigeria's simplest invoicing platform. Create professional
              invoices, send them to clients, and track payments — all in
              Naira.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-emerald-600" /> Lagos, Nigeria
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><Link to="/login" className="hover:text-foreground">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-emerald-900/10 pt-6 sm:flex-row">
          <p className="font-ledger text-xs uppercase tracking-widest text-muted-foreground">
            © 2026 Involink · Naira first
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Payments powered by Paystack
            <Building2 className="ml-3 h-3.5 w-3.5" /> Lagos, NG
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <Hero />
      <LedgerStats />
      <Features />
      <HowItWorks />
      <BuiltForNigeria />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}