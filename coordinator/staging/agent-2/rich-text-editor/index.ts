/**
 * Rich Text Editor - Barrel Export
 *
 * Re-exports all rich text editor components and types
 *
 * @module components/ui/rich-text-editor
 * @example
 * ```tsx
 * import { RichTextEditor, RichTextEditorField } from "@/components/ui/rich-text-editor"
 *
 * <RichTextEditor value={content} onChange={setContent} />
 * ```
 */

export { RichTextEditor, RichTextEditorField } from "./RichTextEditor"
export type {
  RichTextEditorProps,
  RichTextEditorFieldProps,
} from "./types"
