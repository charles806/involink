import { useEffect, useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusBadge } from "../components/StatusBadge";
import { Download, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

const formatCurrency = (amount: number | null | undefined) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const PAYMENT_STATUS: Record<string, { label: string; tone: any }> = {
  success: { label: "Completed", tone: "paid" },
  completed: { label: "Completed", tone: "paid" },
  failed: { label: "Failed", tone: "overdue" },
  pending: { label: "Pending", tone: "draft" },
};

export function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoice, setInvoice] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fromDate, toDate, invoice, page]);

  const load = async () => {
    setIsLoading(true);
    try {
      const filters: Record<string, string> = {
        status,
        from_date: fromDate,
        to_date: toDate,
        invoice,
        page: String(page),
        limit: String(limit),
      };
      const data = await api.getPaymentHistory(filters);
      setPayments(data.payments || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payment history");
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const header = ["Date", "Invoice", "Reference", "Amount", "Status", "Channel"];
    const rows = payments.map((p) => [
      p.created_at ? new Date(p.created_at).toLocaleDateString("en-NG") : "",
      p.invoice_number || "",
      p.reference || "",
      formatCurrency(p.amount),
      PAYMENT_STATUS[p.status]?.label || p.status,
      p.channel || (p.invoice_number ? "paystack" : "card"),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `involink-payments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterInputClass =
    "w-full lg:w-56 px-3 py-2 border border-border bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payment History</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">All payments across your invoices</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={payments.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <GlassCard variant="flat" className="overflow-hidden">
        <div className="flex flex-wrap items-end gap-3 border-b border-border p-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Status
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={filterInputClass}>
              <option value="">All</option>
              <option value="success">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            From
            <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className={filterInputClass} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            To
            <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className={filterInputClass} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Invoice
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={invoice}
                placeholder="Search invoice..."
                onChange={(e) => { setInvoice(e.target.value); setPage(1); }}
                className={`${filterInputClass} pl-9`}
              />
            </div>
          </label>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-emerald-600" />
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No payments found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Date</th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Invoice</th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Reference</th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Amount</th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Status</th>
                  <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-4 font-ledger text-sm font-medium text-foreground">{p.invoice_number || "Subscription"}</td>
                  <td className="px-5 py-4 font-ledger text-xs text-muted-foreground">{p.reference}</td>
                  <td className="px-5 py-4 font-ledger text-sm font-semibold text-foreground">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={PAYMENT_STATUS[p.status]?.tone || "draft"} />
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{p.channel || "card"}</td>
                </tr>
              ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            {total} payment{total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <button
              onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default PaymentHistory;