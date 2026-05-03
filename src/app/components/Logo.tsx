import { cn } from "./ui/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7 text-sm rounded-md", text: "text-base" },
    md: { icon: "w-8 h-8 text-base rounded-lg", text: "text-xl" },
    lg: { icon: "w-10 h-10 text-lg rounded-xl", text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          s.icon,
          "bg-emerald-500 flex items-center justify-center text-white font-bold font-['Poppins'] shadow-lg shadow-emerald-500/30"
        )}
      >
        In
      </div>
      {showText && (
        <span
          className={cn(
            s.text,
            "font-bold font-['Poppins'] text-gray-900 dark:text-white tracking-tight"
          )}
        >
          Involink
        </span>
      )}
    </div>
  );
}
