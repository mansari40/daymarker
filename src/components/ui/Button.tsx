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
      "inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const radius = "rounded-full";

    const sizes = {
      sm: "h-9 px-4 text-small",
      md: "h-[44px] px-5 text-body",
      lg: "h-12 px-6 text-body",
    };

    const variants = {
      primary:
        "bg-btn-primary-bg text-btn-primary-text hover:opacity-90",
      secondary:
        "bg-btn-secondary-bg text-text-primary border border-border-strong hover:bg-bg-panel-hover",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary",
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
