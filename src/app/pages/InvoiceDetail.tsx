import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge } from "../components/StatusBadge";
import { Download, Send, CheckCircle, ArrowLeft, ExternalLink, Clock, AlertTriangle, CreditCard, History } from "lucide-react";
import { NavLink, useParams } from "react-router";
import { toast } from "sonner";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes: string;
}

export function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data = await api.getInvoice(id);
      setInvoice(data);
      if (data) {
        setPaymentAmount(data.total?.toString() || "");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.markInvoicePaid(id!);
      toast.success("Invoice marked as paid!");
      loadInvoice();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as paid");
    }
  };

  const handleSendReminder = async () => {
    try {
      await api.sendInvoice(id!);
      toast.success("Reminder sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reminder");
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsRecordingPayment(true);
    try {
      await api.markInvoicePaid(id!);
      toast.success(`Payment of ₦${parseFloat(paymentAmount).toLocaleString()} recorded!`);
      setShowPaymentModal(false);
      loadInvoice();
    } catch (err: any) {
      toast.error(err.message || "Failed to record payment");
    } finally {
      setIsRecordingPayment(false);
    }
  };

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysOverdue = () => {
    if (!invoice?.due_date || invoice?.status === "paid") return 0;
    const due = new Date(invoice.due_date);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isOverdue = invoice?.status === "overdue" || (invoice?.status === "sent" && getDaysOverdue() > 0);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-40 bg-muted rounded-xl animate-pulse" />
            <div className="h-48 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Invoice not found</p>
        <NavLink to="/app" className="text-emerald-600 hover:underline">Go back to dashboard</NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLink to="/app/invoices" className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors active:scale-90">
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {invoice.invoice_number}
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {getDaysOverdue()} day{getDaysOverdue() !== 1 ? "s" : ""} overdue
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Issued to <span className="font-medium text-foreground">{invoice.clients?.name || "Unknown Client"}</span>
              {" • "}
              Created {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-card hover:bg-accent text-foreground border border-border rounded-xl font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Print
          </button>
          
          <button
            onClick={handleSendReminder}
            disabled={invoice.status === "paid"}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Remind
          </button>
          
          {invoice.status !== "paid" ? (
            <>
              <NavLink
                to={`/pay/${invoice.id}`}
                target="_blank"
                className="relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-all active:scale-95 text-sm overflow-hidden"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl bg-emerald-400/30 blur-md animate-pulse"
                />
                <span className="relative flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pay Now
                </span>
              </NavLink>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl font-medium transition-colors text-sm"
              >
                Manual Record
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
              <CheckCircle className="w-4 h-4" /> Paid
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-card rounded-2xl p-6 w-full max-w-md shadow-e4 border border-border"
            >
            <h3 className="text-xl font-semibold tracking-tight text-foreground mb-4">Record Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-border bg-input-background rounded-xl text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <select 
                  className="w-full px-4 py-3 border border-border bg-input-background rounded-xl text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card Payment</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reference (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-border bg-input-background rounded-xl text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Transaction reference"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/70"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={isRecordingPayment}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isRecordingPayment ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <motion.div {...fadeUp} className="paper relative overflow-hidden rounded-xl shadow-e2">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-12 select-none font-display text-[170px] font-bold leading-none text-emerald-600/5"
            >
              ₦
            </span>

            {invoice.status === "paid" && (
              <motion.div
                initial={{ scale: 1.7, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: -13, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 select-none"
                aria-hidden
              >
                <div className="rounded-lg border-4 border-emerald-500/70 px-6 py-2 text-center">
                  <div className="rounded-[4px] border-2 border-emerald-500/70 px-3 py-1">
                    <span className="font-display text-2xl font-bold uppercase tracking-[0.22em] text-emerald-500/80 sm:text-4xl">
                      Paid
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-paper-line">
                <div>
                  <h3 className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Bill To</h3>
                  <p className="font-semibold text-foreground text-lg">{invoice.clients?.name}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{invoice.clients?.email}</p>
                  {invoice.clients?.phone && <p className="text-muted-foreground mt-1 text-sm">{invoice.clients?.phone}</p>}
                  {invoice.clients?.address && <p className="text-muted-foreground mt-1 text-sm max-w-[280px]">{invoice.clients?.address}</p>}
                </div>
                <div className="text-right text-sm">
                  <div className="mb-3">
                    <h3 className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Issue Date</h3>
                    <p className="font-medium text-foreground">{formatDate(invoice.issue_date || invoice.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Due Date</h3>
                    <p className={`font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                      {formatDate(invoice.due_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-muted-foreground font-ledger text-[10px] uppercase tracking-[0.18em] border-b border-paper-line">
                      <th className="py-3 font-medium">Description</th>
                      <th className="py-3 font-medium text-center">Qty</th>
                      <th className="py-3 font-medium text-right">Rate</th>
                      <th className="py-3 font-medium text-right">Discount</th>
                      <th className="py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--paper-line)]">
                    {invoice.items?.map((item) => {
                      const lineTotal = item.quantity * item.rate;
                      const afterDiscount = lineTotal - (lineTotal * ((item.discount || 0) / 100));
                      return (
                        <tr key={item.id} className="text-foreground">
                          <td className="py-4 font-medium">
                            {item.description}
                            {item.unit && <span className="text-muted-foreground font-ledger text-xs ml-1">({item.unit})</span>}
                          </td>
                          <td className="py-4 text-center font-ledger text-sm text-muted-foreground">{item.quantity}</td>
                          <td className="py-4 text-right font-ledger text-sm text-muted-foreground">{formatCurrency(item.rate)}</td>
                          <td className="py-4 text-right text-amber-600 dark:text-amber-400">
                            {item.discount > 0 ? `-${item.discount}%` : "—"}
                          </td>
                          <td className="py-4 text-right font-ledger font-medium">{formatCurrency(afterDiscount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-end gap-3 pt-6 border-t border-paper-line">
                <div className="flex justify-between w-full sm:w-64 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-ledger font-medium text-foreground">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.vat_enabled && invoice.vat > 0 && (
                  <div className="flex justify-between w-full sm:w-64 text-sm">
                    <span className="text-muted-foreground">VAT</span>
                    <span className="font-ledger font-medium text-foreground">{formatCurrency(invoice.vat)}</span>
                  </div>
                )}
                <div className="flex justify-between w-full sm:w-64 text-xl font-bold mt-2 pt-4 border-t-2 border-foreground text-emerald-700 dark:text-emerald-400">
                  <span>Total Due</span>
                  <span className="font-ledger tracking-tight">{formatCurrency(invoice.total)}</span>
                </div>
                
                {invoice.status === "paid" && (
                  <div className="flex justify-between w-full sm:w-64 text-sm text-emerald-700 dark:text-emerald-400">
                    <span>Amount Paid</span>
                    <span className="font-ledger font-medium">{formatCurrency(invoice.total)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {invoice.notes && (
            <div className="paper rounded-xl p-6 shadow-e1">
              <h3 className="font-semibold text-foreground mb-2">Notes</h3>
              <p className="text-muted-foreground text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.12 }}>
            <GlassCard className="p-6" variant="flat">
              <h3 className="font-semibold text-foreground mb-4">Payment Link</h3>
            <div 
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/pay/${invoice.id}`); toast.success("Payment link copied!"); }}
              className="border border-border bg-input-background rounded-xl p-4 cursor-pointer group transition-colors hover:border-emerald-500/50"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground truncate">{window.location.host}/pay/{invoice.id?.slice(0, 8)}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 transition-colors shrink-0" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Share this link with your client to accept card payments.</p>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.2 }}>
            <GlassCard className="p-6" variant="flat">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <History className="w-4 h-4" /> Timeline
              </h3>
            <div className="space-y-4">
              {invoice.paid_at && (
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-card flex items-center justify-center shrink-0 mt-0.5 z-10">
                    <CheckCircle className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="pb-4 border-l-2 border-border pl-3 -ml-1">
                    <p className="text-sm font-medium text-foreground">Invoice Paid</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(invoice.paid_at)}</p>
                  </div>
                </div>
              )}
              {invoice.sent_at && (
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-card flex items-center justify-center shrink-0 mt-0.5 z-10">
                    <Send className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="pb-4 border-l-2 border-border pl-3 -ml-1">
                    <p className="text-sm font-medium text-foreground">Invoice Sent</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(invoice.sent_at)}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center shrink-0 mt-0.5 z-10">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="pl-3 -ml-1">
                  <p className="text-sm font-medium text-foreground">Invoice Created</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(invoice.created_at)}</p>
                </div>
              </div>
            </div>
            </GlassCard>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}