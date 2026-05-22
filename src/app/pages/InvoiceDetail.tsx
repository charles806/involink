import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge } from "../components/StatusBadge";
import { Download, Send, CheckCircle, ArrowLeft, ExternalLink, Clock, AlertTriangle, CreditCard, History } from "lucide-react";
import { NavLink, useParams } from "react-router";
import { toast } from "sonner";
import api from "../lib/api";

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
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <NavLink to="/app" className="text-emerald-500 hover:underline">Go back to dashboard</NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLink to="/app" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-['Poppins'] text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              {invoice.invoice_number}
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {getDaysOverdue()} day{getDaysOverdue() !== 1 ? "s" : ""} overdue
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Issued to <span className="font-medium text-gray-900 dark:text-gray-200">{invoice.clients?.name || "Unknown Client"}</span>
              {" • "}
              Created {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600 rounded-xl font-medium shadow-sm transition-colors text-sm backdrop-blur-md"
          >
            <Download className="w-4 h-4" /> Print
          </button>
          
          <button
            onClick={handleSendReminder}
            disabled={invoice.status === "paid"}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Remind
          </button>
          
          {invoice.status !== "paid" ? (
            <>
              <NavLink
                to={`/pay/${invoice.id}`}
                target="_blank"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 text-sm"
              >
                <CreditCard className="w-4 h-4" /> Pay Now
              </NavLink>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600 rounded-xl font-medium shadow-sm transition-colors text-sm"
              >
                Manual Record
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Paid
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Record Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 mt-1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 mt-1"
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reference (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 mt-1"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Transaction reference"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={isRecordingPayment}
                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {isRecordingPayment ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700/50">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{invoice.clients?.name}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{invoice.clients?.email}</p>
                {invoice.clients?.phone && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{invoice.clients?.phone}</p>}
                {invoice.clients?.address && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm max-w-[280px]">{invoice.clients?.address}</p>}
              </div>
              <div className="text-right text-sm">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Issue Date</h3>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.issue_date || invoice.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Due Date</h3>
                  <p className={`font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                    {formatDate(invoice.due_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-700/50">
                    <th className="py-3 font-medium">Description</th>
                    <th className="py-3 font-medium text-center">Qty</th>
                    <th className="py-3 font-medium text-right">Rate</th>
                    <th className="py-3 font-medium text-right">Discount</th>
                    <th className="py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {invoice.items?.map((item) => {
                    const lineTotal = item.quantity * item.rate;
                    const afterDiscount = lineTotal - (lineTotal * ((item.discount || 0) / 100));
                    return (
                      <tr key={item.id} className="text-gray-900 dark:text-gray-100">
                        <td className="py-4 font-medium">
                          {item.description}
                          {item.unit && <span className="text-gray-400 text-xs ml-1">({item.unit})</span>}
                        </td>
                        <td className="py-4 text-center text-gray-600 dark:text-gray-400">{item.quantity}</td>
                        <td className="py-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(item.rate)}</td>
                        <td className="py-4 text-right text-amber-600 dark:text-amber-400">
                          {item.discount > 0 ? `-${item.discount}%` : "—"}
                        </td>
                        <td className="py-4 text-right font-medium">{formatCurrency(afterDiscount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <div className="flex justify-between w-full sm:w-64 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.vat_enabled && invoice.vat > 0 && (
                <div className="flex justify-between w-full sm:w-64 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">VAT</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.vat)}</span>
                </div>
              )}
              <div className="flex justify-between w-full sm:w-64 text-xl font-bold mt-2 pt-4 border-t border-gray-100 dark:border-gray-700/50 text-emerald-600 dark:text-emerald-400 font-['Poppins']">
                <span>Total Due</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              
              {invoice.status === "paid" && (
                <div className="flex justify-between w-full sm:w-64 text-sm text-blue-600 dark:text-blue-400">
                  <span>Amount Paid</span>
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {invoice.notes && (
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{invoice.notes}</p>
            </GlassCard>
          )}
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 font-['Poppins']">Payment Link</h3>
            <div 
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/pay/${invoice.id}`); toast.success("Payment link copied!"); }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{window.location.host}/pay/{invoice.id?.slice(0, 8)}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">Share this link with your client to accept card payments.</p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 font-['Poppins'] flex items-center gap-2">
              <History className="w-4 h-4" /> Timeline
            </h3>
            <div className="space-y-4">
              {invoice.paid_at && (
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center shrink-0 mt-0.5 z-10">
                    <CheckCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="pb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3 -ml-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Invoice Paid</p>
                    <p className="text-xs text-gray-500">{formatDateTime(invoice.paid_at)}</p>
                  </div>
                </div>
              )}
              {invoice.sent_at && (
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-gray-800 flex items-center justify-center shrink-0 mt-0.5 z-10">
                    <Send className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="pb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3 -ml-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Invoice Sent</p>
                    <p className="text-xs text-gray-500">{formatDateTime(invoice.sent_at)}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center shrink-0 mt-0.5 z-10">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="pl-3 -ml-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Invoice Created</p>
                  <p className="text-xs text-gray-500">{formatDateTime(invoice.created_at)}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
}