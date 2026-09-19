import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost" | "icon";

export function Button({
  className,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  className?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-primary px-3.5 py-2 text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
          "border border-border bg-card px-3.5 py-2 hover:bg-accent",
        variant === "ghost" &&
          "px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground",
        variant === "icon" &&
          "size-9 text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function fieldClassName() {
  return "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";
}
