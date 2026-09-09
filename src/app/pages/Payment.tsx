import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams, Navigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Loader2, Landmark, Copy } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";
import { PaystackPayment, loadPaystackScript } from "../components/PaystackPayment";
import { GlassCard } from "../components/GlassCard";

interface InvoiceData {
  id: string;
  invoice_number: string;
  clients: {
    name: string;
    email: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  due_date: string;
  already_paid?: boolean;
}

export default function Payment() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (!id) return;
    
    loadPaystackScript().catch(() => {
      toast.error("Failed to load payment system");
    });

    const fetchInvoice = async () => {
      try {
        const data = await api.getPublicInvoice(id);
        if (data.already_paid) {
           setPaymentStatus("success");
           setInvoice(data);
           return;
        }
        setInvoice(data);
        if (data.clients?.email) {
          setCustomerEmail(data.clients.email);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load invoice";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePaymentSuccess = async (reference: string) => {
    try {
      await api.markInvoicePaid(id!);
      setPaymentStatus("success");
      toast.success("Payment completed successfully!");
    } catch (err) {
      setPaymentStatus("failed");
      toast.error("Failed to update payment status");
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
      month: "long",
      day: "numeric",
    });
  };

  const copyAccountNumber = async (value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Account number copied");
    } catch {
      toast.error("Could not copy account number");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Invoice Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The invoice you are trying to pay could not be found. It may have been deleted or the link is invalid.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.05 }}
            className="relative w-16 h-16 mx-auto mb-4"
          >
            <span aria-hidden className="absolute inset-0 rounded-full bg-emerald-400/40 blur-xl animate-pulse" />
            <span className="relative w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Payment Successful!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your payment for invoice <span className="font-semibold">{invoice.invoice_number}</span> has been processed successfully.
            </p>
          </motion.div>
          <div className="bg-input-background border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{formatCurrency(invoice.total)}</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold shadow-e1 hover:bg-emerald-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Pay Invoice</h1>
              <p className="text-sm text-muted-foreground">Secure payment powered by Paystack</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Invoice Number</span>
              <span className="font-medium text-foreground">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Client</span>
              <span className="font-medium text-foreground">{invoice.clients?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Due Date</span>
              <span className="font-medium text-foreground">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal || 0)}</span>
            </div>
            {invoice.vat > 0 && (
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Tax/VAT</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.vat)}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {invoice.clients?.bank_name && invoice.clients?.account_number && (
            <BankTransferCard
              bankName={invoice.clients.bank_name}
              accountNumber={invoice.clients.account_number}
              accountName={invoice.clients.account_name || invoice.clients.name}
              onCopy={copyAccountNumber}
            />
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-input-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              placeholder="Enter your email"
            />
            <p className="text-xs text-muted-foreground mt-1">Receipt will be sent to this email</p>
          </div>

          <PaystackPayment
            invoiceId={id!}
            amount={invoice.total}
            email={customerEmail}
            onSuccess={handlePaymentSuccess}
          />
        </GlassCard>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BankTransferCard({
  bankName,
  accountNumber,
  accountName,
  onCopy,
}: {
  bankName: string;
  accountNumber: string;
  accountName: string;
  onCopy: (value?: string) => void;
}) {
  const detailRows = [
    { label: "Account Name", value: accountName, mono: false },
    { label: "Bank", value: bankName, mono: false },
  ];

  return (
    <GlassCard className="p-5 mb-6 bg-gradient-to-br from-emerald-50/80 to-blue-50/80 dark:from-emerald-950/20 dark:to-blue-950/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
          <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>Pay by Bank Transfer</h2>
          <p className="text-xs text-muted-foreground">Transfer directly to the account below</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-input-background border border-border">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Account Number</p>
            <p className="font-mono text-lg font-semibold tracking-wide text-foreground">{accountNumber}</p>
          </div>
          <button
            onClick={() => onCopy(accountNumber)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent/70 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>

        {detailRows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-input-background border border-border">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{row.label}</p>
            <p className={`font-medium text-foreground ${row.mono ? "font-mono tracking-wide" : ""}`}>{row.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or pay online</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </GlassCard>
  );
}