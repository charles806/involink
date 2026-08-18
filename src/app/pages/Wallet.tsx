import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "../components/GlassCard";
import {
  Banknote,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import api from "../lib/api";

const formatCurrency = (amount: number | null | undefined) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const WITHDRAWAL_STATUS: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  },
  success: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
  },
  reversed: {
    label: "Reversed",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  },
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

interface Bank {
  name: string;
  code: string;
}

export function Wallet() {
  const [balance, setBalance] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Withdrawal dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedAccount, setResolvedAccount] = useState<{ name: string } | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [bankSearch, setBankSearch] = useState("");

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const [balData, wdData] = await Promise.all([
        api.getBalance(),
        api.getWithdrawals({ page: String(page), limit: String(limit) }),
      ]);
      setBalance(balData);
      setWithdrawals(wdData.withdrawals || []);
      setTotal(wdData.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load wallet data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openDialog = async () => {
    setDialogOpen(true);
    setAccountNumber("");
    setAccountName("");
    setResolvedAccount(null);
    setWithdrawAmount("");
    setSelectedBank("");
    setBankSearch("");
    try {
      const bankList = await api.getBanks();
      setBanks(Array.isArray(bankList) ? bankList : []);
    } catch {
      toast.error("Failed to load banks");
    }
  };

  const handleResolveAccount = async () => {
    if (!accountNumber || !selectedBank) {
      toast.error("Select a bank and enter account number");
      return;
    }
    setIsResolving(true);
    setResolvedAccount(null);
    try {
      const data = await api.resolveAccount(accountNumber, selectedBank);
      setResolvedAccount({ name: data.account_name });
      setAccountName(data.account_name);
    } catch (err: any) {
      toast.error(err.message || "Could not verify account");
      setResolvedAccount(null);
    } finally {
      setIsResolving(false);
    }
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amt < 100) {
      toast.error("Minimum withdrawal is ₦100");
      return;
    }
    if (balance && amt > balance.available_balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!resolvedAccount) {
      toast.error("Please verify your account first");
      return;
    }

    const bank = banks.find((b) => b.code === selectedBank);
    setIsWithdrawing(true);
    try {
      await api.initiateWithdraw({
        amount: amt,
        bank_name: bank?.name || "",
        account_number: accountNumber,
        bank_code: selectedBank,
        account_name: accountName,
      });
      toast.success("Withdrawal initiated! Funds will arrive shortly.");
      setDialogOpen(false);
      loadData(true);
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wallet</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track your earnings and withdraw funds
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={isRefreshing}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
          aria-label="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          {/* Hero Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-6 sm:p-8 text-white shadow-e3"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-emerald-800/40 blur-xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider">
                  Available Balance
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                  {balance?.available_balance != null ? (
                    <AnimatedNumber value={balance.available_balance} />
                  ) : (
                    formatCurrency(0)
                  )}
                </p>
                {balance?.paystack_balance != null && (
                  <p className="mt-1 text-xs text-emerald-200">
                    Paystack balance: {formatCurrency(balance.paystack_balance)}
                  </p>
                )}
              </div>
              <button
                onClick={openDialog}
                disabled={!balance || balance.available_balance < 100}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-5 py-3 font-semibold shadow-e1 transition-all hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Banknote className="h-4 w-4" />
                Withdraw Funds
              </button>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="relative grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-e1"
            >
              <span className="h-1 w-full bg-blue-500" />
              <div className="flex items-center gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600/10">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-ledger text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Total Earned
                  </p>
                  <p className="mt-0.5 truncate text-xl font-semibold tracking-tight">
                    {balance?.total_earned != null ? (
                      <AnimatedNumber value={balance.total_earned} />
                    ) : (
                      formatCurrency(0)
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="relative grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-e1"
            >
              <span className="h-1 w-full bg-amber-500" />
              <div className="flex items-center gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-600/10">
                  <ArrowDownRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-ledger text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Total Withdrawn
                  </p>
                  <p className="mt-0.5 truncate text-xl font-semibold tracking-tight">
                    {balance?.total_withdrawn != null ? (
                      <AnimatedNumber value={balance.total_withdrawn} />
                    ) : (
                      formatCurrency(0)
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Withdrawal History */}
          <GlassCard className="overflow-hidden" variant="flat">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold tracking-tight">Withdrawal History</h2>
            </div>

            <div className="overflow-x-auto">
              {withdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-16">
                  <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-emerald-900/10 bg-emerald-600/5">
                    <ArrowUpRight className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">No withdrawals yet</h3>
                  <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                    When you withdraw funds, they will appear here.
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Date
                      </th>
                      <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Bank
                      </th>
                      <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Account
                      </th>
                      <th className="px-5 py-3 font-ledger text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w) => {
                      const status = WITHDRAWAL_STATUS[w.status] || WITHDRAWAL_STATUS.pending;
                      return (
                        <tr
                          key={w.id}
                          className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
                        >
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {w.created_at
                              ? new Date(w.created_at).toLocaleDateString("en-NG", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-5 py-4 font-ledger text-sm font-semibold text-foreground">
                            {formatCurrency(w.amount)}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {w.bank_name}
                          </td>
                          <td className="px-5 py-4 font-ledger text-xs text-muted-foreground">
                            {w.account_number}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                              {status.label}
                            </span>
                            {w.failure_reason && w.status === "failed" && (
                              <p className="mt-1 text-xs text-red-500">{w.failure_reason}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {total > limit && (
              <div className="flex items-center justify-between gap-3 border-t border-border p-4">
                <p className="text-sm text-muted-foreground">
                  {total} withdrawal{total === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-muted-foreground">Page {page}</span>
                  <button
                    onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
                    disabled={page * limit >= total}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </>
      )}

      {/* Withdrawal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer money from your balance to your bank account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount (NGN)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₦
                </span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setResolvedAccount(null);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-xl text-foreground font-ledger focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
              {balance && (
                <p className="text-xs text-muted-foreground">
                  Available: {formatCurrency(balance.available_balance)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Bank</label>
              <Select
                value={selectedBank}
                onValueChange={(val) => {
                  setSelectedBank(val);
                  setResolvedAccount(null);
                }}
              >
                <SelectTrigger className="w-full bg-input-background border-border rounded-xl">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <div className="px-2 py-1.5 sticky top-0 bg-popover">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Search banks..."
                        className="w-full pl-7 pr-2 py-1.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                  {filteredBanks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setAccountNumber(val);
                    setResolvedAccount(null);
                  }}
                  placeholder="0123456789"
                  className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl text-foreground font-ledger tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                <button
                  onClick={handleResolveAccount}
                  disabled={isResolving || !accountNumber || !selectedBank}
                  className="shrink-0 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResolving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>

            {resolvedAccount && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  {resolvedAccount.name}
                </span>
              </motion.div>
            )}

            {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
              <div className="rounded-lg border border-border bg-input-background px-4 py-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(Math.max(0, parseFloat(withdrawAmount) - 10))}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Transfer fee</span>
                  <span>{formatCurrency(10)}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <button
              onClick={handleWithdraw}
              disabled={
                isWithdrawing ||
                !resolvedAccount ||
                !withdrawAmount ||
                parseFloat(withdrawAmount) < 100
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-e1 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Banknote className="h-4 w-4" />
                  Confirm Withdrawal
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Wallet;
