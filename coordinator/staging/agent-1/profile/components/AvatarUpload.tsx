/* ═══════════════════════════════════════════════════════════════════════════════
   AVATAR UPLOAD - Avatar upload modal with preview
   File selection and preview
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { PhotoIcon, XMarkIcon } from "@/components/icons"
import { memo, useCallback, useRef, useState } from "react"

interface AvatarUploadProps {
  currentAvatar?: string
  onSave: (avatarUrl: string) => void
  onClose: () => void
}

/**
 * Avatar Upload Modal - Upload or change profile picture
 *
 * Features:
 * - File selection
 * - Image preview
 * - Remove avatar option
 * - Save/Cancel buttons
 */
export function AvatarUpload({ currentAvatar, onSave, onClose }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentAvatar)
  const [_file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  /**
   * Handle upload button click
   */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Handle remove avatar
   */
  const handleRemove = useCallback(() => {
    setPreview(undefined)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (preview) {
      // In real app, would upload to server and get URL
      // For now, use the data URL
      onSave(preview)
    }
  }, [preview, onSave])

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <div
      className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-[var(--spacing-md)]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--fg)]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-[var(--modal-width-sm)] bg-[var(--bg)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)]">
        {/* Header */}
        <div className="flex items-center justify-between p-[var(--spacing-xl)] border-b border-[var(--fg-10)]">
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Change Photo</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-[var(--spacing-xs)] rounded-[var(--radius-full)] hover:bg-[var(--fg-10)] transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-60)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[var(--spacing-xl)]">
          {/* Preview */}
          <div className="flex justify-center mb-[var(--spacing-xl)]">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="h-[150px] w-[150px] rounded-[var(--radius-full)] object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 p-[var(--spacing-xs)] bg-[var(--color-error)] text-[var(--color-white)] rounded-full hover:bg-[var(--color-error)]/80 transition-colors"
                  aria-label="Remove photo"
                >
                  <XMarkIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                </button>
              </div>
            ) : (
              <div className="h-[150px] w-[150px] rounded-[var(--radius-full)] bg-[var(--fg-5)] flex items-center justify-center">
                <PhotoIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-30)]" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload avatar"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="w-full flex items-center justify-center gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-[var(--radius-lg)] border-[2px] border-dashed border-[var(--fg-30)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group"
          >
            <PhotoIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-50)] group-hover:text-[var(--color-primary)] transition-colors" />
            <span className="text-[var(--font-size-base)] font-medium text-[var(--fg-70)] group-hover:text-[var(--color-primary)] transition-colors">
              {preview ? "Choose different photo" : "Upload photo"}
            </span>
          </button>

          {/* Info */}
          <p className="text-[var(--font-size-sm)] text-[var(--fg-50)] text-center mt-[var(--spacing-md)]">
            JPG, PNG or GIF. Max 5MB.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-[var(--spacing-md)] mt-[var(--spacing-xl)] pt-[var(--spacing-md)] border-t border-[var(--fg-10)]">
            <button
              type="button"
              onClick={onClose}
              className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!preview}
              className="px-[var(--spacing-xl)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
            >
              Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AvatarUpload = memo(AvatarUpload)
