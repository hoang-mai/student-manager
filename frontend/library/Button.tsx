import { ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary-600 text-white border border-primary-600
    hover:bg-primary-700 hover:border-primary-700
    active:bg-primary-800
    focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2
  `,
  secondary: `
    bg-secondary-100 text-secondary-800 border border-secondary-200
    hover:bg-secondary-200 hover:border-secondary-300
    active:bg-secondary-300
    focus-visible:ring-2 focus-visible:ring-secondary-500/30 focus-visible:ring-offset-2
  `,
  outline: `
    bg-transparent text-primary-700 border border-primary-300
    hover:bg-primary-50 hover:border-primary-400
    active:bg-primary-100
    focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2
  `,
  ghost: `
    bg-transparent text-neutral-700 border border-transparent
    hover:bg-neutral-100
    active:bg-neutral-200
    focus-visible:ring-2 focus-visible:ring-neutral-500/30 focus-visible:ring-offset-2
  `,
  danger: `
    bg-error-500 text-white border border-error-500
    hover:bg-error-600 hover:border-error-600
    active:bg-error-700
    focus-visible:ring-2 focus-visible:ring-error-500/30 focus-visible:ring-offset-2
  `,
};

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "md",
      variant = "primary",
      fullWidth = false,
      loading = false,
      prefixIcon,
      suffixIcon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          rounded-xl font-semibold font-sans
          transition-all duration-200
          cursor-pointer select-none
          outline-none
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${fullWidth ? "w-full" : ""}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && prefixIcon && prefixIcon}
        {children}
        {!loading && suffixIcon && suffixIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
