/**
 * File Upload Component
 *
 * Drag-drop file upload with preview and progress tracking
 * 100% design token compliant - no hardcoded values
 *
 * @module components/ui/file-upload
 */

"use client"

import { CloudArrowUpIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { FileItem } from "./FileItem"
import type { FileUploadProps } from "./types"
import { useFileUpload } from "./useFileUpload"

/**
 * FileUpload - Drag-drop file upload component
 *
 * @example
 * ```tsx
 * import { FileUpload } from "@/components/ui/file-upload"
 *
 * <FileUpload
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   maxFiles={5}
 *   multiple
 *   onFilesChange={(files) => console.log(files)}
 *   showPreview
 * />
 * ```
 */
export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  allowedTypes,
  maxFiles = 10,
  minFiles = 0,
  disabled = false,
  isLoading = false,
  onFilesChange,
  onUpload,
  onRemove,
  onError,
  showPreview = true,
  showProgress = true,
  variant = "default",
  label = "Upload Files",
  description = "Drag and drop files here, or click to browse",
  dragMessage = "Drop files here",
  errorMessage = "File upload error",
  className = "",
}: FileUploadProps) {
  const {
    files,
    addFiles,
    removeFile,
    clearFiles,
    updateFileStatus,
    isDragging,
    setIsDragging,
    validateFiles,
  } = useFileUpload({
    maxSize,
    allowedTypes,
    maxFiles,
    minFiles,
    onFilesChange,
    onError,
  })

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isLoading) {
        setIsDragging(true)
      }
    },
    [disabled, isLoading, setIsDragging]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    },
    [setIsDragging]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled || isLoading) return

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles)
      }
    },
    [disabled, isLoading, addFiles, setIsDragging]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        addFiles(selectedFiles)
      }
      // Reset input value so same file can be selected again
      e.target.value = ""
    },
    [addFiles]
  )

  const handleRemove = useCallback(
    (fileId: string) => {
      removeFile(fileId)
      onRemove?.(fileId)
    },
    [removeFile, onRemove]
  )

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) {
      document.getElementById(`file-input-${Math.random()}`)?.click()
    }
  }, [disabled, isLoading])

  // Compact variant (card style)
  if (variant === "compact") {
    return (
      <div className={cn("space-y-[var(--spacing-sm)]", className)}>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id={`file-input-${Math.random()}`}
          disabled={disabled || isLoading}
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isLoading || (maxFiles > 0 && files.length >= maxFiles)}
          className={cn(
            "w-full p-[var(--spacing-md)]",
            "border-2 border-dashed border-[var(--fg-20)]",
            "rounded-[var(--radius-md)]",
            "flex flex-col items-center justify-center gap-[var(--spacing-sm)]",
            "transition-all duration-[var(--duration-fast)]",
            "hover:border-[var(--color-primary)] hover:bg-[var(--bg-5)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
            isDragging && "border-[var(--color-primary)] bg-[var(--bg-5)]",
            (disabled || isLoading) && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] text-[var(--fg-40)]" />
          <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{label}</span>
        </button>

        {files.length > 0 && (
          <div className="space-y-[var(--spacing-xs)]">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={handleRemove}
                showPreview={showPreview}
                showProgress={showProgress}
                disabled={disabled || isLoading}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Card variant (with description)
  if (variant === "card") {
    return (
      <div className={cn("space-y-[var(--spacing-md)]", className)}>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id={`file-input-${Math.random()}`}
          disabled={disabled || isLoading}
        />

        <div
          onClick={handleClick}
          className={cn(
            "p-[var(--spacing-lg)]",
            "border-2 border-dashed border-[var(--fg-20)]",
            "rounded-[var(--radius-lg)]",
            "flex flex-col items-center justify-center gap-[var(--spacing-sm)]",
            "transition-all duration-[var(--duration-fast)]",
            "hover:border-[var(--color-primary)] hover:bg-[var(--bg-5)]",
            "cursor-pointer",
            isDragging && "border-[var(--color-primary)] bg-[var(--bg-5)]",
            (disabled || isLoading) && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="w-[var(--icon-size-xl)] h-[var(--icon-size-xl)] text-[var(--fg-40)]" />
          <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">
            {isDragging ? dragMessage : label}
          </p>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-50)] text-center">
            {description}
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-[var(--spacing-sm)]">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={handleRemove}
                showPreview={showPreview}
                showProgress={showProgress}
                disabled={disabled || isLoading}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("space-y-[var(--spacing-md)]", className)}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        id={`file-input-${Math.random()}`}
        disabled={disabled || isLoading}
      />

      <div
        onClick={handleClick}
        className={cn(
          "p-[var(--spacing-xl)]",
          "border-2 border-dashed border-[var(--fg-20)]",
          "rounded-[var(--radius-lg)]",
          "flex flex-col items-center justify-center gap-[var(--spacing-md)]",
          "transition-all duration-[var(--duration-fast)]",
          "hover:border-[var(--color-primary)] hover:bg-[var(--bg-5)]",
          "cursor-pointer",
          isDragging && "border-[var(--color-primary)] bg-[var(--bg-5)]",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-[var(--spacing-md)] bg-[var(--bg-10)] rounded-full">
          <CloudArrowUpIcon className="w-[var(--icon-size-xl)] h-[var(--icon-size-xl)] text-[var(--color-primary)]" />
        </div>
        <div className="text-center">
          <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">
            {isDragging ? dragMessage : label}
          </p>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-50)] mt-[var(--spacing-xs)]">
            {description}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-[var(--spacing-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
              {files.length} {files.length === 1 ? "file" : "files"} selected
            </p>
            {files.length > 0 && (
              <button
                type="button"
                onClick={clearFiles}
                disabled={disabled || isLoading}
                className={cn(
                  "text-[var(--font-size-sm)] text-[var(--color-error)]",
                  "hover:underline",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-[var(--spacing-xs)]">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={handleRemove}
                showPreview={showPreview}
                showProgress={showProgress}
                disabled={disabled || isLoading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
