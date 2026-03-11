/**
 * useFileUpload Hook
 *
 * Custom hook for handling file uploads with drag-drop support
 * 100% design token compliant - no hardcoded values
 *
 * @module components/ui/file-upload
 */

"use client"

import { useCallback, useState } from "react"
import type { FileUploadStatus, FileValidation, FileWithPreview } from "./types"

interface UseFileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  maxFiles?: number
  minFiles?: number
  onFilesChange?: (files: FileWithPreview[]) => void
  onError?: (error: string) => void
}

interface UseFileUploadReturn {
  files: FileUploadStatus[]
  addFiles: (newFiles: FileList | File[]) => void
  removeFile: (fileId: string) => void
  clearFiles: () => void
  updateFileStatus: (fileId: string, status: Partial<FileUploadStatus>) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  validateFiles: (files: File[]) => { valid: File[]; errors: string[] }
}

/**
 * Custom hook for file upload functionality
 *
 * @example
 * ```tsx
 * const { files, addFiles, removeFile, isDragging, setIsDragging } = useFileUpload({
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedTypes: ["image/jpeg", "image/png"],
 *   maxFiles: 5,
 * })
 * ```
 */
export function useFileUpload({
  maxSize,
  allowedTypes,
  maxFiles = 10,
  minFiles = 0,
  onFilesChange,
  onError,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [files, setFiles] = useState<FileUploadStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)

  /**
   * Validate files against constraints
   */
  const validateFiles = useCallback(
    (filesToValidate: File[]): { valid: File[]; errors: string[] } => {
      const valid: File[] = []
      const errors: string[] = []

      for (const file of filesToValidate) {
        // Check file size
        if (maxSize && file.size > maxSize) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
          errors.push(`${file.name} exceeds maximum size of ${maxSizeMB}MB`)
          continue
        }

        // Check file type
        if (allowedTypes && allowedTypes.length > 0) {
          const fileExt = file.type
          if (!allowedTypes.includes(fileExt)) {
            errors.push(`${file.name} is not an allowed file type`)
            continue
          }
        }

        valid.push(file)
      }

      // Check max files
      if (maxFiles && files.length + valid.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        return { valid: [], errors }
      }

      return { valid, errors }
    },
    [maxSize, allowedTypes, maxFiles, files.length]
  )

  /**
   * Create file with preview
   */
  const createFileWithPreview = useCallback((file: File): FileWithPreview => {
    const fileWithPreview = file as FileWithPreview
    fileWithPreview.id = `${file.name}-${Date.now()}-${Math.random()}`

    // Create preview for images
    if (file.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }

    return fileWithPreview
  }, [])

  /**
   * Add files to the upload list
   */
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const { valid, errors } = validateFiles(fileArray)

      // Report errors
      if (errors.length > 0 && onError) {
        errors.forEach((error) => onError(error))
      }

      // Add valid files
      if (valid.length > 0) {
        const newFileStatuses: FileUploadStatus[] = valid.map((file) => ({
          id: createFileWithPreview(file).id,
          file: createFileWithPreview(file),
          status: "pending",
          progress: 0,
        }))

        setFiles((prev) => {
          const updated = [...prev, ...newFileStatuses]
          const filesWithPreview = updated.map((f) => f.file)
          onFilesChange?.(filesWithPreview)
          return updated
        })
      }
    },
    [validateFiles, createFileWithPreview, onError, onFilesChange]
  )

  /**
   * Remove a file from the list
   */
  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === fileId)

        // Revoke preview URL to free memory
        if (fileToRemove?.file.preview) {
          URL.revokeObjectURL(fileToRemove.file.preview)
        }

        const updated = prev.filter((f) => f.id !== fileId)
        const filesWithPreview = updated.map((f) => f.file)
        onFilesChange?.(filesWithPreview)
        return updated
      })
    },
    [onFilesChange]
  )

  /**
   * Clear all files
   */
  const clearFiles = useCallback(() => {
    // Revoke all preview URLs
    files.forEach((f) => {
      if (f.file.preview) {
        URL.revokeObjectURL(f.file.preview)
      }
    })

    setFiles([])
    onFilesChange?.([])
  }, [files, onFilesChange])

  /**
   * Update file status (for upload progress)
   */
  const updateFileStatus = useCallback(
    (fileId: string, statusUpdate: Partial<FileUploadStatus>) => {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...statusUpdate } : f)))
    },
    []
  )

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    updateFileStatus,
    isDragging,
    setIsDragging,
    validateFiles,
  }
}
