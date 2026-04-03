import { InputHTMLAttributes, forwardRef, type ReactNode } from "react";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "outlined" | "filled";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      size = "md",
      variant = "outlined",
      prefixIcon,
      suffixIcon,
      fullWidth = true,
      className = "",
      id,
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-xl font-sans transition-all duration-200 outline-none appearance-none";

    const variantStyles: Record<InputVariant, string> = {
      outlined: `
        border-2 border-primary-200 bg-white
        text-neutral-900 placeholder:text-neutral-400
        hover:border-primary-400
        focus:border-primary-500
      `,
      filled: `
        border border-transparent bg-neutral-50
        text-neutral-900 placeholder:text-neutral-400
        hover:bg-neutral-100
        focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
      `,
    };

    const errorStyles = error
      ? "!border-error-200 hover:!border-error-400 focus:!border-error-500"
      : "";

    const disabledStyles = disabled
      ? "!border-neutral-200 hover:!border-neutral-200 focus:!border-neutral-200"
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${fullWidth ? "w-full" : "inline-flex flex-col"}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center pointer-events-none">
              {prefixIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled || loading}
            className={`
              ${baseStyles}
              ${sizeStyles[size]}
              ${variantStyles[variant]}
              ${errorStyles}
              ${disabledStyles}
              ${widthStyles}
              ${prefixIcon ? "!pl-10" : ""}
              ${suffixIcon ? "!pr-10" : ""}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {suffixIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center">
              {suffixIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-error-500 text-xs mt-1.5 ml-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
