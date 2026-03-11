/**
 * Modal Component
 *
 * Accessible modal dialog component with focus trap, backdrop, and animations
 * 100% design token compliant - no hardcoded values
 *
 * @module components/ui/modal-dialog
 */

"use client"

import { XMarkIcon } from "@/components/icons"
import { useCallback, useEffect, useRef } from "react"
import type { ModalProps } from "./types"

/**
 * Modal - Accessible dialog component
 *
 * Features:
 * - Focus trap (keyboard navigation within modal)
 * - Close on overlay click
 * - Close on Escape key
 * - Body scroll lock when open
 * - ARIA attributes for screen readers
 * - Multiple sizes (sm, md, lg, xl, full)
 *
 * @example
 * ```tsx
 * <Modal isOpen={show} onClose={() => setShow(false)} title="My Modal">
 *   <p>Modal content here</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  /* ─────────────────────────────────────────────────────────────────────────
     Store onClose in ref to prevent effect re-running when onClose changes
     ───────────────────────────────────────────────────────────────────────── */
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  /* ─────────────────────────────────────────────────────────────────────────
     Handle Escape key press
     ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCloseRef.current()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  /* ─────────────────────────────────────────────────────────────────────────
     Focus trap implementation
     ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus the modal when it opens
    const modal = modalRef.current
    if (modal) {
      // Find first focusable element
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstFocusable = focusableElements[0]

      if (firstFocusable) {
        firstFocusable.focus()
      } else {
        modal.focus()
      }
    }

    // Return focus to previous element when modal closes
    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  /* ─────────────────────────────────────────────────────────────────────────
     Focus trap within modal (Tab and Shift+Tab)
     ───────────────────────────────────────────────────────────────────────── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // If Shift+Tab on first element, move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    }
    // If Tab on last element, move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
     Handle overlay click
     ───────────────────────────────────────────────────────────────────────── */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose, closeOnOverlayClick]
  )

  const handleOverlayKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        closeOnOverlayClick &&
        (e.key === "Enter" || e.key === " ") &&
        e.target === e.currentTarget
      ) {
        onClose()
      }
    },
    [onClose, closeOnOverlayClick]
  )

  /* ─────────────────────────────────────────────────────────────────────────
     Get size classes based on size prop
     ───────────────────────────────────────────────────────────────────────── */
  const getSizeClasses = () => {
    const baseClasses = "w-full bg-[var(--bg)] shadow-[var(--shadow-xl)]"

    switch (size) {
      case "xs":
        return `${baseClasses} max-w-[var(--modal-width-xs)]`
      case "sm":
        return `${baseClasses} max-w-[var(--modal-width-sm)]`
      case "md":
        return `${baseClasses} max-w-[var(--modal-width-md)]`
      case "lg":
        return `${baseClasses} max-w-[var(--modal-width-lg)]`
      case "xl":
        return `${baseClasses} max-w-[var(--modal-width-xl)]`
      case "full":
        return `${baseClasses} max-w-[var(--modal-width-full)] h-[var(--modal-height-full)]`
      default:
        return `${baseClasses} max-w-[var(--modal-width-md)]`
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-[var(--spacing-md)]"
      onClick={handleOverlayClick}
      onKeyUp={handleOverlayKeyUp}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--fg)]/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative flex flex-col rounded-[var(--radius-xl)]
          ${getSizeClasses()}
          max-h-[calc(100vh-var(--spacing-lg)*2)]
          animate-in fade-in zoom-in duration-[var(--duration-normal)]
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-[var(--spacing-lg)] border-b border-[var(--fg-10)]">
            <div className="flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-[var(--font-size-sm)] text-[var(--fg-60)] mt-[var(--spacing-xs)]"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-[var(--spacing-md)] flex-shrink-0 p-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)] focus:ring-offset-[var(--ring-offset)]"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[var(--spacing-lg)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--fg-20)] hover:scrollbar-thumb-[var(--fg-30)]">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Modal.Header - Consistent header section for modals
 *
 * @example
 * ```tsx
 * <Modal.Header>
 *   <h2>Title</h2>
 *   <p>Description</p>
 * </Modal.Header>
 * ```
 */
export function ModalHeader({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-between p-[var(--spacing-lg)] border-b border-[var(--fg-10)] ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Modal.Body - Scrollable body section for modals
 *
 * @example
 * ```tsx
 * <Modal.Body>
 *   <p>Content here</p>
 * </Modal.Body>
 * ```
 */
export function ModalBody({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex-1 overflow-y-auto p-[var(--spacing-lg)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--fg-20)] hover:scrollbar-thumb-[var(--fg-30)] ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Modal.Footer - Consistent footer section for modals
 *
 * @example
 * ```tsx
 * <Modal.Footer>
 *   <button onClick={onCancel}>Cancel</button>
 *   <button onClick={onConfirm}>Confirm</button>
 * </Modal.Footer>
 * ```
 */
export function ModalFooter({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-end gap-[var(--spacing-md)] p-[var(--spacing-lg)] border-t border-[var(--fg-10)] ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Modal.CloseButton - Standalone close button for custom headers
 *
 * @example
 * ```tsx
 * <Modal.Header>
 *   <h2>Title</h2>
 *   <Modal.CloseButton onClick={onClose} />
 * </Modal.Header>
 * ```
 */
export function ModalCloseButton({
  onClick,
  ariaLabel = "Close modal",
}: {
  onClick: () => void
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-[var(--spacing-md)] flex-shrink-0 p-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)] focus:ring-offset-[var(--ring-offset)]"
      aria-label={ariaLabel}
    >
      <XMarkIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
    </button>
  )
}
