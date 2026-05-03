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
      "bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.03)] dark:shadow-none",
    flat: "bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl",
    subtle:
      "bg-transparent border border-gray-200/30 dark:border-gray-700/30 rounded-2xl",
  };

  return (
    <div
      className={cn(
        variants[variant],
        "relative overflow-hidden",
        hover &&
          "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-gray-800/80",
        className
      )}
    >
      {variant === "elevated" && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
