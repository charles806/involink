import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge, type InvoiceStatus } from "../components/StatusBadge";
import { TrendingUp, CheckCircle2, Clock, AlertCircle, Plus, FileText, Receipt, ArrowRight, Loader2 } from "lucide-react";
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

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }: { label: string; value: number; icon: any; color: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
    blue: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500/20", glow: "shadow-blue-500/20" },
    amber: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
    red: { bg: "bg-red-500", text: "text-red-500", border: "border-red-500/20", glow: "shadow-red-500/20" },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="p-5" hover>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 ${colors.bg}/10 rounded-2xl border ${colors.border} flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {value === 0 ? formatCurrency(0) : <AnimatedNumber value={value} />}
            </motion.p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6"
      >
        <Receipt className="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No invoices yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        Create your first invoice to start tracking payments and get paid faster.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/app/invoices/new")}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all"
      >
        <Plus className="w-5 h-5" />
        Create Invoice
      </motion.button>
    </motion.div>
  );
};

const InvoiceRow = ({ invoice, onClick }: { invoice: any; onClick: () => void }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="group cursor-pointer border-b border-gray-100 dark:border-gray-800"
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {invoice.invoice_number || "Draft"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-600 dark:text-gray-300">{invoice.clients?.name || "Unknown"}</span>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(invoice.total || 0)}</span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={invoice.status || "draft"} />
      </td>
      <td className="px-6 py-4">
        <span className={`text-sm ${
          invoice.status === "overdue" ? "text-red-600 dark:text-red-400" :
          invoice.status === "paid" ? "text-green-600 dark:text-green-400" :
          "text-gray-500 dark:text-gray-400"
        }`}>
          {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }) : "—"}
        </span>
      </td>
      <td className="px-6 py-4">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </td>
    </motion.tr>
  );
};

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const isInView = useInView(tableRef, { once: true });

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
    { label: "Total Invoiced", value: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0), icon: TrendingUp, color: "emerald" as const },
    { label: "Paid", value: invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + (inv.total || 0), 0), icon: CheckCircle2, color: "blue" as const },
    { label: "Outstanding", value: invoices.filter(inv => ["sent", "overdue"].includes(inv.status)).reduce((sum, inv) => sum + (inv.total || 0), 0), icon: Clock, color: "amber" as const },
    { label: "Overdue", value: invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + (inv.total || 0), 0), icon: AlertCircle, color: "red" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Loader2 className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/app/invoices/new")}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Invoice</span>
          </motion.button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </motion.div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
          <NavLink
            to="/app/invoices"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState />
          ) : (
            <table ref={tableRef} className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Due</th>
                  <th className="px-6 py-3 text-left w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {invoices.slice(0, 10).map((invoice, i) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <InvoiceRow 
                        invoice={invoice} 
                        onClick={() => navigate(
                          invoice.status === "draft" 
                            ? `/app/invoices/edit/${invoice.id}` 
                            : `/app/invoices/${invoice.id}`
                        )} 
                      />
                    </motion.div>
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