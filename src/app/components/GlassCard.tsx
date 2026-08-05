import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "elevated" | "flat" | "subtle";
}

export function GlassCard({
  children,
  className,
  hover = false,
  variant = "elevated",
}: GlassCardProps) {
  const variants = {
    elevated:
      "bg-card/85 backdrop-blur-xl border border-border rounded-2xl shadow-e1 dark:shadow-none",
    flat: "bg-card/70 backdrop-blur-md border border-border rounded-2xl",
    subtle: "bg-transparent border border-border/60 rounded-2xl",
  };

  return (
    <div
      className={cn(
        variants[variant],
        "relative",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-e2",
        className
      )}
    >
      {children}
    </div>
  );
}