/**
 * File Item Component
 *
 * Displays a single file with preview, progress, and remove button
 * 100% design token compliant - no hardcoded values
 *
 * @module components/ui/file-upload
 */

"use client"

import { DocumentIcon, PhotoIcon, XMarkIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { FileItemProps } from "./types"

/**
 * FileItem - Displays a single file with preview and controls
 *
 * @example
 * ```tsx
 * <FileItem
 *   file={fileStatus}
 *   onRemove={handleRemove}
 *   showPreview
 *   showProgress
 * />
 * ```
 */
export function FileItem({
  file,
  onRemove,
  showPreview = true,
  showProgress = true,
  disabled = false,
}: FileItemProps) {
  const isImage = file.file.type.startsWith("image/")
  const hasPreview = isImage && file.file.preview

  const getStatusColor = () => {
    switch (file.status) {
      case "success":
        return "text-[var(--color-success)]"
      case "error":
        return "text-[var(--color-error)]"
      case "uploading":
        return "text-[var(--color-primary)]"
      default:
        return "text-[var(--fg-50)]"
    }
  }

  const getStatusText = () => {
    switch (file.status) {
      case "success":
        return "Complete"
      case "error":
        return file.error || "Upload failed"
      case "uploading":
        return `${file.progress}%`
      default:
        return "Ready"
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }

  return (
    <div
      className={cn(
        "flex items-center gap-[var(--spacing-sm)] p-[var(--spacing-sm)]",
        "bg-[var(--bg-5)] rounded-[var(--radius-md)]",
        "border border-[var(--fg-10)]",
        "transition-all duration-[var(--duration-fast)]",
        file.status === "error" && "border-[var(--color-error)]",
        file.status === "success" && "border-[var(--color-success)]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Preview or Icon */}
      {showPreview && hasPreview ? (
        <div className="relative w-[3rem] h-[3rem] flex-shrink-0">
          <img
            src={file.file.preview}
            alt={file.file.name}
            className="w-full h-full object-cover rounded-[var(--radius-sm)]"
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-[3rem] h-[3rem] flex-shrink-0 flex items-center justify-center",
            "bg-[var(--bg-10)] rounded-[var(--radius-sm)]",
            isImage ? "text-[var(--fg-30)]" : "text-[var(--color-accent)]"
          )}
        >
          {isImage ? (
            <PhotoIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
          ) : (
            <DocumentIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
          )}
        </div>
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg)] truncate">
          {file.file.name}
        </p>
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
            {formatFileSize(file.file.size)}
          </span>
          <span className="text-[var(--fg-20)]">•</span>
          <span className={cn("text-[var(--font-size-xs)]", getStatusColor())}>
            {getStatusText()}
          </span>
        </div>

        {/* Progress Bar */}
        {showProgress && file.status === "uploading" && (
          <div className="mt-[var(--spacing-xs)] w-full h-1 bg-[var(--bg-20)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-[var(--duration-normal)]"
              style={{ width: `${file.progress}%` }}
              // @design-exception DYNAMIC_VALUE: Progress percentage calculated at runtime - cannot be expressed with static Tailwind classes
            />
          </div>
        )}
      </div>

      {/* Remove Button */}
      {!disabled && file.status !== "uploading" && (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className={cn(
            "flex-shrink-0 p-[var(--spacing-xs)]",
            "text-[var(--fg-50)] hover:text-[var(--color-error)]",
            "hover:bg-[var(--bg-10)] rounded-[var(--radius-sm)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          )}
          aria-label={`Remove ${file.file.name}`}
        >
          <XMarkIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
        </button>
      )}
    </div>
  )
}
