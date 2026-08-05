import { describe, it, expect } from "vitest";
import {
  computeInvoiceTotals,
  validateLineItems,
  formatCurrency,
} from "@/app/lib/invoiceMath";

describe("computeInvoiceTotals", () => {
  it("computes subtotal, vat, and total for items with discounts", () => {
    const items = [
      { description: "Consulting", quantity: 2, rate: 100, discount: 10 },
      { description: "Design", quantity: 1, rate: 50, discount: 0 },
    ];
    // line 1: 2*100 = 200 - 20 (10%) = 180 ; line 2: 50 -> subtotal 230
    const totals = computeInvoiceTotals(items, true, 7.5);
    expect(totals.subtotal).toBe(230);
    expect(totals.vat).toBe(17.25); // 230 * 0.075
    expect(totals.total).toBe(247.25);
  });

  it("returns zero vat when VAT is disabled", () => {
    const totals = computeInvoiceTotals([{ description: "x", quantity: 3, rate: 10, discount: 0 }], false, 7.5);
    expect(totals.subtotal).toBe(30);
    expect(totals.vat).toBe(0);
    expect(totals.total).toBe(30);
  });

  it("rounds to two decimals to match backend persistence", () => {
    const items = [
      { description: "a", quantity: 1, rate: 10.333, discount: 0 },
      { description: "b", quantity: 1, rate: 10.334, discount: 0 },
    ];
    const totals = computeInvoiceTotals(items, false, 7.5);
    expect(totals.subtotal).toBe(20.67);
    expect(totals.total).toBe(20.67);
  });

  it("handles empty item lists", () => {
    const totals = computeInvoiceTotals([], true, 7.5);
    expect(totals).toEqual({ subtotal: 0, vat: 0, total: 0 });
  });

  it("coerces string numeric inputs like the backend parseFloat", () => {
    const items = [{ description: "x", quantity: "2" as unknown as number, rate: "50" as unknown as number, discount: "0" as unknown as number }];
    const totals = computeInvoiceTotals(items, false, 7.5);
    expect(totals.subtotal).toBe(100);
  });
});

describe("validateLineItems", () => {
  it("rejects an empty list", () => {
    expect(validateLineItems([])).toMatch(/line item/);
  });

  it("rejects a missing description", () => {
    expect(validateLineItems([{ description: "", quantity: 1, rate: 10, discount: 0 }])).toMatch(/description/);
  });

  it("rejects a non-positive quantity", () => {
    expect(
      validateLineItems([{ description: "x", quantity: 0, rate: 10, discount: 0 }])
    ).toMatch(/quantity/);
  });

  it("rejects a NaN quantity (regression: free-plan NaN bug)", () => {
    expect(
      validateLineItems([{ description: "x", quantity: Number.NaN, rate: 10, discount: 0 }])
    ).toMatch(/quantity/);
  });

  it("rejects a negative rate", () => {
    expect(
      validateLineItems([{ description: "x", quantity: 1, rate: -5, discount: 0 }])
    ).toMatch(/rate/);
  });

  it("rejects a discount outside 0-100", () => {
    expect(
      validateLineItems([{ description: "x", quantity: 1, rate: 10, discount: 120 }])
    ).toMatch(/discount/);
  });

  it("accepts a valid item", () => {
    expect(validateLineItems([{ description: "x", quantity: 1, rate: 10, discount: 0 }])).toBeNull();
  });
});

describe("formatCurrency", () => {
  it("formats as NGN currency", () => {
    expect(formatCurrency(100)).toContain("100");
  });

  it("formats whole amounts without decimals", () => {
    const out = formatCurrency(193.5);
    expect(out).toContain("193.5");
  });
});