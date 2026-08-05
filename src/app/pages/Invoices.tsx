import { useMemo, useRef, useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge, type InvoiceStatus } from "../components/StatusBadge";
import {
  Search,
  Plus,
  Loader2,
  Eye,
  Pencil,
  Send,
  CheckCircle2,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "../lib/api";
import { motion, useInView } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

const PAGE_SIZE = 10;

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (invoice: any) =>
  invoice.status === "overdue" ||
  (invoice.status === "sent" &&
    invoice.due_date &&
    new Date(invoice.due_date).getTime() < Date.now());

export function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendBusyId, setSendBusyId] = useState<string | null>(null);
  const [payBusyId, setPayBusyId] = useState<string | null>(null);
  const headerRef = useRef(null);
  const chipsRef = useRef(null);
  const isInView = useInView(headerRef, { once: true });
  const chipsInView = useInView(chipsRef, { once: true });

  const loadInvoices = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const data = await api.getInvoices();
      setInvoices(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(true);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = invoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (!q) return true;
      const number = (inv.invoice_number || "").toLowerCase();
      const client = (inv.clients?.name || "").toLowerCase();
      return number.includes(q) || client.includes(q);
    });
    return [...list].sort((a, b) => {
      const aTime = new Date(a.due_date || a.created_at || 0).getTime();
      const bTime = new Date(b.due_date || b.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [invoices, searchQuery, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleRowClick = (invoice: any) => {
    navigate(
      invoice.status === "draft"
        ? `/app/invoices/edit/${invoice.id}`
        : `/app/invoices/${invoice.id}`
    );
  };

  const handleSendReminder = async (invoice: any) => {
    setSendBusyId(invoice.id);
    try {
      await api.sendInvoice(invoice.id);
      toast.success(`Reminder sent for ${invoice.invoice_number || "invoice"}`);
      loadInvoices(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reminder");
    } finally {
      setSendBusyId(null);
    }
  };

  const handleMarkPaid = async (invoice: any) => {
    setPayBusyId(invoice.id);
    try {
      await api.markInvoicePaid(invoice.id);
      toast.success(`${invoice.invoice_number || "Invoice"} marked as paid!`);
      loadInvoices(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as paid");
    } finally {
      setPayBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteInvoice(deleteTarget.id);
      toast.success(`Invoice deleted`);
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteTarget.id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete invoice");
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  };

  const allowAction = (invoice: any) =>
    invoice.status !== "draft" && invoice.status !== "paid";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
            {statusFilter !== "all" ? ` • ${FILTERS.find((f) => f.value === statusFilter)?.label}` : ""}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/app/invoices/new")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </motion.button>
      </motion.div>

      <motion.div
        ref={chipsRef}
        initial={{ opacity: 0, y: 12 }}
        animate={chipsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <GlassCard className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by invoice number or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>

            <div className="relative flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {FILTERS.map((filter) => {
                const active = statusFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`relative shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="invoice-filter-active"
                        className="absolute inset-0 rounded-lg bg-emerald-600 shadow-e1"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-14 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              </div>
            ) : paged.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                  {searchQuery || statusFilter !== "all" ? "No matching invoices" : "No invoices yet"}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Create your first invoice to start tracking payments."}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/app/invoices/new")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e1 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Invoice
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-accent/70 backdrop-blur">
                  <tr>
                    <th className="px-5 py-4 text-left font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Invoice</th>
                    <th className="px-5 py-4 text-left font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client</th>
                    <th className="px-5 py-4 text-left font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Amount</th>
                    <th className="px-5 py-4 text-left font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Status</th>
                    <th className="hidden px-5 py-4 text-left font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:table-cell">Due</th>
                    <th className="w-16 px-5 py-4 text-right font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paged.map((invoice, i) => {
                    const paid = invoice.status === "paid";
                    const draft = invoice.status === "draft";
                    return (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        onClick={() => handleRowClick(invoice)}
                        className="group cursor-pointer transition-colors hover:bg-accent/50"
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
                          <StatusBadge status={(invoice.status as InvoiceStatus) || "draft"} />
                        </td>
                        <td className="hidden px-5 py-4 sm:table-cell">
                          <span className={`font-ledger text-xs ${isOverdue(invoice) ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                            {formatDate(invoice.due_date)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                            <button
                              onClick={() => navigate(`/app/invoices/${invoice.id}`)}
                              className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/app/invoices/edit/${invoice.id}`)}
                              className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendReminder(invoice)}
                              disabled={paid || draft || sendBusyId === invoice.id}
                              className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-colors disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                              title={paid ? "Already paid" : draft ? "Draft not yet sent" : "Send reminder"}
                            >
                              {sendBusyId === invoice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleMarkPaid(invoice)}
                              disabled={paid || draft || payBusyId === invoice.id}
                              className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                              title={paid ? "Already paid" : draft ? "Draft not yet sent" : "Mark as paid"}
                            >
                              {payBusyId === invoice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(invoice)}
                              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!isLoading && filtered.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border px-5 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[3.5rem] text-center font-ledger text-sm text-muted-foreground">
                  {currentPage} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage === pageCount}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.invoice_number || "this draft"}
              </span>
              {" "}for {deleteTarget?.clients?.name || "unknown client"}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40"
            >
              {isDeleting ? "Deleting..." : "Delete Invoice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}