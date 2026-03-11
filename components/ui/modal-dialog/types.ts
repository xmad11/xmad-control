/**
 * Modal Component Types
 *
 * TypeScript types and interfaces for the Modal component
 * 100% TypeScript compliant - no `any`, `never`, or `undefined` in interfaces
 *
 * @module components/ui/modal-dialog/types
 */

/**
 * Modal size variants
 */
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full"

/**
 * Modal props interface
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean

  /** Callback function to close the modal */
  onClose: () => void

  /** Modal title (displayed in header) */
  title?: string

  /** Modal description (for accessibility) */
  description?: string

  /** Modal content */
  children: React.ReactNode

  /** Size variant of the modal */
  size?: ModalSize

  /** Whether to show the close button in header */
  showCloseButton?: boolean

  /** Whether to close modal when clicking overlay */
  closeOnOverlayClick?: boolean

  /** Additional CSS classes */
  className?: string
}

/**
 * Modal header props
 */
export interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

/**
 * Modal body props
 */
export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

/**
 * Modal footer props
 */
export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

/**
 * Modal close button props
 */
export interface ModalCloseButtonProps {
  onClick: () => void
  ariaLabel?: string
}
