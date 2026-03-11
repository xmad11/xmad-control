/**
 * Image Gallery Section - Restaurant image management
 *
 * Drag-and-drop image upload, gallery management, and reordering.
 */

"use client"

import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from "@/components/icons"
import { memo, useCallback, useRef, useState } from "react"
import type { RestaurantImage } from "./types"

/**
 * Image card component for gallery grid
 */
function ImageCard({
  image,
  onEdit,
  onDelete,
  onToggleActive,
  isDragging,
}: {
  image: RestaurantImage
  onEdit: (image: RestaurantImage) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  isDragging?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)] transition-all duration-[var(--duration-fast)] ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${isHovered ? "shadow-[var(--shadow-lg)]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <img
        src={image.url}
        alt={image.alt}
        className="h-full w-full object-cover transition-transform duration-[var(--duration-normal)] group-hover:scale-105"
      />

      {/* Overlay with actions */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-[var(--spacing-sm)] bg-[var(--fg-80)] transition-opacity duration-[var(--duration-fast)] ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={() => onToggleActive(image.id)}
            className={`p-[var(--spacing-sm)] rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] ${
              image.isActive
                ? "bg-[var(--color-success)] text-white"
                : "bg-[var(--bg)] text-[var(--fg)]"
            }`}
            title={image.isActive ? "Active" : "Inactive"}
          >
            <EyeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(image)}
            className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white transition-all duration-[var(--duration-fast)]"
            title="Edit"
          >
            <PencilIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-white transition-all duration-[var(--duration-fast)]"
            title="Delete"
          >
            <TrashIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          </button>
        </div>
      </div>

      {/* Active indicator */}
      {!image.isActive && (
        <div className="absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[var(--fg-70)] text-[var(--color-white)] text-[var(--font-size-2xs)] font-medium">
          Hidden
        </div>
      )}
    </div>
  )
}

/**
 * Upload zone component with drag-drop support
 */
function UploadZone({
  onUpload,
  isUploading,
  accept = "image/*",
  multiple = true,
}: {
  onUpload: (files: File[]) => void
  isUploading: boolean
  accept?: string
  multiple?: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      )

      if (files.length > 0) {
        onUpload(files)
      }
    },
    [onUpload]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) {
        onUpload(files)
      }
      // Reset input value to allow selecting same file again
      e.target.value = ""
    },
    [onUpload]
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-[var(--spacing-md)] p-[var(--spacing-2xl)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-dashed transition-all duration-[var(--duration-fast)] cursor-pointer ${
        isDragging
          ? "border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)]"
          : "border-[var(--fg-20)] bg-[var(--bg-70)] hover:border-[var(--fg-40)] hover:bg-[var(--bg-80)]"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload images"
      />

      {isUploading ? (
        <>
          <ArrowPathIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] animate-spin text-[var(--color-primary)]" />
          <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
            Uploading images...
          </p>
        </>
      ) : (
        <>
          <CloudArrowUpIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-50)]" />
          <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
            <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">
              Drop images here or click to upload
            </p>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              JPG, PNG, GIF up to 5MB each
            </p>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Image edit modal component
 */
function EditImageModal({
  image,
  onSave,
  onCancel,
}: {
  image: RestaurantImage
  onSave: (alt: string) => void
  onCancel: () => void
}) {
  const [alt, setAlt] = useState(image.alt)

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--fg-80)]">
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-xl)] rounded-[var(--radius-xl)] bg-[var(--bg)] shadow-[var(--shadow-2xl)] max-w-[var(--max-w-xl)] w-full mx-[var(--spacing-md)]">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          Edit Image Details
        </h3>

        {/* Preview */}
        <div className="aspect-[var(--spacing-4xl)] overflow-hidden rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <img src={image.url} alt="Preview" className="h-full w-full object-cover" />
        </div>

        {/* Alt text input */}
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <label
            htmlFor="image-alt"
            className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
          >
            Alt Text (for accessibility)
          </label>
          <input
            id="image-alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for screen readers"
            className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(alt)}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Image Gallery Section Component
 *
 * @example
 * <ImageGallerySection images={images} onUpload={(files) => uploadImages(files)} />
 */
export function ImageGallerySection({
  images,
  onUpload,
  onDelete,
  onUpdate,
  onReorder,
  isLoading = false,
}: {
  images: RestaurantImage[]
  onUpload: (files: File[]) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<RestaurantImage>) => void
  onReorder: (images: RestaurantImage[]) => void
  isLoading?: boolean
}) {
  const [editingImage, setEditingImage] = useState<RestaurantImage | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleUpload = (files: File[]) => {
    onUpload(files)
  }

  const handleEdit = (image: RestaurantImage) => {
    setEditingImage(image)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      onDelete(id)
    }
  }

  const handleToggleActive = (id: string) => {
    const image = images.find((img) => img.id === id)
    if (image) {
      onUpdate(id, { isActive: !image.isActive })
    }
  }

  const handleSaveEdit = (alt: string) => {
    if (editingImage) {
      onUpdate(editingImage.id, { alt })
      setEditingImage(null)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    onReorder(newImages.map((img, idx) => ({ ...img, order: idx })))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <PhotoIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Image Gallery
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Manage your restaurant photos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[var(--spacing-md)]">
          <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
            {images.filter((img) => img.isActive).length} of {images.length} visible
          </span>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone onUpload={handleUpload} isUploading={isLoading} />

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="cursor-move"
            >
              <ImageCard
                image={image}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                isDragging={draggedIndex === index}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[var(--spacing-4xl)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <PhotoIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-30)] mb-[var(--spacing-md)]" />
          <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">
            No images yet. Upload your first image above.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          onSave={handleSaveEdit}
          onCancel={() => setEditingImage(null)}
        />
      )}
    </div>
  )
}

export const ImageGallerySection = memo(ImageGallerySection)
