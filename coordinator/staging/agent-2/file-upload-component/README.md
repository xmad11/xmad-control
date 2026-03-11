# File Upload Component

A modern drag-drop file upload component with preview, progress tracking, and validation. Built with React hooks and 100% design token compliance.

## Features

- ✅ Drag & drop file upload
- ✅ Multiple file selection
- ✅ Image previews
- ✅ File validation (size, type, count)
- ✅ Upload progress tracking
- ✅ Error handling
- ✅ Three variants: default, compact, card
- ✅ 100% Design Token Compliant
- ✅ TypeScript strict typing (no `any`, `never`, `undefined`)
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Responsive design

## Installation

```bash
cp -r /coordinator/staging/agent-2/file-upload-component/* /components/ui/file-upload/
```

## Usage

### Basic Usage

```tsx
import { FileUpload } from "@/components/ui/file-upload"

<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={5}
  multiple
  onFilesChange={(files) => console.log(files)}
/>
```

### With Upload Handler

```tsx
import { FileUpload } from "@/components/ui/file-upload"

function ImageGalleryUpload() {
  const handleUpload = async (files) => {
    for (const file of files) {
      // Upload to server
      const formData = new FormData()
      formData.append("file", file)
      await fetch("/api/upload", { method: "POST", body: formData })
    }
  }

  return (
    <FileUpload
      accept="image/jpeg,image/png,image/webp"
      maxSize={10 * 1024 * 1024}
      multiple
      maxFiles={10}
      onUpload={handleUpload}
      showPreview
      showProgress
    />
  )
}
```

### Compact Variant

```tsx
<FileUpload
  variant="compact"
  label="Add Photos"
  accept="image/*"
  multiple
/>
```

### Card Variant

```tsx
<FileUpload
  variant="card"
  label="Upload Restaurant Images"
  description="JPEG, PNG or WebP. Max 5MB each."
  accept="image/jpeg,image/png,image/webp"
  maxSize={5 * 1024 * 1024}
  multiple
  maxFiles={10}
/>
```

### With Custom Validation

```tsx
<FileUpload
  accept=".pdf,.doc,.docx"
  allowedTypes={["application/pdf", "application/msword"]}
  maxSize={20 * 1024 * 1024} // 20MB
  minFiles={1}
  maxFiles={5}
  onError={(error) => alert(error)}
  onFilesChange={(files) => {
    if (files.length < 1) {
      alert("Please upload at least 1 file")
    }
  }}
/>
```

## Props Reference

### FileUploadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | - | HTML accept attribute (e.g., `"image/*"`, `".pdf"`) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxSize` | `number` | - | Max file size in bytes |
| `allowedTypes` | `string[]` | - | Allowed MIME types |
| `maxFiles` | `number` | `10` | Maximum number of files |
| `minFiles` | `number` | `0` | Minimum number of files |
| `disabled` | `boolean` | `false` | Disable the upload component |
| `isLoading` | `boolean` | `false` | Show loading state |
| `onFilesChange` | `(files) => void` | - | Callback when files change |
| `onUpload` | `(files) => Promise<void>` | - | Callback to upload files |
| `onRemove` | `(fileId) => void` | - | Callback when file is removed |
| `onError` | `(error) => void` | - | Callback on validation error |
| `showPreview` | `boolean` | `true` | Show image previews |
| `showProgress` | `boolean` | `true` | Show upload progress |
| `variant` | `"default" \| "compact" \| "card"` | `"default"` | Component style variant |
| `label` | `string` | `"Upload Files"` | Upload button label |
| `description` | `string` | `"Drag and drop..."` | Description text |
| `dragMessage` | `string` | `"Drop files here"` | Drag over message |
| `className` | `string` | `""` | Additional CSS classes |

### useFileUpload Hook

```typescript
const {
  files,              // FileUploadStatus[]
  addFiles,           // (files: FileList | File[]) => void
  removeFile,         // (fileId: string) => void
  clearFiles,         // () => void
  updateFileStatus,   // (fileId: string, status: Partial<FileUploadStatus>) => void
  isDragging,         // boolean
  setIsDragging,      // (dragging: boolean) => void
  validateFiles,      // (files: File[]) => { valid: File[], errors: string[] }
} = useFileUpload({
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ["image/jpeg"],
  maxFiles: 5,
  onFilesChange: (files) => console.log(files),
  onError: (error) => console.error(error),
})
```

## TypeScript Types

```typescript
interface FileWithPreview extends File {
  preview?: string  // Object URL for image preview
  id: string        // Unique identifier
}

interface FileUploadStatus {
  id: string
  file: FileWithPreview
  status: "pending" | "uploading" | "success" | "error"
  progress: number  // 0-100
  error?: string
}
```

## Examples

### Avatar Upload

```tsx
import { FileUpload } from "@/components/ui/file-upload"

function AvatarUpload({ currentAvatar }) {
  const handleUpload = async (files) => {
    const file = files[0]
    // Upload avatar
    await updateAvatar(file)
  }

  return (
    <FileUpload
      accept="image/jpeg,image/png,image/webp"
      maxSize={2 * 1024 * 1024} // 2MB
      multiple={false}
      variant="compact"
      label="Change Avatar"
      onUpload={handleUpload}
      onFilesChange={(files) => {
        if (files.length > 0) {
          // Preview new avatar
          setPreview(files[0].preview)
        }
      }}
    />
  )
}
```

### Restaurant Gallery Upload

```tsx
function RestaurantGalleryUpload() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (files) => {
    setUploading(true)
    try {
      // Upload all files
      await Promise.all(files.map(file => uploadImage(file)))
    } finally {
      setUploading(false)
    }
  }

  return (
    <FileUpload
      accept="image/jpeg,image/png,image/webp"
      maxSize={5 * 1024 * 1024}
      multiple
      maxFiles={10}
      minFiles={1}
      variant="card"
      label="Upload Restaurant Photos"
      description="Add high-quality photos of your restaurant. Max 10 photos, 5MB each."
      isLoading={uploading}
      onUpload={handleUpload}
      showPreview
      onError={(error) => toast.error(error)}
    />
  )
}
```

### Custom File List

```tsx
import { useFileUpload } from "@/components/ui/file-upload"
import { FileItem } from "@/components/ui/file-upload"

function CustomFileUpload() {
  const { files, addFiles, removeFile, isDragging, setIsDragging } = useFileUpload({
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8",
        isDragging && "border-primary bg-background"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        addFiles(e.dataTransfer.files)
      }}
    >
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        className="hidden"
        id="custom-upload"
      />
      <label htmlFor="custom-upload" className="cursor-pointer">
        Click to upload or drag files here
      </label>

      <div className="mt-4 space-y-2">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={removeFile}
          />
        ))}
      </div>
    </div>
  )
}
```

## File Structure

```
file-upload-component/
├── FileUpload.tsx    # Main component with drag-drop
├── FileItem.tsx      # Individual file display
├── useFileUpload.ts  # Custom hook for file management
├── types.ts          # TypeScript types
├── index.ts          # Export barrel
└── README.md         # This file
```

## Design Token Compliance

All components use design tokens exclusively:

```tsx
// Colors
className="border-[var(--fg-20)] text-[var(--color-primary)]"

// Spacing
className="p-[var(--spacing-md)] gap-[var(--spacing-sm)]"

// Typography
className="text-[var(--font-size-sm)] font-medium"

// Border Radius
className="rounded-[var(--radius-lg)]"

// Transitions
className="transition-all duration-[var(--duration-fast)]"
```

## Accessibility

- Semantic HTML structure
- ARIA labels for file inputs
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Error announcements

## Browser Support

Works in all modern browsers that support:
- Drag and Drop API
- File API
- ES6+ JavaScript

---

**Task:** #013 - File Upload Component
**Agent:** Agent-2
**Status:** ✅ Complete
