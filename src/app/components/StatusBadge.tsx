import { cn } from "./ui/utils";

export type InvoiceStatus = "paid" | "overdue" | "draft" | "sent";

export function StatusBadge({ status }: { status: string | InvoiceStatus }) {
  const normalizedStatus = (status || "").toLowerCase() as InvoiceStatus;

  const styles: Record<InvoiceStatus, string> = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    overdue: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
    draft: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300 border-gray-200 dark:border-gray-500/30",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  };

  const displayText = {
    paid: "Paid",
    overdue: "Overdue",
    draft: "Draft",
    sent: "Sent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        styles[normalizedStatus] || styles.draft
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {displayText[normalizedStatus] || status}
    </span>
  );
}