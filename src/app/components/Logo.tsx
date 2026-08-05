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
    sm: { icon: "h-7 w-7 text-[15px] rounded-lg", glyph: "h-4 w-4", text: "text-base" },
    md: { icon: "h-8 w-8 text-base rounded-xl", glyph: "h-4.5 w-4.5", text: "text-lg" },
    lg: { icon: "h-10 w-10 text-xl rounded-xl", glyph: "h-5 w-5", text: "text-2xl" },
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
      <span
        className={cn(
          s.icon,
          "relative grid place-items-center bg-gradient-to-br from-emerald-500 to-emerald-600 font-display font-bold text-white shadow-e1 ring-1 ring-white/20 ring-inset"
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className={cn(s.glyph, "drop-shadow-sm")} fill="none" aria-hidden="true">
          <path
            d="M7 9.5 12 8v10M10 8v10M12 13H7M14 13h-2M15.6 12.2 17 14l4.5-4"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
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