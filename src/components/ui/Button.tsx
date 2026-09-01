import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  trailing?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      trailing = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "pressable inline-flex items-center justify-center gap-2 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const radius = "rounded-full";

    const sizes = {
      sm: "h-9 px-4 text-small",
      md: "h-[44px] px-5 text-body",
      lg: "h-12 px-6 text-body",
    };

    const variants = {
      primary:
        "bg-btn-primary-bg text-btn-primary-text shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:shadow-lg hover:-translate-y-0.5",
      secondary:
        "bg-btn-secondary-bg text-text-primary border border-border-strong hover:bg-bg-panel-hover hover:-translate-y-0.5 hover:border-border-accent/40",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-panel-hover/60",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${radius} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
        {trailing && (
          <span className="ml-1 text-sm" aria-hidden="true">
            →
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };