import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/app/components/StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["paid", "Paid"],
    ["overdue", "Overdue"],
    ["draft", "Draft"],
    ["sent", "Sent"],
  ])("renders %s as %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("is case-insensitive", () => {
    render(<StatusBadge status="PAID" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("falls back to the raw value for unknown statuses", () => {
    render(<StatusBadge status="archived" />);
    expect(screen.getByText("archived")).toBeInTheDocument();
  });

  it("handles null/undefined without crashing", () => {
    const { container } = render(<StatusBadge status={undefined as unknown as string} />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
