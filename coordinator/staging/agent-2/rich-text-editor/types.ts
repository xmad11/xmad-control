/**
 * Rich Text Editor Types
 *
 * TypeScript types and interfaces for the Rich Text Editor component
 * 100% TypeScript compliant - no `any`, `never`, or `undefined` in interfaces
 *
 * @module components/ui/rich-text-editor/types
 */

import type { ReactNode } from "react"

/**
 * Rich Text Editor props interface
 */
export interface RichTextEditorProps {
  /** HTML content value */
  value?: string

  /** Callback when content changes */
  onChange?: (value: string) => void

  /** Placeholder text when empty */
  placeholder?: string

  /** Minimum height of the editor */
  minHeight?: string

  /** Maximum height of the editor (use 'none' for no limit) */
  maxHeight?: string

  /** Show/hide the formatting toolbar */
  showToolbar?: boolean

  /** Additional CSS classes */
  className?: string
}

/**
 * Toolbar Button props interface
 */
export interface ToolbarButtonProps {
  /** Click handler */
  onClick: () => void

  /** Whether the button is in active state */
  isActive?: boolean

  /** Button content */
  children: ReactNode

  /** Tooltip title */
  title: string
}

/**
 * Rich Text Editor Field props interface
 */
export interface RichTextEditorFieldProps extends RichTextEditorProps {
  /** Field label */
  label: string

  /** HTML content value */
  value: string

  /** Callback when content changes */
  onChange: (value: string) => void

  /** Show required indicator */
  required?: boolean

  /** Error message to display */
  error?: string

  /** Helper text to display */
  helperText?: string
}
