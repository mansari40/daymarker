import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelClassName = "", error, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-label font-semibold uppercase tracking-widest text-accent-400 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-[--radius-md] bg-bg-input px-4 py-3 text-text-primary border border-border-subtle
            placeholder:text-text-tertiary focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent
            transition-colors ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && <p className="text-small text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
