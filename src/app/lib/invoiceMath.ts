export interface LineItemInput {
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  unit?: string;
}

export function computeInvoiceTotals(
  items: LineItemInput[],
  vatEnabled: boolean,
  taxRate: number
): { subtotal: number; vat: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;
    const lineTotal = qty * rate;
    const afterDiscount = lineTotal - lineTotal * (discount / 100);
    return sum + afterDiscount;
  }, 0);

  const vat = vatEnabled ? subtotal * (Number(taxRate) / 100) : 0;
  const total = subtotal + vat;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function validateLineItems(items: LineItemInput[]): string | null {
  if (!Array.isArray(items) || items.length === 0) {
    return "At least one line item is required";
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.description || typeof item.description !== "string" || !item.description.trim()) {
      return `Item ${i + 1}: description is required`;
    }
    const qty = Number(item.quantity);
    if (item.quantity === undefined || item.quantity === null || !Number.isFinite(qty) || qty <= 0) {
      return `Item ${i + 1}: quantity must be greater than 0`;
    }
    const rate = Number(item.rate);
    if (item.rate === undefined || item.rate === null || !Number.isFinite(rate) || rate < 0) {
      return `Item ${i + 1}: rate cannot be negative`;
    }
    const discount = Number(item.discount);
    if (item.discount !== undefined && (!Number.isFinite(discount) || discount < 0 || discount > 100)) {
      return `Item ${i + 1}: discount must be between 0 and 100`;
    }
  }
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
