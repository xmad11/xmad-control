/**
 * File Upload Component Types
 *
 * Type definitions for file upload functionality
 * No `any`, `undefined`, or `never` types (unless genuinely unreachable)
 */

/**
 * File validation options
 */
export interface FileValidation {
  maxSize?: number // Maximum file size in bytes
  allowedTypes?: string[] // MIME types (e.g., ["image/jpeg", "image/png"])
  maxFiles?: number // Maximum number of files
  minFiles?: number // Minimum number of files
}

/**
 * File with preview URL
 */
export interface FileWithPreview extends File {
  preview?: string
  id: string
}

/**
 * Upload status for a file
 */
export interface FileUploadStatus {
  id: string
  file: FileWithPreview
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

/**
 * File upload component props
 */
export interface FileUploadProps {
  accept?: string // HTML accept attribute (e.g., "image/*,.pdf")
  multiple?: boolean
  maxSize?: number // Max file size in bytes
  allowedTypes?: string[] // MIME types
  maxFiles?: number
  minFiles?: number
  disabled?: boolean
  isLoading?: boolean

  // Callbacks
  onFilesChange?: (files: FileWithPreview[]) => void
  onUpload?: (files: FileWithPreview[]) => Promise<void>
  onRemove?: (fileId: string) => void
  onError?: (error: string) => void

  // UI Options
  showPreview?: boolean
  showProgress?: boolean
  variant?: "default" | "compact" | "card"

  // Labels
  label?: string
  description?: string
  dragMessage?: string
  errorMessage?: string

  className?: string
}

/**
 * File item component props
 */
export interface FileItemProps {
  file: FileUploadStatus
  onRemove: (fileId: string) => void
  showProgress?: boolean
  showPreview?: boolean
  disabled?: boolean
}
