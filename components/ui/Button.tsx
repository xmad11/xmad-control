/* ═══════════════════════════════════════════════════════════════════════════════
   BUTTON - Consistent button component using design tokens
   All variants use tokens, no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type ButtonHtmlType = "button" | "submit" | "reset"

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const baseClasses =
  "inline-flex items-center justify-center font-medium transition-all duration-[var(--duration-normal)] disabled:opacity-[var(--opacity-muted)] disabled:cursor-not-allowed"

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-white)] hover:opacity-[var(--opacity-strong)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
  secondary:
    "bg-[var(--color-secondary)] text-[var(--color-white)] hover:opacity-[var(--opacity-strong)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
  outline:
    "border border-[var(--fg-20)] bg-transparent text-[var(--fg)] hover:bg-[var(--fg-5)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--fg-20)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
  ghost:
    "bg-transparent text-[var(--fg)] hover:bg-[var(--fg-5)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--fg-10)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] rounded-[var(--radius-md)] gap-[var(--spacing-xs)]",
  md: "px-[var(--spacing-lg)] py-[var(--spacing-md)] text-[var(--font-size-base)] rounded-[var(--radius-lg)] gap-[var(--spacing-sm)]",
  lg: "px-[var(--spacing-xl)] py-[var(--spacing-lg)] text-[var(--font-size-lg)] rounded-[var(--radius-xl)] gap-[var(--spacing-sm)]",
}

/**
 * Button - Consistent button using design tokens
 *
 * @example
 * <Button variant="primary" size="md" leftIcon={<Icon />}>
 *   Click me
 * </Button>
 */
export const Button = memo(function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-[var(--opacity-medium)]"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-[var(--opacity-full)]"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
})
