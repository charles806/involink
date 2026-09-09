import { cn } from "./ui/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  tone?: "light" | "dark" | "onDark";
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  tone = "light",
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: "h-7 w-7 rounded-lg", text: "text-base" },
    md: { icon: "h-9 w-9 rounded-xl", text: "text-lg" },
    lg: { icon: "h-11 w-11 rounded-xl", text: "text-2xl" },
  };

  const s = sizes[size];
  const textTone =
    tone === "onDark"
      ? "text-white"
      : tone === "dark"
        ? "text-emerald-900"
        : "text-slate-900 dark:text-white";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src="/involink-logo.jpg"
        alt="Involink"
        className={cn(s.icon, "object-cover shadow-e1 ring-1 ring-white/20 ring-inset")}
        aria-hidden
      />
      {showText && (
        <span
          className={cn(
            s.text,
            "font-display font-semibold tracking-tight",
            textTone
          )}
        >
          Involink
        </span>
      )}
    </span>
  );
}