import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge, type InvoiceStatus } from "../components/StatusBadge";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "../lib/api";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || value === 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{formatCurrency(displayValue)}</span>;
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "emerald",
  delay = 0,
}: {
  label: string;
  value: number;
  icon: any;
  color?: "emerald" | "blue" | "amber" | "red";
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colorMap: Record<
    string,
    { stripe: string; iconBg: string; iconText: string }
  > = {
    emerald: { stripe: "bg-emerald-500", iconBg: "bg-emerald-600/10", iconText: "text-emerald-600 dark:text-emerald-400" },
    blue: { stripe: "bg-blue-500", iconBg: "bg-blue-600/10", iconText: "text-blue-600 dark:text-blue-400" },
    amber: { stripe: "bg-amber-500", iconBg: "bg-amber-600/10", iconText: "text-amber-600 dark:text-amber-400" },
    red: { stripe: "bg-red-500", iconBg: "bg-red-600/10", iconText: "text-red-600 dark:text-red-400" },
  };

  const c = colorMap[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="relative grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-e1 transition-shadow hover:shadow-e2"
    >
      <span className={`h-1 w-full ${c.stripe}`} />
      <div className="flex items-center gap-4 p-5">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.iconBg}`}>
          <Icon className={`h-5 w-5 ${c.iconText}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-ledger text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-xl font-semibold tracking-tight">
            {value === 0 ? formatCurrency(0) : <AnimatedNumber value={value} />}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-emerald-900/10 bg-emerald-600/5">
        <FileText className="h-7 w-7 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">No invoices yet</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Create your first invoice to start tracking payments and get paid
        faster.
      </p>
      <button
        onClick={() => navigate("/app/invoices/new")}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-e1 transition-all hover:bg-emerald-700 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        Create Invoice
      </button>
    </motion.div>
  );
};

const InvoiceRow = ({
  invoice,
  onClick,
  delay = 0,
}: {
  invoice: any;
  onClick: () => void;
  delay?: number;
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="group cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
      onClick={onClick}
    >
      <td className="px-5 py-4">
        <span className="font-ledger text-sm font-medium text-foreground">
          {invoice.invoice_number || "Draft"}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {invoice.clients?.name || "Unknown"}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="font-ledger text-sm font-semibold tracking-tight text-foreground">
          {formatCurrency(invoice.total || 0)}
        </span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={invoice.status || "draft"} />
      </td>
      <td className="hidden px-5 py-4 sm:table-cell">
        <span className="font-ledger text-xs text-muted-foreground">
          {invoice.due_date
            ? new Date(invoice.due_date).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </td>
    </motion.tr>
  );
};

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch (err: any) {
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const stats = [
    {
      label: "Total Invoiced",
      value: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
      icon: TrendingUp,
      color: "emerald" as const,
    },
    {
      label: "Paid",
      value: invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
      icon: CheckCircle2,
      color: "blue" as const,
    },
    {
      label: "Outstanding",
      value: invoices
        .filter((inv) => ["sent", "overdue"].includes(inv.status))
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
      icon: Clock,
      color: "amber" as const,
    },
    {
      label: "Overdue",
      value: invoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
      icon: AlertCircle,
      color: "red" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">A quick look at how your business is doing</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
            aria-label="Refresh"
          >
            <Loader2 className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => navigate("/app/invoices/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-e1 transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Invoice</span>
          </button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.08} />
        ))}
      </motion.div>

      <GlassCard className="overflow-hidden" variant="flat">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">Recent Invoices</h2>
          <NavLink
            to="/app/invoices"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-emerald-600" />
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Invoice
                  </th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Client
                  </th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </th>
                  <th className="hidden px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:table-cell">
                    Due
                  </th>
                  <th className="w-10 px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {invoices.slice(0, 10).map((invoice, i) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      delay={i * 0.04}
                      onClick={() =>
                        navigate(
                          invoice.status === "draft"
                            ? `/app/invoices/edit/${invoice.id}`
                            : `/app/invoices/${invoice.id}`
                        )
                      }
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
}